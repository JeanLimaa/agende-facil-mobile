import React from "react";
import { View, Text, FlatList } from "react-native";
import { AppBarHeader } from "@/shared/components/AppBarHeader";
import { Loading } from "@/shared/components/Loading";
import ErrorScreen from "@/app/ErrorScreen";
import { ActionsModal } from "@/shared/components/ActionsModal";
import { FAB } from "react-native-paper";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { fabStyle } from "@/shared/styles/fab";
import { GenericalCard } from "@/shared/components/GenericalCard";
import { useCategoriesAndServices } from "@/shared/hooks/queries/useCategoriesAndServices";
import { useConfirm } from "@/shared/hooks/useConfirm";
import api from "@/shared/services/apiService";
import { useApiErrorHandler } from "@/shared/hooks/useApiErrorHandler";

export default function ServicesScreen() {
  const navigation = useNavigation<any>();
  const { data, refetch, isLoading, error } = useCategoriesAndServices(true, false);

  const services = data?.services || [];

  const [actionsModalVisible, setActionsModalVisible] = React.useState(false);
  const [selectedService, setSelectedService] = React.useState<number | null>(null);

  const { confirm: confirmDelete, ConfirmDialogComponent } = useConfirm();

  const handleApiError = useApiErrorHandler();

  if (isLoading) return <Loading />;
  if (error) return <ErrorScreen message="Erro ao carregar serviços" onRetry={refetch} />;

  const openActions = (serviceId: number) => {
    setSelectedService(serviceId);
    setActionsModalVisible(true);
  }

  const cleanActions = () => {
    setSelectedService(null);
    setActionsModalVisible(false);
  }

  function handleAddService() {
    cleanActions();

    navigation.navigate("settings/records/services/service-form", { serviceId: null });
  }

  function handleEditService(serviceId: number | null) {
    if (!serviceId) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Nenhum serviço selecionado.'
      });
      return;
    }

    cleanActions();

    navigation.navigate("settings/records/services/service-form", { serviceId });
  }

  async function handleDeleteService(serviceId: number | null) {
    if (!serviceId) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Nenhum serviço selecionado.'
      });
      return;
    }

    cleanActions();

    const confirmed = await confirmDelete({
      title: "Excluir Serviço",
      message: "Você tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita.",
      confirmText: "Excluir",
      cancelText: "Cancelar",
    });

    if (!confirmed) return;

    try {
      await api.delete(`/services/${serviceId}`);
      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'Serviço excluído com sucesso.'
      });
      refetch();
    } catch (error) {
      handleApiError(error);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <AppBarHeader message="Serviços" />

      <FlatList
        data={services}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <GenericalCard
            onPress={() => openActions(item.id)}
            showAvatar={true}
            name={item.name}
          >
            <View>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
            </View>
          </GenericalCard>
        )}
        ListEmptyComponent={
          <View style={{ padding: 16, alignItems: 'center' }}>
            <Text style={{ color: '#999' }}>Nenhum serviço encontrado</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 16 }}
      />

      <FAB
        icon="plus"
        style={fabStyle.fab}
        onPress={handleAddService}
      />

      <ActionsModal
        visible={actionsModalVisible}
        onClose={() => setActionsModalVisible(false)}
        title="Ações"
        options={[
          {
            label: "Editar",
            action: () => handleEditService(selectedService),
            icon: { name: "edit", family: "MaterialIcons" },
            color: "#1E88E5"
          },
          {
            label: "Excluir",
            action: () => handleDeleteService(selectedService),
            icon: { name: "delete", family: "MaterialIcons" },
            color: "#E53935"
          }
        ]}
      />

      {ConfirmDialogComponent}
    </View>
  );
}