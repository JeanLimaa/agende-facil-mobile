import {  WorkingHours } from "./working-hours.interface";

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
export interface CompanyWorkingHours {
    serviceInterval: number; // em minutos
    workingHours: WorkingHours[]; 
}

export interface CompanyInfo {
    profile: CompanyProfile;
    address: CompanyAddress;
    schedule: CompanyWorkingHours;
}