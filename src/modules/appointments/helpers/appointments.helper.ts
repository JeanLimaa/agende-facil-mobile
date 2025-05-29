import { AppointmentStatus, IAppointmentMapped } from "../types/appointment.types";

export const groupByDate = (appointments: IAppointmentMapped[]): { [key: string]: IAppointmentMapped[] } => {
  const grouped = appointments.reduce((acc, appointment) => {
    const date = appointment.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(appointment);
    return acc;
  }, {} as Record<string, IAppointmentMapped[]>);
  const sortedEntries = Object.entries(grouped).sort(([dateA], [dateB]) =>
    new Date(dateB).getTime() - new Date(dateA).getTime()
  );
  return Object.fromEntries(sortedEntries);
};

export function getStatusBorderColor(status: AppointmentStatus): string {
    switch (status) {
      case AppointmentStatus.COMPLETED:
        return "#4CAF50";
      case AppointmentStatus.CANCELED:
        return "#F44336";
      default:
        return "#FF9800";
  }
}