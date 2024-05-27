import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { EmailModule } from '../email/email.module';
import { UniqueEmail } from './validator/unique-email.validator';

@Module({
  providers: [UserService, UniqueEmail],
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([User]), EmailModule],
})
export class UserModule {}
