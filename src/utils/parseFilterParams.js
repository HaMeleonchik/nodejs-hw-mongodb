function parseIsFavourite(value) {
  if (typeof value === 'undefined') {
    return undefined;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }
  return undefined;
}

function parseContactType(type) {
  if (typeof type !== 'string') {
    return;
  }

  const allowedTypes = ['work', 'home', 'personal'];

  const normalizedType = type.toLowerCase();

  if (allowedTypes.includes(normalizedType)) {
    return normalizedType;
  }

  return undefined;
}

export function parseFilterParams(query) {
  const { isFavourite, contactType } = query;

  const parsedIsFavourite = parseIsFavourite(isFavourite);
  const parsedContactType = parseContactType(contactType);

  return {
    isFavourite: parsedIsFavourite,
    type: parsedContactType,
  };
}
