import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './app-db.sqlite',
      synchronize: true,
      entities: [User],
    }),
    UserModule,
    EmailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
