import { useEmployee } from "@/shared/hooks/queries/useEmployees";
import { SettingsTabs } from "../../SettingsTabsLayout";
import { GenericForm } from "../GenericForm";
import { useRoute } from "@react-navigation/native";
import { useState } from "react";

export function SettingsProfessionalTabs() {
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
        <SettingsTabs
            headerTitle={employeeData?.name || "Novo profissional"}
            endpoint={employeeId ? `settings/employee/${employeeId}` : "settings/employee"}
            method={employeeId ? "PUT" : "POST"}
            tabs={[
                {
                    key: "professional-profile",
                    title: "Perfil",
                    content:
                        <GenericForm
                            tabKey="professional-profile"
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
                            initialValues={employeeData}
                        />
                },
                {
                    key: "professional-hours",
                    title: "Horários",
                    content: 
                    <GenericForm
                        tabKey="professional-hours"
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