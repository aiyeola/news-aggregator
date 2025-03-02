import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const GUARDIAN_API_KEY = process.env.GUARDIAN_API_KEY;
const NEW_YORK_TIMES_API_KEY = process.env.NEW_YORK_TIMES_API_KEY;

interface Source {
  id: string | null;
  name: string;
  type: 'NewsAPI' | 'Guardian' | 'NYT';
}

interface Article {
  id: string;
  title: string;
  description: string | null;
  url: string;
  image: string | null;
  publishedAt: string;
  source: Source;
  author: string | null;
}

interface ArticleResponse {
  articles: Article[];
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get('query');
  const category = searchParams.get('category');
  const sources = searchParams.get('sources')?.split(',');
  const fromDate = searchParams.get('fromDate');
  const toDate = searchParams.get('toDate');
  const page = parseInt(searchParams.get('page') || '1', 10);

  try {
    // Fetch from multiple sources in parallel
    const responses = await Promise.allSettled([
      // NewsAPI
      sources?.includes('newsapi') || !sources
        ? fetchFromNewsAPI(query, category, fromDate, toDate, page)
        : { articles: [] },

      // The Guardian
      sources?.includes('guardian') || !sources
        ? fetchFromGuardian(query, category, fromDate, toDate, page)
        : { articles: [] },

      // New York Times
      sources?.includes('nyt') || !sources
        ? fetchFromNYT(query, category, fromDate, toDate, page)
        : { articles: [] },
    ]);

    // Combine and format results
    const articles: Article[] = [];

    responses.forEach((response) => {
      if (response.status === 'fulfilled' && response.value.articles) {
        articles.push(...response.value.articles);
      }
    });

    // Sort by date (newest first)
    articles.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 },
    );
  }
}

// NewsAPI interfaces
interface NewsApiArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
}

interface NewsApiResponse {
  articles: NewsApiArticle[];
  status: string;
  totalResults: number;
}

async function fetchFromNewsAPI(
  query: string | null,
  category: string | null,
  fromDate: string | null,
  toDate: string | null,
  page: number,
): Promise<ArticleResponse> {
  try {
    const params: Record<string, string | number> = {
      apiKey: NEWS_API_KEY as string,
      page,
      pageSize: 20,
      country: 'us',
    };

    if (query) params.q = query;
    if (category) params.category = category;
    if (fromDate) params.from = fromDate;
    if (toDate) params.to = toDate;

    const response = await axios.get<NewsApiResponse>(
      'https://newsapi.org/v2/top-headlines',
      {
        params,
      },
    );

    return {
      articles: response.data.articles.map((article) => ({
        id: article.url,
        title: article.title,
        description: article.description,
        // content: article.content,
        url: article.url,
        image: article.urlToImage,
        publishedAt: article.publishedAt,
        source: {
          id: article.source.id,
          name: article.source.name,
          type: 'NewsAPI',
        },
        author: article.author,
      })),
    };
  } catch (error) {
    console.error('NewsAPI error:', error);
    return { articles: [] };
  }
}

// Guardian interfaces
interface GuardianField {
  headline?: string;
  trailText?: string;
  body?: string;
  thumbnail?: string;
  publication?: string;
  lastModified?: string;
  byline?: string;
}

interface GuardianArticle {
  id: string;
  webTitle: string;
  webUrl: string;
  webPublicationDate: string;
  fields?: GuardianField;
}

interface GuardianResponse {
  response: {
    results: GuardianArticle[];
  };
}

async function fetchFromGuardian(
  query: string | null,
  category: string | null,
  fromDate: string | null,
  toDate: string | null,
  page: number,
): Promise<ArticleResponse> {
  try {
    const params: Record<string, string | number> = {
      'api-key': GUARDIAN_API_KEY as string,
      page: page,
      'page-size': 20,
      'show-fields':
        'headline,trailText,thumbnail,publication,lastModified,byline',
    };

    if (query) params.q = query;
    if (category) params.section = category;
    if (fromDate) params['from-date'] = fromDate;
    if (toDate) params['to-date'] = toDate;

    const response = await axios.get<GuardianResponse>(
      'https://content.guardianapis.com/search',
      { params },
    );

    return {
      articles: response.data.response.results.map((article) => ({
        id: article.id,
        title: article.webTitle,
        description: article.fields?.trailText || null,
        // content: article.fields?.body || null,
        url: article.webUrl,
        image: article.fields?.thumbnail || null,
        publishedAt: article.webPublicationDate,
        source: {
          id: 'the-guardian',
          name: 'The Guardian',
          type: 'Guardian',
        },
        author: article.fields?.byline || null,
      })),
    };
  } catch (error) {
    console.error('Guardian API error:', error);
    return { articles: [] };
  }
}

// NYT interfaces
interface NYTHeadline {
  main: string;
}

interface NYTByline {
  original: string | null;
}

interface NYTMultimedia {
  url: string;
}

interface NYTArticle {
  _id: string;
  headline: NYTHeadline;
  abstract: string | null;
  lead_paragraph: string | null;
  web_url: string;
  multimedia: NYTMultimedia[];
  pub_date: string;
  byline?: NYTByline;
}

interface NYTResponse {
  response: {
    docs: NYTArticle[];
  };
}

async function fetchFromNYT(
  query: string | null,
  category: string | null,
  fromDate: string | null,
  toDate: string | null,
  page: number,
): Promise<ArticleResponse> {
  try {
    const params: Record<string, string | number> = {
      'api-key': NEW_YORK_TIMES_API_KEY as string,
      page: page,
    };

    if (query) params.q = query;
    if (category) params.fq = `news_desk:(${category})`;
    if (fromDate) params.begin_date = fromDate.replace(/-/g, '');
    if (toDate) params.end_date = toDate.replace(/-/g, '');

    const response = await axios.get<NYTResponse>(
      'https://api.nytimes.com/svc/search/v2/articlesearch.json',
      { params },
    );

    return {
      articles: response.data.response.docs.map((article) => ({
        id: article._id,
        title: article.headline.main,
        description: article.abstract,
        url: article.web_url,
        image:
          article.multimedia.length > 0
            ? `https://www.nytimes.com/${article.multimedia[0].url}`
            : null,
        publishedAt: article.pub_date,
        source: {
          id: 'new-york-times',
          name: 'The New York Times',
          type: 'NYT',
        },
        author: article.byline?.original || null,
      })),
    };
  } catch (error) {
    console.error('NYT API error:', error);
    return { articles: [] };
  }
}
