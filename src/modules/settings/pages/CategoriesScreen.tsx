import React from "react";
import { View, Text } from "react-native";
import { AppBarHeader } from "@/shared/components/AppBarHeader";

export default function CategoriesScreen() {
  return (
    <View style={{ flex: 1 }}>
      <AppBarHeader message="Categories" />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Manage categories</Text>
      </View>
    </View>
  );
}