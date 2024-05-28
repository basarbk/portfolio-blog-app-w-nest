import { Injectable } from '@nestjs/common';
import { AuthRequest } from './dto/auth-request.dto';
import { UserService } from '../user/user.service';
import { AuthUser } from './dto/auth-user.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async handleAuth(
    request: AuthRequest,
  ): Promise<{ user: AuthUser; token: string }> {
    const { id, name, email, handle, image } =
      await this.userService.validateToken(request.operation, request.token);

    return {
      user: { id, name, email, handle, image },
      token: 'random-token-for-user-' + id,
    };
  }
}
