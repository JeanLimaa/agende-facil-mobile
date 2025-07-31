import { useQuery } from '@tanstack/react-query';
import api from '@/shared/services/apiService';
import { Employee } from '@/shared/types/employee.interface';

export const employeesQueryKey = 'employees';
export const employeeByIdQueryKey: (id: number | null) => [string, number] = (id: number | null) => ['employee', id || 0];

export function useEmployees() {
  return useQuery<Employee[]>({
    queryKey: [employeesQueryKey],
    queryFn: async () => {
      const { data } = await api.get('/employee');
      return data;
    },
  });
}

export function useEmployee(employeeId: number | null) {
  return useQuery<Employee>({
    queryKey: employeeByIdQueryKey(employeeId),
    enabled: !!employeeId,
    queryFn: async () => {
      const { data } = await api.get(`/employee/${employeeId}`);
      return data;
    },
  });
}
