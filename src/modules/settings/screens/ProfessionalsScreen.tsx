import React from "react";
import { View, Text, FlatList } from "react-native";
import { AppBarHeader } from "@/shared/components/AppBarHeader";
import { useEmployees } from "@/shared/hooks/queries/useEmployees";
import { Loading } from "@/shared/components/Loading";
import ErrorScreen from "@/app/ErrorScreen";
import { ActionsModal } from "@/shared/components/ActionsModal";
import { FAB } from "react-native-paper";
import { ProfessionalCard } from "../components/Professional/ProfessionalCard";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { fabStyle } from "@/shared/styles/fab";
import { useConfirm } from "@/shared/hooks/useConfirm";
import api from "@/shared/services/apiService";
import { useApiErrorHandler } from "@/shared/hooks/useApiErrorHandler";

export default function ProfessionalsScreen() {
  const navigation = useNavigation<any>();
  const {data: employees, refetch, isLoading, error} = useEmployees();
  const [actionsModalVisible, setActionsModalVisible] = React.useState(false);
  const [selectedEmployee, setSelectedEmployee] = React.useState<number | null>(null);
  const { confirm: confirmDelete, ConfirmDialogComponent: ConfirmDeleteDialogComponent } = useConfirm();
  const handleApiError = useApiErrorHandler();

  if(isLoading) return <Loading />;
  if(error) return <ErrorScreen message="Erro ao carregar profissionais" onRetry={refetch} />;

  const openActions = (employeeId: number) => {
    setSelectedEmployee(employeeId);
    setActionsModalVisible(true);
  }

  const cleanActions = () => {
    setSelectedEmployee(null);
    setActionsModalVisible(false);
  }

  function handleAddEmployee() {
    cleanActions();
    
    navigation.navigate("settings/records/professionals/professional-form", { employeeId: null });
  }

  function handleEditEmployee(employeeId: number | null) {
    if(!employeeId) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Nenhum profissional selecionado.'
      });
      return;
    }
    
    cleanActions();

    navigation.navigate("settings/records/professionals/professional-form", { employeeId });
  }

  async function handleDeleteEmployee(employeeId: number | null) {
    if(!employeeId) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Nenhum profissional selecionado.'
      });
      return;
    }

    cleanActions();

    const confirmed = await confirmDelete({
      title: "Excluir Profissional",
      message: "Você tem certeza que deseja excluir este profissional? Esta ação não pode ser desfeita.",
      confirmText: "Excluir",
      cancelText: "Cancelar",
    });

    if (!confirmed) return;

    try {
      await api.delete(`/employee/${employeeId}`);
      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'Profissional excluído com sucesso.'
      });
      refetch();
    } catch (error) {
      handleApiError(error);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <AppBarHeader message="Profissionais" />
      
      <FlatList
        data={employees}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ProfessionalCard 
            employee={item} 
            onPress={() => openActions(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={{ padding: 16, alignItems: 'center' }}>
            <Text style={{ color: '#999' }}>Nenhum profissional encontrado</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 16 }}
      />

      <FAB
        icon="plus"
        style={fabStyle.fab}
        onPress={handleAddEmployee}
      />

      <ActionsModal
        visible={actionsModalVisible}
        onClose={() => setActionsModalVisible(false)}
        title="Ações do Profissional"
        options={[
          { 
            label: "Editar", 
            action: () => handleEditEmployee(selectedEmployee), 
            icon: { name: "edit", family: "MaterialIcons" }, 
            color: "#1E88E5" 
          },
          { 
            label: "Excluir", 
            action: () => handleDeleteEmployee(selectedEmployee), 
            icon: { name: "delete", family: "MaterialIcons" }, 
            color: "#E53935" 
          }
        ]}
      />

      {ConfirmDeleteDialogComponent}
    </View>
  );
}