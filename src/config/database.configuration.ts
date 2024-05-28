import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Token } from '../auth/token.entity';

export const DatabaseModuleOptions: TypeOrmModuleAsyncOptions = {
  useFactory: (configService: ConfigService) => {
    const dbHost = configService.get<string>('DB_HOST');
    return {
      type: 'sqlite',
      database: dbHost,
      synchronize: false,
      entities: [User, Token],
    };
  },
  inject: [ConfigService],
};
