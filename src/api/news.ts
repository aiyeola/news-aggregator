import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

export const useGetIp = () =>
  useQuery({
    queryKey: ['get_ip'],
    queryFn: ({ signal }) =>
      axios
        .get('/api/get-ip', { signal })
        .then((res) => res.data)
        .catch((error) => {
          throw error.response.data;
        }),
  });
