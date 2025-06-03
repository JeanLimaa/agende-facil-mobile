import { useQuery } from '@tanstack/react-query';
import api from '@/shared/services/apiService';
import { Category } from '../types/category.interface';
import { Service } from '@/shared/types/service.interface';

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
      const selectedCategories = { id: -1, name: 'Selecionados' };
      return {
        categories: [allCategories, selectedCategories, ...categoriesRes.data],
        services: servicesRes.data,
      };
    },
    enabled,
  });
}
