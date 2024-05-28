import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRequest } from './dto/auth-request.dto';
import { AuthUser } from './dto/auth-user.dto';
import { Response } from 'express';

const ONE_YEAR_IN_MILLIS = 365 * 24 * 60 * 60 * 1000;

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async handleAuth(
    @Body() body: AuthRequest,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthUser> {
    const result = await this.authService.handleAuth(body);
    response.cookie('app-token', result.token, {
      expires: new Date(Date.now() + ONE_YEAR_IN_MILLIS),
      httpOnly: true,
    });
    return result.user;
  }
}
