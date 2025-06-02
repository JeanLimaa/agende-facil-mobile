import React from "react";
import { View } from "react-native";
import { Checkbox, Text } from "react-native-paper";
import { styles } from "../styles/styles";
import { Colors } from "@/shared/constants/Colors";

interface Props {
  id: string;
  name: string;
  phone: string;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

export const ContactItem = React.memo(({ id, name, phone, isSelected, onToggle }: Props) => {
  return (
    <View style={styles.contactItem}>
      <Checkbox
        status={isSelected ? "checked" : "unchecked"}
        onPress={() => onToggle(id)}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "bold", color: Colors.light.text }}>{name}</Text>
        <Text style={{ color: Colors.light.textSecondary }}>{phone}</Text>
      </View>
    </View>
  );
});