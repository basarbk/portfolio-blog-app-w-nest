import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { GenericResponse } from '../shared';
import { UserService } from './user.service';
import { CreateUser } from './dto/create-user.dto';
import { UpdateUser } from './dto/update-user.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../auth/auth.guard';
import { UserDTO } from './dto/user-dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async createUser(@Body() body: CreateUser): Promise<GenericResponse> {
    await this.userService.createUser(body);
    return new GenericResponse('Please check your email');
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async handleUpdate(
    @Body() body: UpdateUser,
    @CurrentUser() user: User,
    @Param('id') id: string,
  ): Promise<GenericResponse> {
    if (user.id !== +id) throw new ForbiddenException('Unauthorized');
    await this.userService.updateUser(user.id, body);
    return new GenericResponse('User is updated');
  }

  @Get(':handle')
  async getUser(@Param('handle') handle: string): Promise<UserDTO> {
    return this.userService.getUser(handle);
  }
}
