
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { registerSchema } from './dto/register.dto.js';
import { loginSchema } from './dto/login.dto.js';
import { forgotPasswordSchema } from './dto/forgot-password.dto.js';
import { resetPasswordSchema } from './dto/reset-password.dto.js';
import { logoutSchema, refreshSchema } from './dto/refresh.dto.js';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';

type AuthenticatedRequest = Request & {
  user: {
    id: string;
    email: string;
    jti: string;
    exp: number;
  };
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: unknown) {
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: result.error.issues,
      });
    }

    return this.authService.register(result.data);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: unknown) {
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: result.error.issues,
      });
    }

    return this.authService.login(
      result.data.email,
      result.data.password,
    );
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body() body: unknown) {
    const result = refreshSchema.safeParse(body);

    if (!result.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: result.error.issues,
      });
    }

    return this.authService.refresh(result.data.refreshToken);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() request: AuthenticatedRequest) {
    return this.authService.me(request.user.id);
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  logout(@Req() request: AuthenticatedRequest, @Body() body: unknown) {
    const result = logoutSchema.safeParse(body ?? {});

    if (!result.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: result.error.issues,
      });
    }

    return this.authService.logout(
      {
        jti: request.user.jti,
        exp: request.user.exp,
        userId: request.user.id,
      },
      result.data.refreshToken,
    );
  }

  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(@Body() body: unknown) {
    const result = forgotPasswordSchema.safeParse(body);

    if (!result.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: result.error.issues,
      });
    }

    return this.authService.forgotPassword(result.data.email);
  }

  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(@Body() body: unknown) {
    const result = resetPasswordSchema.safeParse(body);

    if (!result.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: result.error.issues,
      });
    }

    return this.authService.resetPassword(
      result.data.token,
      result.data.newPassword,
    );
  }
}
