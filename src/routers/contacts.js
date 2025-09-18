import { Router } from 'express';

import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContactController,
  updateContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(getContactController));

contactsRouter.get('/:contactId', ctrlWrapper(getContactByIdController));

contactsRouter.post('/', ctrlWrapper(createContactController));

contactsRouter.delete('/:contactId', ctrlWrapper(deleteContactController));

contactsRouter.patch('/:contactId', ctrlWrapper(updateContactController));

export default contactsRouter;
