import { useQuery } from "@tanstack/react-query";
import { Client } from "@/shared/types/client.interface";
import api from "@/shared/services/apiService";

async function fetchClients(): Promise<Client[]> {
    const response = await api.get("/clients");
    return response.data;
}

export function useClients() {
    return useQuery<Client[]>({
        queryKey: ["clients"],
        queryFn: fetchClients
    });
}

export function useClientById(id: number){
    return useQuery<Client>({
        queryKey: ["client", id],
        queryFn: async () => {
            const response = await api.get(`/clients/${id}`);
            return response.data;
        },
        enabled: !!id
    });
}