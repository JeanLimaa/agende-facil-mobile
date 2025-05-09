import { AppointmentForm } from "@/modules/appointments/screens/AppointmentForm";
import { useGlobalSearchParams, useLocalSearchParams } from "expo-router";

export default function AppointmentEditId() {
    const {appointmentEditId} = useGlobalSearchParams();
    const appointmentId = Array.isArray(appointmentEditId) ? appointmentEditId[0] : appointmentEditId;
    return <AppointmentForm appointmentEditId={appointmentId} />
}