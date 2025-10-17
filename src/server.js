import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import router from './routers/index.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import swaggerUI from 'swagger-ui-express';
import fs from 'node:fs';

const SWAGGER_DOCUMENT = JSON.parse(
  fs.readFileSync(path.join('docs', 'swagger.json')),
);

const app = express();

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(SWAGGER_DOCUMENT));

app.use(
  pino({
    transport: {
      target: 'pino-pretty',
    },
  }),
);

app.use(cors());

app.use(express.json());

app.use(cookieParser());

app.use('/photo', express.static(path.resolve('src', 'uploads', 'photo')));

app.use(router);

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
