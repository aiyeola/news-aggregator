import { useState } from 'react';
import { UserPreference } from '@/types';
import { categories, sources } from '@/constants';

export default function UserPreferences({
  preferences,
  onPreferencesChange,
}: {
  preferences: UserPreference;
  onPreferencesChange: (value: UserPreference) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (preferences.preferredCategory === value) {
      onPreferencesChange({
        ...preferences,
        preferredCategory: '',
      });
    } else {
      onPreferencesChange({
        ...preferences,
        preferredCategory: value,
      });
    }
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    let updatedSources = [...preferences.preferredSources];

    if (checked) {
      updatedSources.push(value);
    } else {
      updatedSources = updatedSources.filter((source) => source !== value);
    }

    onPreferencesChange({
      ...preferences,
      preferredSources: updatedSources,
    });
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
            <h3 className="mb-2 font-medium">Preferred Category</h3>
            {categories.map((category) => (
              <div key={category} className="mb-1 flex items-center">
                <input
                  type="checkbox"
                  id={`pref-category-${category}`}
                  value={category}
                  checked={preferences.preferredCategory === category}
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
          preferences.preferredCategory.length === 0 ? (
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
                      .map(
                        (id: string) => sources.find((s) => s.id === id)?.name,
                      )
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </div>
              )}

              {preferences.preferredCategory.length > 0 && (
                <div>
                  <p className="font-medium">Category:</p>
                  <p className="capitalize">{preferences.preferredCategory}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
