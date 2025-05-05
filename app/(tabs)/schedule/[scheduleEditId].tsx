import { ScheduleForm } from "@/modules/admin/screens/ScheduleForm";
import { useGlobalSearchParams, useLocalSearchParams } from "expo-router";

export default function ScheduleEditId() {
    const {scheduleEditId} = useGlobalSearchParams();
    const scheduleId = Array.isArray(scheduleEditId) ? scheduleEditId[0] : scheduleEditId;
    return <ScheduleForm scheduleEditId={scheduleId} />
}