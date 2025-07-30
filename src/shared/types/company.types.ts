export interface CompanyProfile {
    name: string;
    email: string;
    phone: string;
    description?: string;
    logo?: string; // URL ou caminho do arquivo
}

export interface CompanyAddress {
    zipCode: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
}

// Representa o horário de funcionamento para um único dia da semana
export interface DailyWorkingHour {
  startTime: string;   // formato "HH:mm"
  endTime: string;     // formato "HH:mm"
  dayOfWeek: number;   // 0 = domingo, 6 = sábado
}
export interface CompanyWorkingHours {
    serviceInterval: number; // em minutos
    workingHours: DailyWorkingHour[]; 
}

export interface CompanyInfo {
    profile: CompanyProfile;
    address: CompanyAddress;
    schedule: CompanyWorkingHours;
}