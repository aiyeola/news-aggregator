export interface Source {
  id: string | null;
  name: string;
  type: 'NewsAPI' | 'Guardian' | 'NYT';
}

export interface Article {
  id: string;
  title: string;
  description: string | null;
  url: string;
  image: string | null;
  publishedAt: string;
  source: Source;
  author: string | null;
}

export interface ArticleResponse {
  articles: Article[];
}

// NewsAPI interfaces
export interface NewsApiArticle {
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

export interface NewsApiResponse {
  articles: NewsApiArticle[];
  status: string;
  totalResults: number;
}

// Guardian interfaces
export interface GuardianField {
  headline?: string;
  trailText?: string;
  body?: string;
  thumbnail?: string;
  publication?: string;
  lastModified?: string;
  byline?: string;
}

export interface GuardianArticle {
  id: string;
  webTitle: string;
  webUrl: string;
  webPublicationDate: string;
  fields?: GuardianField;
}

export interface GuardianResponse {
  response: {
    results: GuardianArticle[];
  };
}

// NYT interfaces
export interface NYTHeadline {
  main: string;
}

export interface NYTByline {
  original: string | null;
}

export interface NYTMultimedia {
  url: string;
}

export interface NYTArticle {
  _id: string;
  headline: NYTHeadline;
  abstract: string | null;
  lead_paragraph: string | null;
  web_url: string;
  multimedia: NYTMultimedia[];
  pub_date: string;
  byline?: NYTByline;
}

export interface NYTResponse {
  response: {
    docs: NYTArticle[];
  };
}

export interface UserPreference {
  preferredSources: string[];
  preferredCategory: string;
}

export interface Filters {
  query: string;
  category: string;
  sources: string[];
  fromDate: string;
  toDate: string;
  page: number;
}
