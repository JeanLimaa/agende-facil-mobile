import { SettingsTabs } from "../../SettingsTabsLayout";
import { GenericForm } from "../GenericForm";
import { useRoute } from "@react-navigation/native";
import { categoriesAndServicesQueryKey, serviceByIdQueryKey, useServiceById } from "@/shared/hooks/queries/useCategoriesAndServices";

export function AddOrEditService() {
    const route = useRoute();
    const { serviceId } = route.params as { serviceId: number | null };

    const { data: serviceData } = useServiceById(serviceId);

    return (
        <SettingsTabs
            headerTitle={serviceData?.name || "Novo serviço"}
            endpoint={serviceId ? `service/${serviceId}` : "service"}
            method={serviceId ? "PUT" : "POST"}
            tabs={[
                {
                    key: "service-details",
                    title: "Serviço",
                    tanstackCacheKeys: [
                        categoriesAndServicesQueryKey,
                        serviceByIdQueryKey(serviceId)
                    ],
                    content:
                        <GenericForm
                            tabKey="service-details"
                            fields={[
                                { name: "name", label: "Nome", type: "text", required: true },
                                { name: "description", label: "Descrição", type: "text" },
                                { name: "duration", label: "Duração", type: "number", placeholder: "Duração em minutos" },
                                { name: "image", label: "Imagem", type: "file" },
                            ]}
                            initialValues={serviceData}
                        />
                }, 
                {
                    key: "service-pricing",
                    title: "Preço",
                    tanstackCacheKeys: [
                        categoriesAndServicesQueryKey,
                        serviceByIdQueryKey(serviceId)
                    ],
                    content:
                        <GenericForm
                            tabKey="service-pricing"
                            fields={[
                                { name: "price", label: "Preço", type: "number", required: true }
                            ]}
                            initialValues={serviceData ? serviceData : {price: 0}}
                        />
                },
                {
                    key: "service-professionals",
                    title: "Profissionais",
                    tanstackCacheKeys: [
                        categoriesAndServicesQueryKey,
                        serviceByIdQueryKey(serviceId)
                    ],
                    content:
                        <GenericForm
                            tabKey="service-professionals"
                            fields={[
                                { name: "schedule", label: "Agendamento", type: "weekly-schedule", required: true }
                            ]}
                            initialValues={serviceData}
                        />
                }
            ]}
        />
    )
}