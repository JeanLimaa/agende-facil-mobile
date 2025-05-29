import { View, Modal } from "react-native";
import { Button } from "react-native-paper";
import { SelectableList } from "@/shared/components/SelectableList";
import { selectableModalStyles } from "@/modules/appointments/styles/selectableModal";

interface SelectableListModalProps<T extends { id: string | number; name: string }> {
  data: T[];
  isLoading: boolean;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  handleSelect: (item: T) => void;
  emptyMessage?: string;
}

export function SelectableListModal<T extends { id: string | number; name: string }>({
  data,
  isLoading,
  modalVisible,
  setModalVisible,
  handleSelect,
  emptyMessage = "Nenhum item encontrado",
}: SelectableListModalProps<T>) {
  return (
    <Modal visible={modalVisible} transparent animationType="fade">
      <View style={selectableModalStyles.overlay}>
        <View style={selectableModalStyles.container}>
          <SelectableList
            data={data}
            isLoading={isLoading}
            onSelect={(item) => {
              handleSelect(item);
              setModalVisible(false);
            }}
            emptyMessage={emptyMessage}
            searchable
          />

          <Button onPress={() => setModalVisible(false)} style={{ marginTop: 10 }}>
            Cancelar
          </Button>
        </View>
      </View>
    </Modal>
  );
}