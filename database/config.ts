import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'sqlite',
  database: './app-db.sqlite',
  migrations: ['./database/migrations/*.ts'],
  logging: true,
});
