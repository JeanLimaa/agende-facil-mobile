import api from "@/shared/services/apiService";
import { MePayload } from "@/shared/types/me.interface";
import { useQuery } from "@tanstack/react-query";

export const myQueryKey = "me";

async function getMe(): Promise<MePayload>{
    const response = await api.get<MePayload>("/auth/me");
    return response.data
}

export function useMe(){
    return useQuery<MePayload>({
        queryKey: [myQueryKey],
        queryFn: getMe
    })
}