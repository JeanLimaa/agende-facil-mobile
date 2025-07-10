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
            headerTitle="Profissionais"
            tabs={[
                {
                    key: "professional-profile",
                    title: "Perfil",
                    endpoint: "employee",
                    method: employeeId ? "PUT" : "POST",
                    ref: professionalProfileRef,
                    content:
                        <GenericForm
                            fields={[
                                { name: "name", label: "Nome", type: "text" },
                                { name: "email", label: "E-mail", type: "email" },
                                { name: "phone", label: "Telefone", type: "tel" },
                                { name: "position", label: "Cargo", type: "text" }
                            ]}
                            ref={professionalProfileRef}
                            initialValues={employeeData}
                        />
                }
            ]}
        />
    )
}