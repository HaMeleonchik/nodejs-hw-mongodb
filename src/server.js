import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initMongoConnection } from './db/initMongoConnection.js';
import pino from 'pino-http';
import { Contacts } from './db/models/contacts.js';
const app = express();

app.use(
  pino({
    transport: {
      target: 'pino-pretty',
    },
  }),
);

app.use(cors());

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

app.get('/contacts', async (req, res) => {
  const contacts = await Contacts.find();
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
});

app.get('/contacts/:contactId', async (req, res) => {
  const { contactId } = req.params;

  const contact = await Contacts.findById(contactId);
  if (contact === null) {
    res.json({
      status: 404,
      message: 'Contact not found',
    });
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: {
      contact,
    },
  });
});
