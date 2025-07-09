import { useQuery } from '@tanstack/react-query';
import api from '@/shared/services/apiService';

export function useCompany() {
  return useQuery<CompanyInfo>({
    queryKey: ['company/info'],
    queryFn: async () => {
      const { data } = await api.get('/company/info');
      return data;
    },
  });
}
