import { Service } from "./service.interface";
import { WorkingHours } from "./working-hours.interface";

export interface Employee {
  id: number;
  name: string;
  phone: string;
  startHour: string;
  endHour: string;
  serviceInterval: number;
  companyId: number;
  createdAt: string;
  updatedAt: string;
  position?: string;
  profileImageUrl?: string;
  workingHours: WorkingHours[];
  employeeServices: Omit<EmployeeService, 'id' | 'employeeId' | 'serviceId'>[];
}

export interface EmployeeService {
  id: number;
  employeeId: number;
  serviceId: number;
  service: Service;
}