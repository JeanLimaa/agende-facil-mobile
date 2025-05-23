import { Client } from "./client.interface";
import { Employee } from "./employee.interface";

export interface IAppointment {
  id: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  clientName: string;
  appointmentStatus: string;
  price: string;
}

export enum AppointmentStatus {
  PENDING = "Pendente",
  COMPLETED = "Concluído",
  CONFIRMED = "Confirmado",
  CANCELED = "Cancelado",
}

export interface AppointmentEditResponse extends IAppointment {
  client: Client;
  employee: Employee;
  appointmentServices: {
    appointmentId: number;
    serviceId: number;
  }[];
}