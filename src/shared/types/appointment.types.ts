import { Client } from "./client.interface";
import { Employee } from "../../modules/appointments/types/employee.interface";

export interface IAppointment {
  id: string;
  date: string;
  appointmentStatus: string;
  price: string;
  status: AppointmentStatus;
  clientId: number;
  employeeId: number;
  subTotalPrice: number;
  discount: number;
  totalPrice: number;
  totalDuration: number;
  clientName: string;
  client: Client
}

export interface IAppointmentMapped {
  id: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  client: string;
  appointmentStatus: AppointmentStatus;
  price: string;
}

export enum AppointmentStatus {
  PENDING = "Pendente",
  COMPLETED = "Concluído",
  CONFIRMED = "Confirmado",
  CANCELED = "Cancelado",
}

export interface AppointmentEditResponse extends IAppointment {
  employee: Employee;
  appointmentServices: {
    appointmentId: number;
    serviceId: number;
  }[];
}