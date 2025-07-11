import { useEmployee } from "@/shared/hooks/queries/useEmployees";
import { SettingsTabsLayout } from "../../SettingsTabsLayout";
import { GenericForm, GenericFormRef } from "../GenericForm";
import { useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";

export function SettingsProfessionalTabs() {
    const professionalProfileRef = useRef(null);
    const hoursRef = useRef<GenericFormRef>(null);
    const [serviceIntervalPlaceholder, setServiceIntervalPlaceholder] = useState("");

    const route = useRoute();
    const { employeeId } = route.params as { employeeId: number | null };

    const { data: employeeData } = useEmployee(employeeId);
    
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
        <SettingsTabsLayout
            headerTitle={employeeData?.name || "Novo profissional"}
            tabs={[
                {
                    key: "professional-profile",
                    title: "Perfil",
                    endpoint: employeeId ? `employee/${employeeId}` : "employee",
                    method: employeeId ? "PUT" : "POST",
                    ref: professionalProfileRef,
                    content:
                        <GenericForm
                            fields={[
                                { name: "name", label: "Nome", type: "text" },
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
                            ref={professionalProfileRef}
                            initialValues={employeeData}
                        />
                },
                {
                    key: "professional-hours",
                    title: "Horários",
                    ref: hoursRef,
                    endpoint: employeeId ? `employee/${employeeId}/working-hours` : "employee/working-hours",
                    method: employeeId ? "PUT" : "POST",
                    content: 
                    <GenericForm
                        ref={hoursRef}
                        fields={[
                            { 
                                name: "serviceInterval", 
                                label: "Intervalo entre atendimentos (em minutos)", 
                                type: "number", 
                                placeholder: serviceIntervalPlaceholder,
                                onChange: (value) => formatServiceInterval(value)
                            },
                            { name: "workingHours", label: "Horários de trabalho", type: "weekly-schedule",}
                        ]}
                    />
                }
            ]}
        />
    )
}