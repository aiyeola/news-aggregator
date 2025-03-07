/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { Filters } from '@/types';
import { categories, sources, filterState } from '@/constants';

export default function NewsFilters({
  filters,
  onFilterChange,
}: {
  filters: Filters;
  onFilterChange: (value: Filters) => void;
}) {
  const [value, setValue] = useState('');

  const debounceValue = useDebounce(value);

  useEffect(() => {
    onFilterChange({
      ...filters,
      query: debounceValue,
    });
  }, [debounceValue]);

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    onFilterChange({
      ...filters,
      [name]: value,
    });
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    let updatedSources = [...filters.sources];

    if (checked) {
      updatedSources.push(value);
    } else {
      updatedSources = updatedSources.filter((source) => source !== value);
    }

    onFilterChange({
      ...filters,
      sources: updatedSources,
    });
  };

  const handleClearFilters = () => {
    onFilterChange(filterState);
    setValue('');
  };

  return (
    <div className="mb-6 rounded bg-white p-4 shadow">
      <h2 className="mb-4 text-xl font-semibold">Search & Filter</h2>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium">Keyword Search</label>
        <input
          type="text"
          name="query"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
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

      {/* <DatePickerWithRange /> */}
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
        className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        onClick={handleClearFilters}
      >
        Clear Filters
      </button>
    </div>
  );
}
