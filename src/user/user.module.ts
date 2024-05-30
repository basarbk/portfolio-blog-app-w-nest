import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  forwardRef,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { EmailModule } from '../email/email.module';
import { UniqueEmail } from './validator/unique-email.validator';
import { AuthUserMiddleware } from '../auth/auth-user.middleware';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [UserService, UniqueEmail],
  controllers: [UserController],
  imports: [
    TypeOrmModule.forFeature([User]),
    EmailModule,
    forwardRef(() => AuthModule),
  ],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthUserMiddleware)
      .forRoutes({ path: 'users/*', method: RequestMethod.PUT });
  }
}
