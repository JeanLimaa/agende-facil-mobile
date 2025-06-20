import React from "react";
import { View, Text } from "react-native";
import { AppBarHeader } from "@/shared/components/AppBarHeader";

export default function AddressScreen() {
  return (
    <View style={{ flex: 1 }}>
      <AppBarHeader message="Endereço" />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Configure your company address</Text>
      </View>
    </View>
  );
}
