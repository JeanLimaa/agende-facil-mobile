import { ClientAppointmentHistoryScreen } from "@/modules/clients/screens/ClientAppointmentHistoryScreen";
import { useGlobalSearchParams } from "expo-router";

export default function AppointmentsHistoryPage() {
    const params = useGlobalSearchParams<{ id: string }>();
    return <ClientAppointmentHistoryScreen clientId={Number(params.id)}/>;
}