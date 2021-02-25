import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('hello world');
});

const port = 4000;

app.listen(port, () => {
  console.log(`running on ${port}`);
});
