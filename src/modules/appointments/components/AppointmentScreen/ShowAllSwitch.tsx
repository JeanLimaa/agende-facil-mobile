import React from "react";
import { View } from "react-native";
import { Text, Switch } from "react-native-paper";
import { styles } from "../../styles/styles";

export function ShowAllSwitch({
  showAll,
  onToggle,
}: {
  showAll: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={styles.switchContainer}>
      <Text>Mostrar Todos</Text>
      <Switch value={showAll} onValueChange={onToggle} />
    </View>
  );
}
