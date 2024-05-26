import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './app-db.sqlite',
      synchronize: true,
      entities: [User],
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
