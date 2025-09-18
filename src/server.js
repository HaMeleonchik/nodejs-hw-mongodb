import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routers/contacts.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const app = express();

app.use(
  pino({
    transport: {
      target: 'pino-pretty',
    },
  }),
);

app.use(cors());

app.use(express.json());

app.use('/contacts', contactsRouter);

app.use(notFoundHandler);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

export async function setupServer() {
  try {
    await initMongoConnection();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    console.log('Mongo connection successfully established!');
  } catch {
    console.error('Not found');
  }
}
