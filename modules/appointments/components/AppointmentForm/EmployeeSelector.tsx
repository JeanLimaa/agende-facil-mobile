import { View, Text } from "react-native";
import { appointmentFormStyle as styles } from "../../styles/styles";
import { Employee } from "../../types/employee.interface";
import { Button } from "react-native-paper";
import { SelectableListModal } from "@/shared/components/SelectableListModal";

interface Props {
  employees: Employee[];
  selectedEmployee?: number;
  setSelectedEmployee: (id: number) => void;
  menuVisible: { employee: boolean, client: boolean, category: boolean };
  setMenuVisible: (visible: { employee: boolean, client: boolean, category: boolean }) => void;
  inputWidth: number;
}

export function EmployeeSelector({
  employees,
  selectedEmployee,
  setSelectedEmployee,
  menuVisible,
  setMenuVisible,
  inputWidth,
}: Props) {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionLabel}>Funcionário</Text>

      <Button
        onPress={() => setMenuVisible({ ...menuVisible, employee: true })}
        mode="outlined"
        style={styles.input}
      >
        {selectedEmployee ? employees.find(employee => employee.id === selectedEmployee)?.name : "Selecione o funcionário"}
      </Button>

      <SelectableListModal
        data={employees}
        isLoading={false}
        modalVisible={menuVisible.employee}
        setModalVisible={visible => setMenuVisible({ ...menuVisible, employee: visible })}
        handleSelect={employee => {
          setSelectedEmployee(employee.id);
          setMenuVisible({ ...menuVisible, employee: false });
        }}
        emptyMessage="Nenhum funcionário encontrado"
      />
    </View>
)}