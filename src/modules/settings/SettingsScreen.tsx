import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SettingsSection } from "./components/SettingsSection";
import { router } from "expo-router";

export function SettingsScreen() {
  return (
    <ScrollView style={styles.container}>
      <SettingsSection
        title="Agendamentos e Site"
        items={[
          {
            label: "Horário de atendimento",
            icon: "clock-outline",
            onPress: () => router.push("/(tabs)/settings/booking-and-website/working-hours"),
          },
          {
            label: "Perfil da Empresa",
            icon: "account-circle-outline",
            onPress: () => router.push("/(tabs)/settings/booking-and-website/company-profile"),
          },
        ]}
      />

      <SettingsSection
        title="Cadastros"
        items={[
          {
            label: "Profissionais",
            icon: "account-multiple-outline",
            onPress: () => router.push("/(tabs)/settings/records/professionals"),
          },
          {
            label: "Categorias",
            icon: "shape-outline",
            onPress: () => router.push("/(tabs)/settings/records/categories"),
          },
          {
            label: "Serviços",
            icon: "hammer-wrench",
            onPress: () => router.push("/(tabs)/settings/records/services"),
          },
        ]}
      />

      <SettingsSection
        title="Segurança"
        items={[
          {
            label: "Alterar Senha",
            icon: "lock-reset",
            onPress: () => router.push("/(tabs)/settings/security/change-password"),
          },
          {
            label: "Desativar Conta",
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
