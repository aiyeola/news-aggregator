import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

export const useGetNews = () =>
  useQuery({
    queryKey: ['get_news'],
    queryFn: ({ signal }) =>
      axios
        .get('/api/news', {
          signal,
          params: {},
        })
        .then((res) => res.data)
        .catch((error) => {
          throw error.response.data;
        }),
  });
