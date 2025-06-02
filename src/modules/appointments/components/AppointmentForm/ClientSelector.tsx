import { View, Text, Modal, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Button, TextInput, ActivityIndicator } from "react-native-paper";
import { appointmentFormStyle as styles } from "../../styles/styles";
import { Client } from "@/shared/types/client.interface";
import { useState } from "react";
import { useClients } from "@/shared/hooks/queries/useClients";
import { SelectableList } from "@/shared/components/SelectableList";
import { SelectableListModal } from "@/shared/components/SelectableListModal";

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

export function ClientSelector({
  selectedClient,
  setSelectedClient,
  setInputWidth,
}: Props) {
  const { data: clients = [], isLoading } = useClients();

  const [modalVisible, setModalVisible] = useState(false);


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

      <SelectableListModal
        data={clients}
        isLoading={isLoading}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        handleSelect={handleClientSelect}
        emptyMessage="Nenhum cliente encontrado"
      />
    </View>
  );
}

