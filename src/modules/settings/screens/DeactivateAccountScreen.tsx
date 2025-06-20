import React from "react";
import { View, Text } from "react-native";
import { AppBarHeader } from "@/shared/components/AppBarHeader";

export default function DeactivateAccountScreen() {
  return (
    <View style={{ flex: 1 }}>
      <AppBarHeader message="Desativar Conta" />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Deactivate your account</Text>
      </View>
    </View>
  );
}