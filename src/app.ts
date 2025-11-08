import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes/index.routes';
import { sessionMiddleware } from './middlewares/session.middleware';
import { notFoundHandler, errorHandler } from './middlewares/error.middleware';
import { env } from './config/env';

const app = express();

app.set('trust proxy', env.NODE_ENV === 'production');

app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(sessionMiddleware);

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };


