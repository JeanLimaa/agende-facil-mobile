import { useQuery } from '@tanstack/react-query';
import api from '@/shared/services/apiService';
import { Employee, EmployeeService } from '@/shared/types/employee.interface';
import { CategoryWorkingHour } from '@/shared/types/category.interface';

export const employeesQueryKey = 'employees';

export function useEmployees() {
  return useQuery<Employee[]>({
    queryKey: [employeesQueryKey],
    queryFn: async () => {
      const { data } = await api.get('/employee');
      return data;
    },
  });
}

export const employeeByIdQueryKey: (id: number | null) => [string, number] = (id: number | null) => [employeesQueryKey, id || 0];

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

export const servicesByProfessionalQueryKey = (employeeId: number | null) => ['services', employeeId];

export function useServicesAttendedByProfessional(employeeId: number | null) {
  return useQuery<EmployeeService[]>({
    queryKey: servicesByProfessionalQueryKey(employeeId),
    enabled: !!employeeId,
    queryFn: async () => {
      const { data } = await api.get(`/employee/${employeeId}/services`);
      return data;
    },
  });
}

export const employeeCategoryWorkingHourQueryKey = 'employee-category-working-hours';
export const employeeCategoryWorkingHourByIdQueryKey = (employeeId: number | null) => [employeeCategoryWorkingHourQueryKey, employeeId];

export function useEmployeeCategoryWorkingHour(employeeId: number | null) {
  return useQuery<CategoryWorkingHour[]>({
    queryKey: employeeCategoryWorkingHourByIdQueryKey(employeeId),
    enabled: !!employeeId,
    queryFn: async () => {
      const { data } = await api.get(`/employee-category-working-hours/employee/${employeeId}`);
      return data;
    },
  });
}