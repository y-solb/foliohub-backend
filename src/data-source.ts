import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'db',
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: true,
  logging: true,
  // entities: [
  //   process.env.NODE_ENV === 'development' ? 'src/entities/**/*.ts' : 'src/entities/**/*.ts',
  // ],
  entities: ['dist/entities/**/*.js'],
  subscribers: [],
  migrations: [],
});
