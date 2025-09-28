import { Contacts } from '../db/models/contactsSchema.js';

export const getContact = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
}) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const contactsQuery = Contacts.find();

  if (typeof filter.isFavourite !== 'undefined') {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  if (filter.type) {
    contactsQuery.where('contactType').equals(filter.type);
  }

  const [totalItems, contacts] = await Promise.all([
    Contacts.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: totalPages > page,
  };
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
