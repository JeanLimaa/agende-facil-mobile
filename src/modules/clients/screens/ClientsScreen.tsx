import React, { useState } from "react";
import { View, FlatList } from "react-native";
import { FAB, Searchbar } from "react-native-paper";
import { styles } from "../styles/styles";
import { useClients } from "@/shared/hooks/queries/useClients";
import { router } from "expo-router";
import { ClientCard } from "../components/ClientCard";
import { ClientActionsModal } from "../components/ClientActionsModal";
import { ActionsModal } from "@/shared/components/ActionsModal";
import { Loading } from "@/shared/components/Loading";
import ErrorScreen from "@/app/ErrorScreen";
import { EmptyText } from "@/shared/components/EmptyText";
import { useClientActions } from "../hooks/useClientActions";
import { fabStyle } from "@/shared/styles/fab";

export function ClientsScreen() {
  const { data: clients = [], isLoading, error, refetch } = useClients();
  const {
    ConfirmDialogComponent,
    setActionModalVisible,
    actionModalVisible,
    selectedClient,
    handleBlock,
    handleCall,
    handleWhatsApp,
    handleEdit,
    handleHistory,
    openActions
  } = useClientActions(refetch);
  const [searchQuery, setSearchQuery] = useState("");
  const [fabModalVisible, setFabModalVisible] = useState(false);

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
            onPress={() => openActions(item)}
          />
        )}
        ListEmptyComponent={<EmptyText>Nenhum cliente encontrado.</EmptyText>}
      />

      <FAB
        style={fabStyle.fab}
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
