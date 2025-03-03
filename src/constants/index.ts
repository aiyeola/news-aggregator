export const categories = [
  'business',
  'entertainment',
  'general',
  'health',
  'science',
  'sports',
  'technology',
];

export const sources = [
  { id: 'newsapi', name: 'NewsAPI' },
  { id: 'guardian', name: 'The Guardian' },
  { id: 'nyt', name: 'New York Times' },
];

export const filterState = {
  query: '',
  category: '',
  sources: [],
  fromDate: '',
  toDate: '',
  page: 1,
};

export const newsPreferences = 'newsPreferences';
