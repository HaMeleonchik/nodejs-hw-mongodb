function parseSortBy(value) {
  if (typeof value === 'undefined') {
    return '_id';
  }

  const keys = ['_id', 'name', 'createdAt'];

  if (keys.includes(value) !== true) {
    return '_id';
  }

  return value;
}

function parseSortOrder(value) {
  if (typeof value === 'undefined') {
    return 'asc';
  }
  if (value !== 'asc' && value !== 'desc') {
    return 'asc';
  }
  return value;
}
export function parseSortParams(query) {
  const { SortBy, SortOrder } = query;

  const parsedSortBy = parseSortBy(SortBy);
  const parsedSortOrder = parseSortOrder(SortOrder);

  return {
    SortBy: parsedSortBy,
    SortOrder: parsedSortOrder,
  };
}
