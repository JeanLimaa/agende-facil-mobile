import { View, Text, Modal, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Button, TextInput, ActivityIndicator } from "react-native-paper";
import { appointmentFormStyle as styles } from "../styles/styles";
import { Client } from "../types/client.interface";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/apiService";

interface Props {
  selectedClient?: Client;
  setSelectedClient: (client: Client) => void;
  menuVisible: { employee: boolean; client: boolean; category: boolean };
  setMenuVisible: (visible: {
    employee: boolean;
    client: boolean;
    category: boolean;
  }) => void;
  inputWidth: number;
  setInputWidth: (width: number) => void;
}

async function fetchClients(): Promise<Client[]> {
  const response = await api.get("/clients");
  return response.data;
}

export function ClientSelector({
  selectedClient,
  setSelectedClient,
  menuVisible,
  setMenuVisible,
  inputWidth,
  setInputWidth,
}: Props) {
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const { data: clients = [], isLoading } = useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: fetchClients,
  });

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setModalVisible(false);
  };

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionLabel}>Cliente</Text>

      <Button
        onPress={() => setModalVisible(true)}
        mode="outlined"
        style={styles.input}
        onLayout={event => setInputWidth(event.nativeEvent.layout.width)}
      >
        {selectedClient?.name || "Selecione o cliente"}
      </Button>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={modalStyles.overlay}>
          <View style={modalStyles.container}>
            <TextInput
              placeholder="Buscar cliente..."
              value={search}
              onChangeText={setSearch}
              mode="outlined"
              style={{ marginBottom: 10 }}
              left={<TextInput.Icon icon="magnify" />}
            />

            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <FlatList
                data={filteredClients}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleClientSelect(item)}
                    style={modalStyles.item}
                  >
                    <Text>{item.name}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text style={{ textAlign: "center", padding: 10 }}>
                    Nenhum cliente encontrado
                  </Text>
                }
              />
            )}

            <Button onPress={() => setModalVisible(false)} style={{ marginTop: 10 }}>
              Cancelar
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  container: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    maxHeight: "80%",
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
