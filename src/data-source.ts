import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'api.foliohub.me',
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: true,
  logging: true,
  entities: [
    process.env.NODE_ENV === 'development' ? 'src/entities/**/*.ts' : 'dist/entities/**/*.ts',
  ],
  subscribers: [],
  migrations: [],
});
