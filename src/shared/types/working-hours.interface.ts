
export interface DailyWorkingHour {
  startTime: string;   // formato "HH:mm"
  endTime: string;     // formato "HH:mm"
  dayOfWeek: number;   // 0 = domingo, 6 = sábado
}

export interface WorkingHours extends DailyWorkingHour {
    id: number;
}