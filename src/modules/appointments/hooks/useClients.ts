import { useQuery } from "@tanstack/react-query";
import { Client } from "../types/client.interface";
import api from "@/shared/services/apiService";

async function fetchClients(): Promise<Client[]> {
    const response = await api.get("/clients");
    return response.data;
}

export function useClients() {
    return useQuery<Client[]>({
        queryKey: ["clients"],
        queryFn: fetchClients,
    });
}