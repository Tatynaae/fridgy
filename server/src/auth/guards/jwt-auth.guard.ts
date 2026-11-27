
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service.js';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing access token');
    }

    const token = authHeader.slice(7);

    let payload: Record<string, unknown>;
    try {
      payload = await this.jwtService.verifyAsync<Record<string, unknown>>(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }

    if (
      typeof payload.sub !== 'string' ||
      typeof payload.email !== 'string' ||
      typeof payload.jti !== 'string' ||
      typeof payload.exp !== 'number'
    ) {
      throw new UnauthorizedException('Invalid access token');
    }

    if (await this.authService.isTokenRevoked(payload.jti)) {
      throw new UnauthorizedException('Access token has been revoked');
    }

    request.user = {
      id: payload.sub,
      email: payload.email,
      jti: payload.jti,
      exp: payload.exp,
    };

    return true;
  }
}
