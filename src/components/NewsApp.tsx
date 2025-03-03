import { useState, useEffect, useMemo } from 'react';
import ArticleList from '@/components/ArticleList';
import NewsFilters from '@/components/NewsFilters';
import UserPreferences from '@/components/UserPreferences';
import { UserPreference, Filters } from '@/types';
import { useGetNews } from '@/api/news';

export default function NewsApp() {
  const [error, setError] = useState<null | string>(null);
  const [filters, setFilters] = useState<Filters>({
    query: '',
    category: '',
    sources: [],
    fromDate: '',
    toDate: '',
    page: 1,
  });

  const [userPrefs, setUserPrefs] = useState<UserPreference>({
    preferredSources: [],
    preferredCategory: '',
  });

  const { data, isLoading, isError } = useGetNews(filters);

  const articles = useMemo(() => {
    if (data) {
      return data?.articles;
    }

    return [];
  }, [data]);

  useEffect(() => {
    if (isError) {
      setError('Failed to fetch articles. Please try again later.');
    }
  }, [isError]);

  useEffect(() => {
    const savedPrefs = localStorage.getItem('newsPreferences');
    if (savedPrefs) {
      setUserPrefs(JSON.parse(savedPrefs));

      setFilters((prev) => ({
        ...prev,
        sources: JSON.parse(savedPrefs).preferredSources,
        category: JSON.parse(savedPrefs).preferredCategory,
      }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('newsPreferences', JSON.stringify(userPrefs));
  }, [userPrefs]);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const handlePreferencesChange = (newPrefs: UserPreference) => {
    setUserPrefs({ ...userPrefs, ...newPrefs });

    if (newPrefs.preferredSources) {
      setFilters((prev) => ({
        ...prev,
        sources: newPrefs.preferredSources,
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        category: newPrefs.preferredCategory,
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

        <div className="md:h-[85dvh] md:overflow-y-scroll lg:col-span-3">
          {error && (
            <div className="mb-4 border-l-4 border-red-500 bg-red-100 p-4 text-red-700">
              {error}
            </div>
          )}

          <ArticleList
            articles={articles}
            loading={isLoading}
            onLoadMore={loadMore}
          />
        </div>
      </div>
    </div>
  );
}
