import express from 'express';

import { Contacts } from '../db/models/contactsSchema.js';

const contactsRouter = express.Router();

contactsRouter.get('/', async (req, res) => {
  const contacts = await Contacts.find();
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
});

contactsRouter.get('/:contactId', async (req, res) => {
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
    data: contact,
  });
});

export default contactsRouter;
