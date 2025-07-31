import { useQuery } from '@tanstack/react-query';
import api from '@/shared/services/apiService';
import { Category } from '../../../modules/appointments/types/category.interface';
import { Service } from '@/shared/types/service.interface';

export const categoriesAndServicesQueryKey = 'categories-services';
export const categoryByIdQueryKey: (id: number | null) => [string, number] = (id: number | null) => ['category', id || 0];
interface Result {
  categories: Category[];
  services: Service[];
}

export function useCategoriesAndServices(enabled: boolean, showSpecialCategories = true) {
  return useQuery<Result>({
    queryKey: [categoriesAndServicesQueryKey],
    queryFn: async () => {
      const [categoriesRes, servicesRes] = await Promise.all([
        api.get<Category[]>('/category/list-all'),
        api.get<Service[]>('/service/list-all')
      ]);
      
      const categoriesData = [...categoriesRes.data];
      
      if (showSpecialCategories) {
        const allCategories = { id: 0, name: 'Todas' };
        const selectedCategories = { id: -1, name: 'Selecionados' };
        categoriesData.push(allCategories, selectedCategories);
      }

      return {
        categories: categoriesData,
        services: servicesRes.data,
      };
    },
    enabled,
  });
}

export function useCategoryById(id: number | null) {
  return useQuery<Category>({
    queryKey: categoryByIdQueryKey(id || 0),
    enabled: !!id,
    queryFn: async () => {
      const response = await api.get(`/category/${id}`);
      return response.data;
    },
  });
}
