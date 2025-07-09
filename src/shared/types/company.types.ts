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

interface CompanyInfo {
    profile: CompanyProfile;
    address: CompanyAddress;
}