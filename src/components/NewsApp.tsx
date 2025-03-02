import { useState, useEffect } from 'react';
import ArticleList from './ArticleList';
import NewsFilters from './NewsFilters';
import UserPreferences from './UserPreferences';
import axios from 'axios';

export default function NewsApp() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [filters, setFilters] = useState({
    query: '',
    category: '',
    sources: [],
    fromDate: '',
    toDate: '',
    page: 1,
  });

  const [userPrefs, setUserPrefs] = useState({
    preferredSources: [],
    preferredCategories: [],
  });

  useEffect(() => {
    const savedPrefs = localStorage.getItem('newsPreferences');
    if (savedPrefs) {
      setUserPrefs(JSON.parse(savedPrefs));

      setFilters((prev) => ({
        ...prev,
        sources: JSON.parse(savedPrefs).preferredSources,
      }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('newsPreferences', JSON.stringify(userPrefs));
  }, [userPrefs]);

  useEffect(() => {
    fetchArticles();
  }, [filters]);

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('/api/news', { params: filters });
      setArticles(response.data.articles);
    } catch (err) {
      setError('Failed to fetch articles. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const handlePreferencesChange = (newPrefs) => {
    setUserPrefs({ ...userPrefs, ...newPrefs });

    if (newPrefs.preferredSources) {
      setFilters((prev) => ({
        ...prev,
        sources: newPrefs.preferredSources,
      }));
    }
  };

  const loadMore = () => {
    setFilters((prev) => ({
      ...prev,
      page: prev.page + 1,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">News Aggregator</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <UserPreferences
            preferences={userPrefs}
            onPreferencesChange={handlePreferencesChange}
          />

          <NewsFilters filters={filters} onFilterChange={handleFilterChange} />
        </div>

        <div className="lg:col-span-3">
          {error && (
            <div className="mb-4 border-l-4 border-red-500 bg-red-100 p-4 text-red-700">
              {error}
            </div>
          )}

          <ArticleList
            articles={articles}
            loading={loading}
            onLoadMore={loadMore}
          />
        </div>
      </div>
    </div>
  );
}
