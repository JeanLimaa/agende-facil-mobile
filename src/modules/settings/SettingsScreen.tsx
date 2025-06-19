import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SettingsSection } from "./components/SettingsSection";
import { router } from "expo-router";

export function SettingsScreen() {
  return (
    <ScrollView style={styles.container}>
      <SettingsSection
        title="Client Booking & Website"
        items={[
          {
            label: "Service and Working Hours",
            icon: "clock-outline",
            onPress: () => router.push("/(tabs)/settings/booking-and-website/working-hours"),
          },
          {
            label: "Company Profile",
            icon: "account-circle-outline",
            onPress: () => router.push("/(tabs)/settings/booking-and-website/company-profile"),
          },
          {
            label: "Address",
            icon: "map-marker-outline",
            onPress: () => router.push("/(tabs)/settings/booking-and-website/address"),
          },
        ]}
      />
      <SettingsSection
        title="Records"
        items={[
          {
            label: "Professionals",
            icon: "account-multiple-outline",
            onPress: () => router.push("/(tabs)/settings/records/professionals"),
          },
          {
            label: "Categories",
            icon: "shape-outline",
            onPress: () => router.push("/(tabs)/settings/records/categories"),
          },
          {
            label: "Services",
            icon: "hammer-wrench",
            onPress: () => router.push("/(tabs)/settings/records/services"),
          },
        ]}
      />
      <SettingsSection
        title="Security"
        items={[
          {
            label: "Change Password",
            icon: "lock-reset",
            onPress: () => router.push("/(tabs)/settings/security/change-password"),
          },
          {
            label: "Deactivate Account",
            icon: "account-off-outline",
            onPress: () => router.push("/(tabs)/settings/security/deactivate-account"),
          },
        ]}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingTop: 8,
  },
});
