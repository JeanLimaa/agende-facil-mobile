import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { AppBarHeader } from "@/shared/components/AppBarHeader";
import { Loading } from "@/shared/components/Loading";
import ErrorScreen from "@/app/ErrorScreen";
import { Card, Chip, IconButton } from "react-native-paper";
import { router } from "expo-router";
import { useCategoriesAndServices } from "@/shared/hooks/queries/useCategoriesAndServices";
import { employeeCategoryWorkingHourByIdQueryKey, useEmployeeCategoryWorkingHour, useEmployees } from "@/shared/hooks/queries/useEmployees";
import { useCompany } from "@/shared/hooks/queries/useCompany";
import Toast from "react-native-toast-message";
import api from "@/shared/services/apiService";
import { useApiErrorHandler } from "@/shared/hooks/useApiErrorHandler";
import { Colors } from "@/shared/constants/Colors";
import { CategoryWorkingHoursModal } from "../components/CategoryWorkingHours/CategoryWorkingHoursModal";
import { useRoute } from "@react-navigation/native";
import { useConfirm } from "@/shared/hooks/useConfirm";
import { Category, CategoryWorkingHour } from "@/shared/types/category.interface";
import { DailyWorkingHour } from "@/shared/types/working-hours.interface";
import { useQueryClient } from "@tanstack/react-query";

