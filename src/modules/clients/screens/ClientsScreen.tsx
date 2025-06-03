import React, { useState } from "react";
import { View, FlatList, Text, Linking, Alert } from "react-native";
import { FAB, Searchbar } from "react-native-paper";
import { styles } from "../styles/styles";
import { useClients } from "@/shared/hooks/queries/useClients";
import { router } from "expo-router";
import api from "@/shared/services/apiService";
import Toast from "react-native-toast-message";
import { ClientCard } from "../components/ClientCard";
import { ClientActionsModal } from "../components/ClientActionsModal";
import { ActionsModal } from "@/shared/components/ActionsModal";
import { Client } from "@/shared/types/client.interface";
import { Loading } from "@/shared/components/Loading";
import ErrorScreen from "@/app/ErrorScreen";
import { useConfirm } from "@/shared/hooks/useConfirm";
import { EmptyText } from "@/shared/components/EmptyText";

export function ClientsScreen() {
  const {confirm, ConfirmDialogComponent} = useConfirm();
  const { data: clients = [], isLoading, error, refetch } = useClients();
  const [searchQuery, setSearchQuery] = useState("");
  const [fabModalVisible, setFabModalVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [actionModalVisible, setActionModalVisible] = useState(false);

  if(isLoading) return <Loading />;
  if (error) return <ErrorScreen onRetry={refetch} />


  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFabOption = (option: "new" | "import") => {
    setFabModalVisible(false);
    
    switch (option) {
      case "new":
        router.push("/(tabs)/clients/new");
        break;
      case "import":
        router.push("/(tabs)/clients/import");
        break;
      default:
        return;
    }
  };

  // Ações do modal
  const handleEdit = () => {
    setActionModalVisible(false);
    router.push({ pathname: "/(tabs)/clients/edit", params: { id: selectedClient?.id } });
  };

  const handleBlock = async () => {
    setActionModalVisible(false);

    if (!selectedClient) {
      Toast.show({ type: "error", text1: "Erro", text2: "Nenhum cliente selecionado." });
      return;
    }
    const action = selectedClient.isBlocked ? "Desbloquear" : "Bloquear";
    const confirmed = await confirm({
      title: `${action} Cliente`,
      message: `Você tem certeza que deseja ${action.toLowerCase()} os agendamentos para o cliente ${selectedClient.name}?`,
      confirmText: action,
      cancelText: "Cancelar"
    });

    if (!confirmed) return;

    try {
      await api.patch(`/clients/${selectedClient.id}/block`);

      await refetch();
      setSelectedClient(prev => prev ? { ...prev, isBlocked: !prev.isBlocked } : prev);

      Toast.show({ 
        type: "success", 
        text1: selectedClient.isBlocked ? "Cliente desbloqueado com sucesso." : "Cliente bloqueado com sucesso.",
        position: "bottom"
      });
    } catch (error) {
      Toast.show({ type: "error", text1: "Erro ao bloquear cliente.", position: "bottom" });
    }
  };

  const handleCall = () => {
    setActionModalVisible(false);

    if (!selectedClient) {
      Toast.show({ type: "error", text1: "Erro", text2: "Nenhum cliente selecionado." });
      return;
    }

    Linking.openURL(`tel:${selectedClient.phone}`);
  };

  const handleWhatsApp = () => {
    setActionModalVisible(false);

    if (!selectedClient) {
      Toast.show({ type: "error", text1: "Erro", text2: "Nenhum cliente selecionado." });
      return;
    }

    
    if (!selectedClient.phone) {
      Toast.show({ type: "error", text1: "Erro", text2: "Telefone do cliente não disponível." });
      return;
    }
    const phone = selectedClient.phone.replace(/\D/g, "");
    Linking.openURL(`https://wa.me/${phone}`);
  };

/*   const handleDelete = async () => {
    setActionModalVisible(false);

    if (!selectedClient) return;

    Alert.alert(
      "Deletar cliente",
      "Tem certeza que deseja deletar este cliente?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/clients/${selectedClient.id}`);
              Toast.show({ type: "success", text1: "Cliente deletado" });
              refetch();
            } catch {
              Toast.show({ type: "error", text1: "Erro ao deletar cliente" });
            }
          }
        }
      ]
    );
  }; */

  const onClientCardPress = (client: Client) => {
    setSelectedClient(client);
    //if (!selectedClient) return;
    setActionModalVisible(true);
  }

  const handleHistory = () => {
    setActionModalVisible(false);
    
    if (!selectedClient) {
      Toast.show({ type: "error", text1: "Erro", text2: "Nenhum cliente selecionado." });
      return;
    }

    router.push({
      pathname: "/(tabs)/clients/appointments-history",
      params: { id: selectedClient.id }
    });
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar cliente"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchbar}
      />
      
      <FlatList
        data={filteredClients}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ClientCard
            client={item}
            onPress={() => onClientCardPress(item)}
          />
        )}
        ListEmptyComponent={<EmptyText>Nenhum cliente encontrado.</EmptyText>}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setFabModalVisible(true)}
      />

      <ActionsModal
        visible={fabModalVisible}
        onClose={() => setFabModalVisible(false)}
        title="O que deseja fazer?"
        options={[
          { label: "Novo Cliente", action: () => handleFabOption("new"), icon: { name: "add", family: "MaterialIcons" } },
          { label: "Importar Contatos", action: () => handleFabOption("import"), icon: { name: "import-contacts", family: "MaterialIcons" } },
        ]}
      />

      <ClientActionsModal
        visible={actionModalVisible}
        onClose={() => setActionModalVisible(false)}
        clientName={selectedClient?.name || "Ações"}
        onEdit={handleEdit}
        onBlock={handleBlock}
        isBlocked={selectedClient?.isBlocked || false}
        onCall={handleCall}
        onWhatsApp={handleWhatsApp}
        onHistory={handleHistory}
      />

      {ConfirmDialogComponent}
    </View>
  );
}
