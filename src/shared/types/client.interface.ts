import { Employee } from "@/modules/appointments/types/employee.interface";
import { IAppointment } from "./appointment.types";
import { Service } from "./service.interface";

export interface Client {
  id: number;
  name: string;
  email?: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  isBlocked: boolean;
}

interface AppointmentAsOmit extends Omit<IAppointment, "appointmentStatus"> {}

export interface ClientAppointments extends AppointmentAsOmit {
  services: Service[];
  employee: Employee
}