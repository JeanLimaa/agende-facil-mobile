import React from "react";
import { View, Text } from "react-native";
import { AppBarHeader } from "@/shared/components/AppBarHeader";

export default function ProfessionalsScreen() {
  return (
    <View style={{ flex: 1 }}>
      <AppBarHeader message="Professionals" />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Manage professionals</Text>
      </View>
    </View>
  );
}