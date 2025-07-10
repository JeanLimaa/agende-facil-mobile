import { useQuery } from '@tanstack/react-query';
import api from '@/shared/services/apiService';
import { Employee } from '@/shared/types/employee.interface';

export function useEmployees() {
  return useQuery<Employee[]>({
    queryKey: ['employee'],
    queryFn: async () => {
      const { data } = await api.get('/employee');
      return data;
    },
  });
}

export function useEmployee(employeeId: number | null) {
  return useQuery<Employee>({
    queryKey: ['employee', employeeId],
    enabled: !!employeeId,
    queryFn: async () => {
      const { data } = await api.get(`/employee/${employeeId}`);
      return data;
    },
  });
}
