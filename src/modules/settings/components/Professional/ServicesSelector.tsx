import React, { useState, useMemo } from "react";
import { View, Text, Switch, ScrollView, StyleSheet } from "react-native";
import { useCategoriesAndServices } from "@/shared/hooks/queries/useCategoriesAndServices";
import { Loading } from "@/shared/components/Loading";
import ErrorScreen from "@/app/ErrorScreen";
import { Service } from "@/shared/types/service.interface";
import { Employee } from "@/shared/types/employee.interface";
import { Button, Chip } from "react-native-paper";
import { useSettingsTabs } from "../../contexts/SettingTabsContext";
import { textCapitalize } from "@/shared/helpers/textCapitalize.helper";
import { Colors } from "@/shared/constants/Colors";

interface Props {
  employeeServicesData: Employee["employeeServices"] | undefined;
  tabsDataKey: string;
}

export function ServicesSelector({ employeeServicesData, tabsDataKey }: Props) {
  const { data: servicesData, isLoading, error, refetch } = useCategoriesAndServices(true, true, false);
  const { setTabData } = useSettingsTabs();

  const selectedServiceIds =
    employeeServicesData?.map(employeeServices => ({ serviceId: employeeServices.service.id })) || [];

  const [selectedIds, setSelectedIds] = useState<{ serviceId: number }[]>(selectedServiceIds || []);
  const [categoryFilter, setCategoryFilter] = useState<number>(0); // 0 = Todas
  const categories = useMemo(() => servicesData?.categories || [], [servicesData?.categories]);

  // Agrupar serviços por categoria
  const servicesByCategory = useMemo(() => {
    const grouped: Record<number, Service[]> = {};
    servicesData?.services.forEach(service => {
      if (!grouped[service.categoryId]) grouped[service.categoryId] = [];
      grouped[service.categoryId].push(service);
    });
    return grouped;
  }, [servicesData?.services]);

  if (isLoading) return <Loading />;
  if (error) return <ErrorScreen onRetry={refetch} message="Erro ao carregar serviços" />;
  if (!servicesData || servicesData.services.length === 0) {
    return <Text>Nenhum serviço encontrado. Adicione serviços para vinculá-los aos profissionais.</Text>;
  }

  const filteredCategoryIds = categoryFilter > 0 ? [categoryFilter] : categories.map(c => c.id);

  function onSelectChange(ids: { serviceId: number }[]) {
    setSelectedIds(ids);
    setTabData(tabsDataKey, ids);
  }

  function selectAllServices() {
    if (categoryFilter > 0) {
      // Apenas da categoria filtrada
      const servicesInCategory =
        servicesByCategory[categoryFilter]?.map(service => ({ serviceId: service.id })) || [];
      const merged = [
        ...selectedIds.filter(id => {
          const service = servicesData?.services.find(s => s.id === id.serviceId);
          return service?.categoryId !== categoryFilter;
        }),
        ...servicesInCategory,
      ];
      setSelectedIds(merged);
      setTabData(tabsDataKey, merged);
    } else {
      // Todos os serviços
      const allServiceIds = servicesData?.services.map(service => ({ serviceId: service.id })) || [];
      setSelectedIds(allServiceIds);
      setTabData(tabsDataKey, allServiceIds);
    }
  }

  // Contadores
  const totalSelected = selectedIds.length;
  const totalServices = servicesData.services.length;
  const selectedInCategory =
    categoryFilter > 0
      ? selectedIds.filter(id => {
          const service = servicesData.services.find(s => s.id === id.serviceId);
          return service?.categoryId === categoryFilter;
        }).length
      : 0;
  const totalInCategory = categoryFilter > 0 ? servicesByCategory[categoryFilter]?.length || 0 : 0;

  return (
    <View style={styles.container}>
      {/* Chips de categorias */}
      <View>
        <Text style={styles.smallLabel}>Filtrar por categoria</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
          {categories.map(category => {
            const isSelectedCategory = categoryFilter === category.id;

            return (
              <Chip
                key={category.id}
                selected={isSelectedCategory}
                onPress={() =>
                  setCategoryFilter(isSelectedCategory ? 0 : category.id)
                }
                style={[styles.chip, isSelectedCategory && styles.chipSelected]}
              >
                {textCapitalize(category.name)}
              </Chip>
            );
          })}
        </ScrollView>
      </View>

      {/* Contadores */}
      {categoryFilter > 0 ? (
        <Text style={styles.counter}>
          Selecionados nesta categoria: {selectedInCategory} de {totalInCategory}
        </Text>
      ) : (
        <Text style={styles.counter}>
          Total de serviços selecionados: {totalSelected} de {totalServices}
        </Text>
      )}

      {((categoryFilter === 0 && totalSelected < totalServices) ||
        (categoryFilter > 0 && selectedInCategory < totalInCategory)) && (
        <Button mode="outlined" onPress={selectAllServices}>
          {categoryFilter > 0 ? "Selecionar todos desta categoria" : "Selecionar todos os serviços"}
        </Button>
      )}

      {categoryFilter > 0 && (
        <Text style={styles.legend}>
          Os serviços de outras categorias continuam selecionados mesmo que não apareçam aqui.
        </Text>
      )}

      {/* Lista */}
      <ScrollView style={styles.scroll}>
        {filteredCategoryIds.map(categoryId => {
          const category = categories.find(c => c.id === categoryId);
          const services = servicesByCategory[categoryId] || [];
          if (!services.length) return null;

          return (
            <View key={categoryId} style={styles.categoryBlock}>
              <Text style={styles.categoryTitle}>{category?.name}</Text>

              {services.map(service => (
                <View key={service.id} style={styles.serviceRow}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Switch
                    value={selectedIds.some(id => id.serviceId === service.id)}
                    onValueChange={value =>
                      onSelectChange(
                        value
                          ? [...selectedIds, { serviceId: service.id }]
                          : selectedIds.filter(id => id.serviceId !== service.id)
                      )
                    }
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

const styles = StyleSheet.create({
  container: { gap: 10 },
  smallLabel: { fontSize: 12, color: Colors.light.textSecondary, marginBottom: 4 },
  chipContainer: { flexDirection: "row", marginBottom: 10 },
  chip: { marginRight: 8, backgroundColor: Colors.light.background },
  chipSelected: { backgroundColor: Colors.light.mainColor },
  counter: { fontSize: 14 },
  legend: { fontSize: 12, color: Colors.light.textSecondary, marginTop: 4 },
  scroll: { maxHeight: 400 },
  categoryBlock: { marginBottom: 15 },
  categoryTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 6 },
  serviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  serviceName: { fontSize: 14 },
});