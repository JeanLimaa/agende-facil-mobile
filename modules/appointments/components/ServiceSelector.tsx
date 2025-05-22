import { View, Text, ScrollView } from "react-native";
import { Chip, Checkbox, Divider } from "react-native-paper";
import { appointmentFormStyle as styles } from "../styles/styles";
import { Service } from "../types/service.interface";
import { Category } from "../types/category.interface";
import { formatToCurrency } from "@/helpers/formatValue";
import { textCapitalize } from "@/helpers/textCapitalize";
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
    const filteredServices = useMemo( 
        () => services.filter(s => !selectedCategoryId || s.categoryId === selectedCategoryId),
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
              {categories.map(category => (
                <Chip
                  key={category.id}
                  selected={selectedCategoryId === category.id}
                  onPress={() => setSelectedCategoryId(
                    selectedCategoryId === category.id ? 0 : category.id
                  )}
                  style={[styles.chip, selectedCategoryId === category.id && styles.chipSelected]}
                >
                  {textCapitalize(category.name)}
                </Chip>
              ))}
            </ScrollView>
          </View>

          {/* Lista de Serviços */}
          {services.length === 0 ? <Text style={styles.mediumLabel}>Nenhum serviço encontrado</Text> : 
            filteredServices
            .map(service => (
              <View key={service.id}>
                <View style={styles.serviceItem}>
                  <Checkbox
                    status={selectedServices.includes(service.id) ? 'checked' : 'unchecked'}
                    onPress={() => toggleService(service.id)}
                  />
                  <View style={styles.serviceInfo}>
                    <Text>{service.name}</Text>
                    <Text>{formatToCurrency(service.price)}</Text>
                  </View>
                </View>
                <Divider />
              </View>
          ))}
          {services.length > 0 && filteredServices.length === 0 ? 
            <Text style={styles.mediumLabel}>Não há serviços cadastrados para essa categoria.</Text> 
          : null}
            
        </View>
    )
}