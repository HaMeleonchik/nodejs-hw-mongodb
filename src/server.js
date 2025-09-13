import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './services/contacts.js';
import { initMongoConnection } from './db/initMongoConnection.js';

const app = express();

app.use(
  pino({
    transport: {
      target: 'pino-pretty',
    },
  }),
);

app.use(cors());

app.use('/contacts', contactsRouter);

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
