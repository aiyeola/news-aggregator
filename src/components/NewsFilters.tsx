import { Input } from '@/components/ui/input';

export default function NewsFilters({ filters, onFilterChange }) {
  const categories = [
    'business',
    'entertainment',
    'general',
    'health',
    'science',
    'sports',
    'technology',
  ];

  const sources = [
    { id: 'newsapi', name: 'NewsAPI' },
    { id: 'guardian', name: 'The Guardian' },
    { id: 'nyt', name: 'New York Times' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  const handleSourceChange = (e) => {
    const { value, checked } = e.target;
    let updatedSources = [...filters.sources];

    if (checked) {
      updatedSources.push(value);
    } else {
      updatedSources = updatedSources.filter((source) => source !== value);
    }

    onFilterChange({ sources: updatedSources });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // The parent component already updates when filters change
  };

  return (
    <div className="mb-6 rounded bg-white p-4 shadow">
      <h2 className="mb-4 text-xl font-semibold">Search & Filter</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">
            Keyword Search
          </label>
          <Input
            type="text"
            name="query"
            value={filters.query}
            onChange={handleInputChange}
            className="w-full rounded border px-3 py-2"
            placeholder="Enter keywords..."
          />
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">Category</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleInputChange}
            className="w-full rounded border px-3 py-2"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">Sources</label>
          {sources.map((source) => (
            <div key={source.id} className="mb-1 flex items-center">
              <input
                type="checkbox"
                id={`source-${source.id}`}
                value={source.id}
                checked={filters.sources.includes(source.id)}
                onChange={handleSourceChange}
                className="mr-2"
              />
              <label htmlFor={`source-${source.id}`}>{source.name}</label>
            </div>
          ))}
        </div>

        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">From Date</label>
            <input
              type="date"
              name="fromDate"
              value={filters.fromDate}
              onChange={handleInputChange}
              className="w-full rounded border px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">To Date</label>
            <input
              type="date"
              name="toDate"
              value={filters.toDate}
              onChange={handleInputChange}
              className="w-full rounded border px-3 py-2"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </form>
    </div>
  );
}
