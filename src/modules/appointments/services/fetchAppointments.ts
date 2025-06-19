import { AxiosResponse } from "axios";
import { IAppointment, IAppointmentMapped } from "@/shared/types/appointment.types";
import api from "@/shared/services/apiService";
import { format } from "date-fns";
import { formatToCurrency } from "@/shared/helpers/formatValue.helper";

export async function fetchAppointments(): Promise<IAppointmentMapped[]> {
  const response: AxiosResponse<IAppointment[]> = await api.get("/appointment/company");
  
  return response.data.map((item: IAppointment) => {
    const dateObj = new Date(item.date);
    
    return {
      id: String(item.id),
      date: format(dateObj, "yyyy-MM-dd"),
      timeStart: dateObj.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' }),
      timeEnd: new Date(dateObj.getTime() + 30 * 60000).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' }),
      client: item.clientName ?? "Cliente não informado",
      appointmentStatus: item.status,
      price: formatToCurrency(item.totalPrice),
    };
  });
}