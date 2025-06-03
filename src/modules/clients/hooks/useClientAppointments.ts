import { useQuery } from "@tanstack/react-query";
import api from "@/shared/services/apiService";

export function useClientAppointments(clientId: number) {
  return useQuery({
    queryKey: ["client-appointments", clientId],
    queryFn: async () => {
      const response = await api.get(`/appointment/client/${clientId}`);
      return response.data;
    },
    enabled: !!clientId,
  });
}
