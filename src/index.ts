import express, { Express } from 'express';
import dotenv from 'dotenv';
import routes from './routes';
import cors from 'cors';
import { AppDataSource } from './data-source';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import errorHandler from './middlewares/errorHandler';

dotenv.config();

const app: Express = express();
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/', routes);
app.use(errorHandler);

const port = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(async () => {
    app.listen(port, () => {
      console.log(`[server]: Server is running at ${process.env.APP_URL}`);
    });
    console.log('Data Source has been initialized!');
  })
  .catch((error) => console.log(error));
