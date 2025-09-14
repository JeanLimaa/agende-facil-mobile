import React, { useState, useEffect, useMemo } from "react";
import { View, Text, Switch, ScrollView } from "react-native";
import { useCategoriesAndServices } from "@/shared/hooks/queries/useCategoriesAndServices";
import { Loading } from "@/shared/components/Loading";
import ErrorScreen from "@/app/ErrorScreen";
import { Service } from "@/shared/types/service.interface";
import { Employee } from "@/shared/types/employee.interface";
import { SelectableListModal } from "@/shared/components/SelectableListModal";
import { Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useSettingsTabs } from "../../contexts/SettingTabsContext";

interface Props {
    employeeServicesData: Employee["employeeServices"] | undefined;
    tabsDataKey: string;
}

export function ServicesSelector({ employeeServicesData, tabsDataKey }: Props) {
    const { data, isLoading, error, refetch } = useCategoriesAndServices(true, true);
    const { setTabData } = useSettingsTabs();

    const selectedServiceIds = employeeServicesData?.map(employeeServices => ({ serviceId: employeeServices.service.id })) || [];

    const [selectedIds, setSelectedIds] = useState<{ serviceId: number }[]>(selectedServiceIds || []);
    const [categoryFilter, setCategoryFilter] = useState<number | null>(null);
    const [showCategoryModal, setShowCategoryModal] = useState(false);

    // Agrupar serviços por categoria
    const servicesByCategory = useMemo(() => {
        const grouped: Record<number, Service[]> = {};
        data?.services.forEach(service => {
            if (!grouped[service.categoryId]) grouped[service.categoryId] = [];
            grouped[service.categoryId].push(service);
        });
        return grouped;
    }, [data?.services]);

    // Lista de categorias para filtro
    const categories = useMemo(() => data?.categories || [], [data?.categories]);

    if (isLoading) return <Loading />;
    if (error) return <ErrorScreen onRetry={refetch} message="Erro ao carregar serviços" />;

    // Filtrar categorias se necessário
    const filteredCategoryIds = categoryFilter && categoryFilter > 0 ? [categoryFilter] : categories.map(c => c.id);

    function onSelectChange(ids: { serviceId: number }[]) {
        setSelectedIds(ids);
        setTabData(tabsDataKey, ids);
    }

    return (
        <View style={{ gap: 10 }}>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Ionicons name="filter" size={24} color="black" onPress={() => setShowCategoryModal(true)} />
                <Button onPress={() => setCategoryFilter(null)}>Limpar Filtro</Button>
            </View>

            <SelectableListModal
                data={categories}
                isLoading={false}
                modalVisible={showCategoryModal}
                setModalVisible={() => setShowCategoryModal(false)}
                handleSelect={category => {
                    setCategoryFilter(category.id);
                    setSelectedIds(prev => prev.filter(id => {
                        const service = data?.services.find(s => s.id === id.serviceId);
                        return service?.categoryId === category.id;
                    }
                    ));
                }}
                emptyMessage="Nenhuma categoria encontrada"
            />

            <ScrollView style={{ maxHeight: 400 }}>
                {filteredCategoryIds.map(categoryId => {
                    const category = categories.find(c => c.id === categoryId);
                    const services = servicesByCategory[categoryId] || [];
                    if (!services.length) return null;

                    return (
                        <View key={categoryId} style={{ marginBottom: 15 }}>
                            <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 6 }}>
                                {category?.name}
                            </Text>

                            {services.map(service => (
                                <View
                                    key={service.id}
                                    style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}
                                >
                                    <Text style={{ fontSize: 14 }}>{service.name}</Text>
                                    <Switch
                                        value={selectedIds.some(id => id.serviceId === service.id)}
                                        onValueChange={(value) => onSelectChange(value ? [...selectedIds, { serviceId: service.id }] : selectedIds.filter(id => id.serviceId !== service.id))}
                                    />
                                </View>
                            ))}
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
}
