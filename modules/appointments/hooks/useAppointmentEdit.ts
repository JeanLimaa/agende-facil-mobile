import { useQuery } from '@tanstack/react-query';
import api from '@/shared/services/apiService';
import { AppointmentEditResponse } from '../types/appointment.types';

export function useAppointmentEdit(appointmentEditId?: string) {
  return useQuery<AppointmentEditResponse>({
    queryKey: ['appointment', appointmentEditId],
    queryFn: () => api.get(`/appointment/${appointmentEditId}`).then(res => res.data),
    enabled: !!appointmentEditId,
  });
}
