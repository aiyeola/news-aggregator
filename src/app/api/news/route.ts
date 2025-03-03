import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import {
  Article,
  ArticleResponse,
  NewsApiResponse,
  GuardianResponse,
  NYTResponse,
} from '@/types';

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const GUARDIAN_API_KEY = process.env.GUARDIAN_API_KEY;
const NEW_YORK_TIMES_API_KEY = process.env.NEW_YORK_TIMES_API_KEY;

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

    const articles: Article[] = [];

    responses.forEach((response) => {
      if (response.status === 'fulfilled' && response.value.articles) {
        articles.push(...response.value.articles);
      }
    });

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
