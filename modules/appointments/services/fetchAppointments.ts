import { AxiosResponse } from "axios";
import { IAppointment, IAppointmentMapped } from "../types/appointment.types";
import api from "@/services/apiService";

export async function fetchAppointments(): Promise<IAppointmentMapped[]> {
  const response: AxiosResponse<IAppointment[]> = await api.get("/appointment/company");
  
  return response.data.map((item) => {
    const dateObj = new Date(item.date);
    return {
      id: String(item.id),
      date: item.date.split("T")[0],
      timeStart: dateObj.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' }),
      timeEnd: new Date(dateObj.getTime() + 30 * 60000).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' }),
      client: item.clientName ?? "Cliente não informado",
      appointmentStatus: item.status,
      price: `R$ ${item.totalPrice?.toFixed(2).replace('.', ',') ?? '0,00'}`,
    };
  });
}