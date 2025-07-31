import { SettingsTabs } from "../../SettingsTabsLayout";
import { GenericForm } from "../GenericForm";
import { useRoute } from "@react-navigation/native";
import { categoriesAndServicesQueryKey, categoryByIdQueryKey, useCategoryById } from "@/shared/hooks/queries/useCategoriesAndServices";

export function AddOrEditCategory() {
    const route = useRoute();
    const { categoryId } = route.params as { categoryId: number | null };

    const { data: categoryData } = useCategoryById(categoryId);

    return (
        <SettingsTabs
            headerTitle={categoryData?.name || "Nova categoria"}
            endpoint={categoryId ? `category/${categoryId}` : "category"}
            method={categoryId ? "PUT" : "POST"}
            tabs={[{
                key: "category-details",
                title: "Detalhes",
                tanstackCacheKeys: [
                    categoriesAndServicesQueryKey, 
                    categoryByIdQueryKey(categoryId)
                ],
                content:
                    <GenericForm
                        tabKey="category-details"
                        fields={[
                            { name: "name", label: "Nome", type: "text", required: true }
                        ]}
                        initialValues={categoryData}
                    />
            }
            ]}
        />
    )
}