import { View, Text } from "react-native";
import { appointmentFormStyle as styles } from "../styles/styles";
import { Employee } from "../types/employee.interface";
import { Button, Menu } from "react-native-paper";

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

      <Menu
        style={{ width: inputWidth }}
        visible={menuVisible.employee}
        onDismiss={() => setMenuVisible({ ...menuVisible, employee: false })}
        anchor={
          <Button
            onPress={() => setMenuVisible({ ...menuVisible, employee: true })}
            mode="outlined"
            style={styles.input}
          >
            {selectedEmployee
              ? employees.find(e => e.id === selectedEmployee)?.name
              : "Selecione o funcionário"}
          </Button>
        }>
        {employees.map(employee => (
          <Menu.Item
            key={employee.id}
            title={employee.name}
            onPress={() => {
              setSelectedEmployee(employee.id);
              setMenuVisible({ ...menuVisible, employee: false });
            }}
          />
        ))}
      </Menu>
    </View>
)}