import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './token.entity';
import { AuthUserMiddleware } from './auth-user.middleware';

@Module({
  imports: [forwardRef(() => UserModule), TypeOrmModule.forFeature([Token])],
  controllers: [AuthController],
  providers: [AuthService, AuthUserMiddleware],
  exports: [AuthService],
})
export class AuthModule {}
