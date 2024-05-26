import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

@Controller('users')
export class UserController {
  @Post()
  @HttpCode(HttpStatus.OK)
  createUser() {
    return 'Success';
  }
}
