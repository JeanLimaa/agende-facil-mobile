import { View, Text, ScrollView } from "react-native";
import { Chip, Checkbox, Divider } from "react-native-paper";
import { appointmentFormStyle as styles } from "../../styles/styles";
import { Service } from "@/shared/types/service.interface";
import { Category } from "../../types/category.interface";
import { formatToCurrency } from "@/shared/helpers/formatValue";
import { textCapitalize } from "@/shared/helpers/textCapitalize";
import { useMemo } from "react";

interface Props {
  services: Service[];
  categories: Category[];
  selectedServices: number[];
  setSelectedServices: (services: number[] | ((prev: number[]) => number[])) => void;
  selectedCategoryId: number;
  setSelectedCategoryId: (id: number) => void;
}

export function ServiceSelector({
  services,
  categories,
  selectedServices,
  setSelectedServices,
  selectedCategoryId,
  setSelectedCategoryId,
}: Props) {
  const filteredServices = useMemo(() => {
    // Categoria "Selecionados"
    if (selectedCategoryId === -1) {
      return services.filter(service => selectedServices.includes(service.id));
    }

    // Categoria "Todas"
    if (selectedCategoryId === 0) {
      return services;
    }

    return services.filter(service => service.categoryId === selectedCategoryId)
  },
    [selectedCategoryId, services]
  );

  const toggleService = (serviceId: number) => {
    setSelectedServices((prev: number[]) =>
      prev.includes(serviceId)
        ? prev.filter((id: number) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionLabel}>Serviços</Text>

      {/* Filtro de Categoria */}
      <View>
        <Text style={styles.smallLabel}>Filtrar por categoria</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipContainer}
        >
          {categories.map(category => {
            const isSelectedCategory = selectedCategoryId === category.id;
            const isSelecionados = category.id === -1;

            const categoryLabel = isSelecionados
              ? `${textCapitalize(category.name)} (${selectedServices.length})`
              : textCapitalize(category.name);

            return (
              <Chip
                key={category.id}
                selected={isSelectedCategory}
                onPress={() => setSelectedCategoryId(
                  isSelectedCategory ? 0 : category.id
                )}
                style={[styles.chip, isSelectedCategory && styles.chipSelected]}
              >
                {categoryLabel}
              </Chip>
            );
          })}
        </ScrollView>
      </View>

      {/* Lista de Serviços */}
      {services.length === 0 ? <Text style={styles.mediumLabel}>Nenhum serviço encontrado</Text> :
        filteredServices
          .map(service => {
            const isSelected = selectedServices.includes(service.id);

            return (
              <View key={service.id}>
                <View style={[
                  styles.serviceItem,
                  isSelected && styles.selectedServiceItem
                ]}>
                  <Checkbox
                    status={isSelected ? 'checked' : 'unchecked'}
                    onPress={() => toggleService(service.id)}
                  />
                  <View style={styles.serviceInfo}>
                    <Text>{service.name}</Text>
                    <Text>{formatToCurrency(service.price)}</Text>
                  </View>
                </View>
                <Divider />
              </View>
            )
          })}
      {services.length > 0 && filteredServices.length === 0 ?
        <Text style={styles.mediumLabel}>Não há serviços cadastrados para essa categoria.</Text>
        : null}

    </View>
  )
}