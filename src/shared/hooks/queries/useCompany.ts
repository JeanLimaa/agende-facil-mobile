import { useQuery } from '@tanstack/react-query';
import api from '@/shared/services/apiService';
import { CompanyInfo } from '@/shared/types/company.types';

export const companyInfoQueryKey = 'companyInfo';

export function useCompany() {
  return useQuery<CompanyInfo>({
    queryKey: [companyInfoQueryKey],
    queryFn: async () => {
      const { data } = await api.get('/company/info');
      return data;
    },
  });
}
