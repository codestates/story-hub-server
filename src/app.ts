import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

export default class App {
  private app: Application;

  constructor(private port?: number | string) {
    this.port = port;
    this.app = express();
    this.settings();
    this.middlewares();
  }

  settings() {
    this.app.set('port', this.port || 4000);
  }

  middlewares() {
    this.app.use(morgan('dev'));
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.json());
    this.app.use(
      cors({
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true,
      })
    );
    this.app.use(cookieParser());
  }

  async listen() {
    await this.app.listen(this.app.get('port'));
    console.log('server on port', this.app.get('port'));
  }
}