export default function CategoryWorkingHoursScreen() {
  const route = useRoute();
  const { employeeId } = route.params as { employeeId: number | null };
  const { confirm, ConfirmDialogComponent } = useConfirm();
  const {
    data: categoriesAndServices,
    isLoading: loadingCategories,
    error: categoriesError,
    refetch: refetchCategories
  } = useCategoriesAndServices(true, false, false);
  const { 
    data: employees, 
    isLoading: loadingEmployees, 
    error: employeesError, 
    refetch: refetchEmployees 
  } = useEmployees();
  const { 
    data: companyData, 
    isLoading: loadingCompany, 
    error: companyError, 
    refetch: refetchCompany 
  } = useCompany();
  const { 
    data: categoryWorkingHoursData, 
    isLoading: loadingCategoryWorkingHours, 
    error: categoryWorkingHoursError, 
    refetch: refetchCategoryWorkingHours 
  } = useEmployeeCategoryWorkingHour(employeeId);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedCategoryHours, setSelectedCategoryHours] = useState<CategoryWorkingHour[]>([]);
  const handleApiError = useApiErrorHandler();
  const queryClient = useQueryClient();

  const refetchAll = () => {
    refetchCategories();
    refetchEmployees();
    refetchCompany();
    refetchCategoryWorkingHours();
  }

  const employee = employees?.find(emp => emp.id === employeeId);
  const categories = categoriesAndServices?.categories || [];
  const categoryWorkingHours = categoryWorkingHoursData || [];


  const handleAddCategoryHours = (category: Category) => {
    const existingHours = categoryWorkingHours.filter(h => h.categoryId === category.id);
    setSelectedCategory(category);
    setSelectedCategoryHours(existingHours);
    setModalVisible(true);
  };

  const handleSaveHours = async (hours: DailyWorkingHour[]) => {
    try {
      setLoading(true);

      if (!employeeId || !selectedCategory) {
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: 'Funcionário ou categoria não selecionados.'
        });
        return;
      }

      // Primeiro, deletar horários existentes para esta categoria
      await api.delete(`/employee-category-working-hours/employee/${employeeId}/category/${selectedCategory.id}`);

      // Depois, criar os novos horários
      if (hours.length > 0) {
        const hoursToCreate: Omit<CategoryWorkingHour, 'id'>[] = hours.map(hour => ({
          employeeId: employeeId,
          categoryId: selectedCategory.id,
          dayOfWeek: hour.dayOfWeek,
          startTime: hour.startTime,
          endTime: hour.endTime,
        }));

        await api.post('/employee-category-working-hours/bulk', {
          workingHours: hoursToCreate
        });
      }

      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'Horários salvos com sucesso!'
      });

      queryClient.invalidateQueries({ queryKey: employeeCategoryWorkingHourByIdQueryKey(employeeId) });
      setModalVisible(false);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategoryHours = async (categoryId: number) => {
    const confirmDelete = await confirm({
      title: "Excluir Horários da Categoria",
      message: "Deseja remover todos os horários desta categoria?",
      confirmText: "Excluir",
      cancelText: "Cancelar",
    });

    if (!confirmDelete) return;

    try {
      setLoading(true);
      await api.delete(`/employee-category-working-hours/employee/${employeeId}/category/${categoryId}`);
      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'Horários excluídos com sucesso!'
      });
      
      queryClient.invalidateQueries({ queryKey: employeeCategoryWorkingHourByIdQueryKey(employeeId) });
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryHours = (categoryId: number) => {
    return categoryWorkingHours.filter(h => h.categoryId === categoryId);
  };

  const getDayName = (dayOfWeek: number) => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return days[dayOfWeek];
  };

  if (loadingCategories || loadingEmployees || loadingCompany || loadingCategoryWorkingHours) return <Loading />;
  if (categoriesError || employeesError || companyError || categoryWorkingHoursError) return <ErrorScreen message="Erro ao carregar dados" onRetry={refetchAll} />;
  if (!employee) return <ErrorScreen message="Funcionário não encontrado" onRetry={() => router.back()} />;

  return (
    <View style={styles.container}>
      <AppBarHeader message={`Horários por Categoria - ${employee.name}`} />

      <ScrollView style={styles.scrollView}>
        <Text style={styles.infoText}>
          Configure horários específicos para cada categoria. Se não configurado, o funcionário usará seus horários padrão.
        </Text>
        <Text style={styles.infoText}>
          A configuração de horários por categoria tem prioridade sobre os horários padrão do funcionário.
        </Text>

        {categories.map((category: Category) => {
          const categoryHours = getCategoryHours(category.id);
          const hasHours = categoryHours.length > 0;

          return (
            <Card key={category.id} style={styles.card}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <Text style={styles.categoryTitle}>
                    {category.name}
                  </Text>
                  <View style={styles.actionsContainer}>
                    <IconButton
                      icon="pencil"
                      size={20}
                      onPress={() => handleAddCategoryHours(category)}
                    />
                    {hasHours && (
                      <IconButton
                        icon="delete"
                        size={20}
                        iconColor="#E53935"
                        onPress={() => handleDeleteCategoryHours(category.id)}
                      />
                    )}
                  </View>
                </View>

                {hasHours ? (
                  <View style={styles.hoursContainer}>
                    {categoryHours.map((hour, index) => (
                      <Chip
                        key={index}
                        mode="outlined"
                        style={styles.hourChip}
                      >
                        {getDayName(hour.dayOfWeek)}: {hour.startTime}-{hour.endTime}
                      </Chip>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.defaultHoursText}>
                    Usando horários padrão do funcionário
                  </Text>
                )}
              </Card.Content>
            </Card>
          );
        })}
      </ScrollView>

      <CategoryWorkingHoursModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        category={selectedCategory!}
        initialHours={selectedCategoryHours}
        onSave={handleSaveHours}
        loading={loading}
        employee={employee}
        companyWorkingHours={companyData?.schedule}
      />

      {ConfirmDialogComponent}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  scrollView: { 
    flex: 1, 
    padding: 16 
  },
  infoText: {
    fontSize: 14,
    marginBottom: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center'
  },
  card: { 
    marginBottom: 12 
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  categoryTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    flex: 1 
  },
  actionsContainer: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  hoursContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 8 
  },
  hourChip: { 
    backgroundColor: '#E8F5E8' 
  },
  defaultHoursText: { 
    color: Colors.light.textSecondary, 
    fontStyle: 'italic' 
  }
})