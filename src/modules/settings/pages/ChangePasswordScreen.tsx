import React from "react";
import { View, Text } from "react-native";
import { AppBarHeader } from "@/shared/components/AppBarHeader";

export default function ChangePasswordScreen() {
  return (
    <View style={{ flex: 1 }}>
      <AppBarHeader message="Change Password" />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Change your password</Text>
      </View>
    </View>
  );
}
