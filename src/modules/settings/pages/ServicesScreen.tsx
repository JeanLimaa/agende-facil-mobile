import React from "react";
import { View, Text } from "react-native";
import { AppBarHeader } from "@/shared/components/AppBarHeader";

export default function ServicesScreen() {
  return (
    <View style={{ flex: 1 }}>
      <AppBarHeader message="Services" />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Manage services</Text>
      </View>
    </View>
  );
}