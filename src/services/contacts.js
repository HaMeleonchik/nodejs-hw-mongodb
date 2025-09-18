import { Contacts } from '../db/models/contactsSchema.js';

export const getContact = () => {
  return Contacts.find();
};

export const getContactById = (contactId) => {
  return Contacts.findById(contactId);
};

export const createContact = (payload) => {
  return Contacts.create(payload);
};

export const deleteContact = (contactId) => {
  return Contacts.findByIdAndDelete(contactId);
};

export const updateContact = (contactId, payload) => {
  return Contacts.findByIdAndUpdate(contactId, payload, { new: true });
};
