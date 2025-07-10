import { useEmployee } from "@/shared/hooks/queries/useEmployees";
import { SettingsTabsLayout } from "../../SettingsTabsLayout";
import { GenericForm } from "../GenericForm";
import { useRoute } from "@react-navigation/native";
import { useRef } from "react";

export function SettingsProfessionalTabs() {
    const professionalProfileRef = useRef(null);
    
    const route = useRoute();
    const { employeeId } = route.params as { employeeId: number | null };

    const { data: employeeData } = useEmployee(employeeId);

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
                }
            ]}
        />
    )
}