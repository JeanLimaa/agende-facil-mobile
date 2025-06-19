import React from "react";
import { View, Text } from "react-native";
import { AppBarHeader } from "@/shared/components/AppBarHeader";

export default function WorkingHoursScreen() {
  return (
    <View style={{ flex: 1 }}>
      <AppBarHeader message="Service and Working Hours" />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Configure your service and working hours</Text>
      </View>
    </View>
  );
}