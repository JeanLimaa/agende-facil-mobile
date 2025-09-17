import { SettingsTabs } from "../../SettingsTabsLayout";
import { GenericForm } from "../GenericForm";
import { useRoute } from "@react-navigation/native";
import { categoriesAndServicesQueryKey, serviceByIdQueryKey, useCategoriesAndServices, useServiceById } from "@/shared/hooks/queries/useCategoriesAndServices";
import { Loading } from "@/shared/components/Loading";
import ErrorScreen from "@/app/ErrorScreen";
import { useMemo } from "react";

export const addOrEditServicesKeys = ["details", "pricing"] as const;

export function AddOrEditService() {
    const route = useRoute();
    const { serviceId } = route.params as { serviceId: number | null };

    const { data: serviceData, error: serviceError, isLoading: serviceLoading, refetch: serviceRefetch } = useServiceById(serviceId);
    const { data: categoriesData, error: categoriesError, isLoading: categoriesLoading, refetch: categoriesRefetch } = useCategoriesAndServices(true, false);

    const formattedCategories = useMemo(() => {
        return categoriesData?.categories?.map(category => ({
            label: category.name,
            value: category.id
        })) || [];
    }, [categoriesData]);

    const populatedCategory = useMemo(() => {
        return formattedCategories.find(option => option.value === serviceData?.categoryId) || formattedCategories[0];
    }, [formattedCategories, serviceData]);

    if (serviceLoading || categoriesLoading) {
        return <Loading />;
    }

    if (serviceError || categoriesError) {
        return <ErrorScreen onRetry={() => {
            serviceRefetch();
            categoriesRefetch();
        }} />;
    }

    return (
        <SettingsTabs
            headerTitle={serviceData?.name || "Novo serviço"}
            endpoint={serviceId ? `services/${serviceId}` : "services"}
            method={serviceId ? "PUT" : "POST"}
            tabs={[
                {
                    key: addOrEditServicesKeys[0],
                    title: "Serviço",
                    tanstackCacheKeys: [
                        categoriesAndServicesQueryKey,
                        serviceByIdQueryKey(serviceId)
                    ],
                    content:
                        <GenericForm
                            tabKey={addOrEditServicesKeys[0]}
                            fields={[
                                { name: "name", label: "Nome", type: "text", required: true },
                                { name: "description", label: "Descrição", type: "text" },
                                { name: "duration", label: "Duração do serviço", type: "number", placeholder: "Duração em minutos" },
                                {
                                    name: "categoryId",
                                    label: "Categoria",
                                    type: "select",
                                    options: formattedCategories
                                },
                                { name: "image", label: "Imagem", type: "file" },
                            ]}
                            initialValues={{ ...serviceData, categoryId: populatedCategory.value }}
                        />
                },
                {
                    key: addOrEditServicesKeys[1],
                    title: "Preço",
                    tanstackCacheKeys: [
                        categoriesAndServicesQueryKey,
                        serviceByIdQueryKey(serviceId)
                    ],
                    content:
                        <GenericForm
                            tabKey={addOrEditServicesKeys[1]}
                            fields={[
                                { name: "price", label: "Preço", type: "currency", required: true }
                            ]}
                            initialValues={serviceData ? serviceData : { price: 0 }}
                        />
                }
            ]}
        />
    )
}