/* eslint-disable @next/next/no-img-element */
import { Article } from '@/types';

export default function ArticleCard({ article }: { article: Article }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded bg-white shadow">
      {article.image && (
        <div className="h-48 overflow-hidden">
          <img
            src={
              article.image ??
              'https://placehold.co/600x400/EEE/31343C?font=raleway&text=News'
            }
            alt={article.title}
            className="h-full w-full object-cover"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                'https://placehold.co/600x400/EEE/31343C?font=raleway&text=News';
            }}
          />
        </div>
      )}

      <div className="flex flex-grow flex-col p-4">
        <div className="mb-2 flex items-center text-sm text-gray-600">
          <span className="mr-2 font-medium">{article.source.name}</span>
          <span className="mx-1">•</span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>

        <h3 className="mb-2 line-clamp-2 text-lg font-bold">{article.title}</h3>

        {article.description && (
          <p className="mb-4 line-clamp-3 text-gray-700">
            {article.description}
          </p>
        )}

        <span className="text-sm font-medium text-gray-600">
          {article.author}
        </span>

        <div className="mt-auto pt-4">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:text-blue-800"
          >
            Read full article →
          </a>
        </div>
      </div>
    </div>
  );
}
