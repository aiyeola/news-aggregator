import ArticleCard from './ArticleCard';

export default function ArticleList({ articles, loading, onLoadMore }) {
  if (loading && articles.length === 0) {
    return (
      <div className="flex justify-center p-12">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!loading && articles.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-xl text-gray-600">
          No articles found. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {loading && (
        <div className="flex justify-center p-6">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
        </div>
      )}

      <div className="mt-8 text-center">
        <button
          onClick={onLoadMore}
          className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          Load More
        </button>
      </div>
    </div>
  );
}
