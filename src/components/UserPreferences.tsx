import { useState } from 'react';

export default function UserPreferences({ preferences, onPreferencesChange }) {
  const [isOpen, setIsOpen] = useState(false);

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

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    let updatedCategories = [...preferences.preferredCategories];

    if (checked) {
      updatedCategories.push(value);
    } else {
      updatedCategories = updatedCategories.filter((cat) => cat !== value);
    }

    onPreferencesChange({ preferredCategories: updatedCategories });
  };

  const handleSourceChange = (e) => {
    const { value, checked } = e.target;
    let updatedSources = [...preferences.preferredSources];

    if (checked) {
      updatedSources.push(value);
    } else {
      updatedSources = updatedSources.filter((source) => source !== value);
    }

    onPreferencesChange({ preferredSources: updatedSources });
  };

  const togglePreferences = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-6 rounded bg-white p-4 shadow">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Preferences</h2>
        <button
          onClick={togglePreferences}
          className="text-blue-600 hover:text-blue-800"
        >
          {isOpen ? 'Hide' : 'Edit'}
        </button>
      </div>

      {isOpen ? (
        <div>
          <div className="mb-4">
            <h3 className="mb-2 font-medium">Preferred Sources</h3>
            {sources.map((source) => (
              <div key={source.id} className="mb-1 flex items-center">
                <input
                  type="checkbox"
                  id={`pref-source-${source.id}`}
                  value={source.id}
                  checked={preferences.preferredSources.includes(source.id)}
                  onChange={handleSourceChange}
                  className="mr-2"
                />
                <label htmlFor={`pref-source-${source.id}`}>
                  {source.name}
                </label>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <h3 className="mb-2 font-medium">Preferred Categories</h3>
            {categories.map((category) => (
              <div key={category} className="mb-1 flex items-center">
                <input
                  type="checkbox"
                  id={`pref-category-${category}`}
                  value={category}
                  checked={preferences.preferredCategories.includes(category)}
                  onChange={handleCategoryChange}
                  className="mr-2"
                />
                <label
                  htmlFor={`pref-category-${category}`}
                  className="capitalize"
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          {preferences.preferredSources.length === 0 &&
          preferences.preferredCategories.length === 0 ? (
            <p className="text-gray-500">
              No preferences set yet. Click Edit to customize your news feed.
            </p>
          ) : (
            <div>
              {preferences.preferredSources.length > 0 && (
                <div className="mb-2">
                  <p className="font-medium">Sources:</p>
                  <p>
                    {preferences.preferredSources
                      .map((id) => sources.find((s) => s.id === id)?.name)
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </div>
              )}

              {preferences.preferredCategories.length > 0 && (
                <div>
                  <p className="font-medium">Categories:</p>
                  <p>
                    {preferences.preferredCategories
                      .map((cat) => cat.charAt(0).toUpperCase() + cat.slice(1))
                      .join(', ')}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
