import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import * as argon2 from 'argon2';
import { IsNull, Repository } from 'typeorm';
import { PasswordResetToken } from '../database/entities/password-reset-token.entity.js';
import { RefreshToken } from '../database/entities/refresh-token.entity.js';
import type { User } from '../database/entities/user.entity.js';
import { RevokedToken } from '../database/entities/revoked-token.entity.js';
import { UsersService } from '../users/users.service.js';
import type { RegisterDto } from './dto/register.dto.js';
import { MailService } from '../mail/mail.service.js';

const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;
const DEFAULT_REFRESH_TOKEN_TTL_DAYS = 30;

export type AuthTokensResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  user: { id: string; email: string; displayName: string | null };
};

const hashToken = (token: string) =>
  createHash('sha256').update(token).digest('hex');

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,

    @InjectRepository(RevokedToken)
    private readonly revokedTokens: Repository<RevokedToken>,

    @InjectRepository(PasswordResetToken)
    private readonly passwordResetTokens: Repository<PasswordResetToken>,

    @InjectRepository(RefreshToken)
    private readonly refreshTokens: Repository<RefreshToken>,

    private readonly config: ConfigService,
  ) {}

  private get refreshTokenTtlMs(): number {
    const days = Number(
      this.config.get('REFRESH_TOKEN_TTL_DAYS', DEFAULT_REFRESH_TOKEN_TTL_DAYS),
    );
    return (days > 0 ? days : DEFAULT_REFRESH_TOKEN_TTL_DAYS) * 24 * 60 * 60 * 1000;
  }

  // Выдаёт пару: короткий JWT access-токен + длинный случайный refresh-токен.
  private async issueTokens(
    user: Pick<User, 'id' | 'email' | 'displayName'>,
  ): Promise<AuthTokensResponse> {
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      jti: randomUUID(),
    });

    const refreshToken = randomBytes(48).toString('base64url');

    await this.refreshTokens.save(
      this.refreshTokens.create({
        userId: user.id,
        tokenHash: hashToken(refreshToken),
        expiresAt: new Date(Date.now() + this.refreshTokenTtlMs),
        revokedAt: null,
      }),
    );

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
      },
    };
  }

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await argon2.hash(dto.password);

    try {
      const user = await this.usersService.create({
        email: dto.email,
        passwordHash,
        displayName: dto.displayName,
      });

      return {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        createdAt: user.createdAt,
      };
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === '23505'
      ) {
        throw new ConflictException('Email already registered');
      }

      throw error;
    }
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user?.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.issueTokens(user);
  }

  // Ротация: старый refresh-токен отзывается, выдаётся новая пара.
  async refresh(rawRefreshToken: string) {
    const record = await this.refreshTokens.findOne({
      where: { tokenHash: hashToken(rawRefreshToken) },
    });

    if (!record || record.expiresAt.getTime() <= Date.now()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (record.revokedAt) {
      // Повторное использование отозванного токена — возможна кража: отзываем все сессии пользователя.
      await this.revokeAllRefreshTokens(record.userId);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.usersService.findById(record.userId);
    if (!user) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const result = await this.refreshTokens.update(
      { id: record.id, revokedAt: IsNull() },
      { revokedAt: new Date() },
    );
    if (!result.affected) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    return this.issueTokens(user);
  }

  async me(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      createdAt: user.createdAt,
    };
  }

  private async revokeAllRefreshTokens(userId: string) {
    await this.refreshTokens.update(
      { userId, revokedAt: IsNull() },
      { revokedAt: new Date() },
    );
  }

  async logout(
    payload: { jti: string; exp: number; userId: string },
    refreshToken?: string,
  ) {
    if (refreshToken) {
      await this.refreshTokens.update(
        {
          tokenHash: hashToken(refreshToken),
          userId: payload.userId,
          revokedAt: IsNull(),
        },
        { revokedAt: new Date() },
      );
    }

    if (!payload.jti || !payload.exp) {
      throw new UnauthorizedException('Invalid access token');
    }

    const existing = await this.revokedTokens.findOne({
      where: { tokenId: payload.jti },
    });

    if (!existing) {
      await this.revokedTokens.save(
        this.revokedTokens.create({
          tokenId: payload.jti,
          expiresAt: new Date(payload.exp * 1000),
        }),
      );
    }

    return { message: 'Logged out successfully' };
  }

  async isTokenRevoked(tokenId: string): Promise<boolean> {
    return this.revokedTokens.exists({
      where: { tokenId },
    });
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (user) {
      const rawToken = randomBytes(32).toString('hex');

      const tokenHash = hashToken(rawToken);

      await this.passwordResetTokens.delete({
        userId: user.id,
      });

      await this.passwordResetTokens.save(
        this.passwordResetTokens.create({
          userId: user.id,
          tokenHash,
          expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
          usedAt: null,
        }),
      );

      await this.mailService.sendPasswordResetEmail(user.email, rawToken);
    }

    return {
      message:
        'If an account with this email exists, password reset instructions will be sent.',
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const tokenHash = hashToken(token);

    const resetRecord = await this.passwordResetTokens.findOne({
      where: { tokenHash },
    });

    if (
      !resetRecord ||
      resetRecord.usedAt ||
      resetRecord.expiresAt.getTime() <= Date.now()
    ) {
      throw new UnauthorizedException(
        'Invalid or expired password reset token',
      );
    }

    const user = await this.usersService.findById(resetRecord.userId);

    if (!user) {
      throw new UnauthorizedException(
        'Invalid or expired password reset token',
      );
    }

    await this.passwordResetTokens.manager.transaction(async (manager) => {
      const lockedToken = await manager
        .createQueryBuilder(PasswordResetToken, 'token')
        .setLock('pessimistic_write')
        .where('token.id = :id', { id: resetRecord.id })
        .getOne();

      if (
        !lockedToken ||
        lockedToken.usedAt ||
        lockedToken.expiresAt.getTime() <= Date.now()
      ) {
        throw new UnauthorizedException(
          'Invalid or expired password reset token',
        );
      }

      const passwordHash = await argon2.hash(newPassword);

      await manager.update(
        'users',
        { id: user.id },
        { password_hash: passwordHash },
      );

      lockedToken.usedAt = new Date();
      await manager.save(PasswordResetToken, lockedToken);

      // После смены пароля выходим со всех устройств
      await manager.update(
        RefreshToken,
        { userId: user.id, revokedAt: IsNull() },
        { revokedAt: new Date() },
      );
    });

    return { message: 'Password has been reset successfully' };
  }
}
