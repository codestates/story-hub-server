import express, { Application, urlencoded, Request, Response } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config();
export default class App {
  app: Application;

  constructor(private port: number | string) {
    this.port = port;
    this.app = express();
    this.settings();
    this.middlewares();
    this.routes();
    this.app.get('/', (req: Request, res: Response) => {
      res.send('Story-hub Server Start');
    });
  }

  settings() {
    this.app.set('port', this.port || 4000);
  }

  middlewares() {
    this.app.use(morgan('dev'));
    this.app.use(express.json());
    this.app.use(urlencoded({ extended: false }));
    this.app.use(cookieParser());
    this.app.use(
      cors({
        origin: [
          'https://shapeofvoice.click',
          'https://www.shapeofvoice.click',
          'http://localhost:3000',
        ],
        methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
        credentials: true,
      })
    );
  }

  routes() {
    this.app.use(routes);
  }

  async listen() {
    await this.app.listen(this.app.get('port'));
    console.log('server on port', this.app.get('port'));
  }
}
