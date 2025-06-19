import React from "react";
import { View, Text } from "react-native";
import { AppBarHeader } from "@/shared/components/AppBarHeader";

export default function CompanyProfileScreen() {
  return (
    <View style={{ flex: 1 }}>
      <AppBarHeader message="Company Profile" />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Configure your company profile</Text>
      </View>
    </View>
  );
}
