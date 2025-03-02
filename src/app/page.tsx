'use client';

// import { Button } from '@/components/ui/button';
import { useGetNews } from '@/api/news';
import NewsApp from '@/components/NewsApp';

export default function Home() {
  const { data } = useGetNews();
  console.log('data: ', data);
  return <NewsApp />;
}
