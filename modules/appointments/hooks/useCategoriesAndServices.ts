import { useQuery } from '@tanstack/react-query';
import api from '@/services/apiService';
import { Category } from '../types/category.interface';
import { Service } from '../types/service.interface';

interface Result {
  categories: Category[];
  services: Service[];
}

export function useCategoriesAndServices(enabled: boolean) {
  return useQuery<Result>({
    queryKey: ['categories-services'],
    queryFn: async () => {
      const [categoriesRes, servicesRes] = await Promise.all([
        api.get<Category[]>('/category/list-all'),
        api.get<Service[]>('/service/list-all')
      ]);

      const allCategories = { id: 0, name: 'Todas' };
      return {
        categories: [allCategories, ...categoriesRes.data],
        services: servicesRes.data,
      };
    },
    enabled,
  });
}
