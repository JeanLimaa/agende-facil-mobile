import { WorkingHours } from "./working-hours.interface";

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface CategoryWorkingHour extends WorkingHours {
  categoryId: number;
  employeeId: number;
}