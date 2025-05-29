import React from "react";
import { TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { styles } from "../../styles/styles";

export function CalendarToggle({
  isExpanded,
  onToggle,
}: {
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <TouchableOpacity onPress={onToggle} style={styles.toggleButton}>
      <Text style={styles.toggleButtonText}>
        {isExpanded ? "Ocultar Calendário" : "Mostrar Calendário"}
      </Text>
    </TouchableOpacity>
  );
}
