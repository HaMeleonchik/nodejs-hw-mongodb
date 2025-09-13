import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

const bookStrap = async () => {
  await initMongoConnection();
  setupServer();
};

bookStrap();
