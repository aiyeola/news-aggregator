import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Filters } from '@/types';

export const useGetNews = ({
  query,
  category,
  sources,
  fromDate,
  toDate,
  page,
}: Omit<Filters, 'sources'> & {
  sources: string;
}) =>
  useQuery({
    queryKey: ['get_news', query, category, sources, fromDate, toDate, page],
    queryFn: ({ signal }) =>
      axios
        .get('/api/news', {
          signal,
          params: {
            query,
            category,
            sources,
            fromDate,
            toDate,
            page,
          },
        })
        .then((res) => res.data)
        .catch((error) => {
          throw error.response.data;
        }),
  });
