import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app:express.Application = express();

app.use(express.json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('hello world');
});

const port:number = 4000;

app.listen(port, () => {
  console.log(`running on ${port}`);
});
