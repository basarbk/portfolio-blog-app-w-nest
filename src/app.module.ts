import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModuleOptions } from './config/database.configuration';
import { AuthModule } from './auth/auth.module';
import { ArticleModule } from './article/article.module';
import { PaginationMiddleware } from './shared/pagination/pagination.middleware';
import { FileModule } from './file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(DatabaseModuleOptions),
    UserModule,
    EmailModule,
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'development' ? '.dev.env' : '.env',
      isGlobal: true,
    }),
    AuthModule,
    ArticleModule,
    FileModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'upload'),
      serveRoot: '/api/assets',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PaginationMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.GET });
  }
}
