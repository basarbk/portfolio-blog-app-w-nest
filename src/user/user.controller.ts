import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GenericResponse } from '../shared';

@Controller('users')
export class UserController {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async createUser(@Body() body: any): Promise<GenericResponse> {
    const user = {
      name: body.email.split('@')[0],
      handle: body.email.split('@')[0],
      email: body.email,
    };
    await this.userRepository.save(user);
    return new GenericResponse('Please check your email');
  }
}
