import { useQuery } from '@tanstack/react-query';
import api from '@/shared/services/apiService';
import { Category } from '../../../modules/appointments/types/category.interface';
import { Service } from '@/shared/types/service.interface';

export const categoriesAndServicesQueryKey = 'categories-services';
export const categoryByIdQueryKey: (id: number | null) => [string, number] = (id: number | null) => ['category', id || 0];
export const serviceByIdQueryKey: (id: number | null) => [string, number] = (id: number | null) => ['service', id || 0];

interface Result {
  categories: Category[];
  services: Service[];
}

export function useCategoriesAndServices(enabled: boolean, showAllCategories = true, showSelectedCategory = false) {
  return useQuery<Result>({
    queryKey: [categoriesAndServicesQueryKey],
    queryFn: async () => {
      const [categoriesRes, servicesRes] = await Promise.all([
        api.get<Category[]>('/category'),
        api.get<Service[]>('/services')
      ]);
      
      const categoriesData = [];

      if (showAllCategories) {
        const allCategories = { id: 0, name: 'Todas' };
        categoriesData.push(allCategories);
      }

      if (showSelectedCategory) {
        const selectedCategories = { id: -1, name: 'Selecionados' };
        categoriesData.push(selectedCategories);
      }

      categoriesData.push(...categoriesRes.data);

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
    queryKey: categoryByIdQueryKey(id),
    enabled: !!id,
    queryFn: async () => {
      const response = await api.get(`/category/${id}`);
      return response.data;
    },
  });
}

export function useServiceById(id: number | null) {
  return useQuery<Service>({
    queryKey: serviceByIdQueryKey(id),
    enabled: !!id,
    queryFn: async () => {
      const response = await api.get(`/services/${id}`);
      return response.data;
    },
  });
}
