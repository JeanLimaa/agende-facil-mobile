interface CompanyProfile {
    name: string;
    email: string;
    phone: string;
    description?: string;
    logo?: string; // URL ou caminho do arquivo
}

interface CompanyAddress {
    zipCode: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
}

interface CompanyWorkingHours {
    serviceInterval: number; // em minutos
    workingHours: { startTime: string; endTime: string; dayOfWeek: number }[]; // dayOfWeek é o dia da semana (0-6, onde 0 é domingo)
}

export interface CompanyInfo {
    profile: CompanyProfile;
    address: CompanyAddress;
    schedule: CompanyWorkingHours;
}