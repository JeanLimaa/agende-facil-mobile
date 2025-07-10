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
}