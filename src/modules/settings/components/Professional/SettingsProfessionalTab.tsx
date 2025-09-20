import { employeeByIdQueryKey, employeesQueryKey, useEmployee, useServicesAttendedByProfessional } from "@/shared/hooks/queries/useEmployees";
import { SettingsTabs } from "../../SettingsTabsLayout";
import { GenericForm } from "../GenericForm";
import { useRoute } from "@react-navigation/native";
import { useState } from "react";
import { Loading } from "@/shared/components/Loading";
import ErrorScreen from "@/app/ErrorScreen";
import { ServicesSelector } from "./ServicesSelector";
import { useCompany } from "@/shared/hooks/queries/useCompany";

export const professionalTabKeys = ["profile", "workingHours", "employeeServices"] as const;

export function SettingsProfessionalTabs() {
    const [serviceIntervalPlaceholder, setServiceIntervalPlaceholder] = useState("");

    const route = useRoute();
    const { employeeId } = route.params as { employeeId: number | null };

    const { 
        data: employeeData, isLoading, error, refetch 
    } = useEmployee(employeeId);

    const { data: companyData } = useCompany();

    if(isLoading) return <Loading />;
    if(error) return <ErrorScreen onRetry={refetch} message="Erro ao carregar dados" />;

    function formatServiceInterval(value: string) {
        if (!value) {
            setServiceIntervalPlaceholder("");
            return;
        }

        const serviceInterval = parseInt(value, 10);

        if (isNaN(serviceInterval) || serviceInterval <= 0) {
            setServiceIntervalPlaceholder("");
            return;
        }

        const minutes = serviceInterval % 60;
        const hours = Math.floor(serviceInterval / 60) % 24;
        const days = Math.floor(serviceInterval / (60 * 24));

        const formattedInterval = `${days > 0 ? `${days} dias, ` : ""}${hours > 0 ? `${hours} horas, ` : ""}${minutes} minutos`;
        setServiceIntervalPlaceholder(formattedInterval);
    }
    
    return (
        <SettingsTabs
            headerTitle={employeeData?.name || "Novo profissional"}
            endpoint={employeeId ? `settings/employee/${employeeId}` : "settings/employee"}
            method={employeeId ? "PUT" : "POST"}
            tabs={[
                {
                    key: professionalTabKeys[0],
                    title: "Perfil",
                    tanstackCacheKeys: [employeesQueryKey, employeeByIdQueryKey(employeeId)],
                    content:
                        <GenericForm
                            tabKey={professionalTabKeys[0]}
                            fields={[
                                { name: "name", label: "Nome", type: "text", required: true},
                                { name: "phone", label: "Telefone", type: "tel" },
                                { name: "position", label: "Cargo", type: "text" },
                                { 
                                    name: "profileImageUrl", 
                                    label: "Imagem profissional", 
                                    type: "file"
                                },
                                { 
                                    name: "displayOnline", 
                                    label: "Exibir profissional no agendamento online", 
                                    type: "checkbox",
                                    placeholder: "Habilitar para que o profissional apareça nas opções de agendamento online."
                                }
                            ]}
                            initialValues={{...employeeData, displayOnline: employeeId ? employeeData?.displayOnline : true}}
                        />
                },
                {
                    key: professionalTabKeys[1],
                    title: "Horários",
                    tanstackCacheKeys: [employeesQueryKey, employeeByIdQueryKey(employeeId)],
                    content: 
                    <GenericForm
                        tabKey={professionalTabKeys[1]}
                        fields={[
                            {
                                name: "informativeMessage",
                                type: "informativeMessage",
                                label: "Caso não seja definido nada aqui, será utilizado o horario padrão da empresa para este profissional.",
                            },
                            { 
                                name: "serviceInterval", 
                                label: "Intervalo entre atendimentos (em minutos)", 
                                type: "number", 
                                placeholder: serviceIntervalPlaceholder,
                                onChange: (value) => formatServiceInterval(value as string)
                            },
                            { 
                                name: "workingHours", 
                                label: "Horários de trabalho", 
                                type: "weekly-schedule",
                                weeklyScheduleProps: {
                                    useModal: true,
                                    modalTitle: "Configurar Horários",
                                    modalSubtitle: employeeData?.name,
                                    employee: employeeData,
                                    companyWorkingHours: companyData?.schedule,
                                    type: "employee"
                                }
                            }
                        ]}
                        initialValues={employeeData}
                    />
                },
                {
                    key: professionalTabKeys[2],
                    title: "Serviços",
                    tanstackCacheKeys: [employeesQueryKey, employeeByIdQueryKey(employeeId)],
                    content: <ServicesSelector employeeServicesData={employeeData?.employeeServices} tabsDataKey={professionalTabKeys[2]} />
                }
            ]}
        />
    )
}