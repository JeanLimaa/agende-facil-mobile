import { useQuery } from '@tanstack/react-query';
import api from '@/shared/services/apiService';
import { Employee } from '../../../modules/appointments/types/employee.interface';

export function useEmployees() {
  return useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data } = await api.get('/employee/list/all');
      return data;
    },
  });
}
