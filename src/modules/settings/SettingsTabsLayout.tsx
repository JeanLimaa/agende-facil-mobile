import React, { ReactNode, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { AppBarHeader } from "@/shared/components/AppBarHeader";
import { Ionicons } from "@expo/vector-icons";
import { FAB } from "react-native-paper";
import { Colors } from "@/shared/constants/Colors";
import Toast from "react-native-toast-message";
import api from "@/shared/services/apiService";
import { AxiosError } from "axios";
import { useApiErrorHandler } from "@/shared/hooks/useApiErrorHandler";
import { useQueryClient } from "@tanstack/react-query";
import { fabStyle } from "@/shared/styles/fab";
import { removeEmptyFields } from "@/shared/helpers/removeEmptyFields";
import { SettingsTabsProvider, useSettingsTabs } from "./contexts/SettingTabsContext";
import { router } from "expo-router";

type TabItem = {
  key: string;
  title: string;
  content: ReactNode;
  tanstackCacheKeys?: (string | [string, number])[];
};

type SettingsTabsLayoutProps = {
  tabs: TabItem[];
  headerTitle: string;
  endpoint: string;
  method: "POST" | "PUT";
};

function SettingsTabsLayout({ tabs, headerTitle, endpoint, method }: SettingsTabsLayoutProps) {
  const [activeTab, setActiveTab] = useState(tabs[0].key);
  const handleError = useApiErrorHandler();
  const queryClient = useQueryClient()
  const { tabsData } = useSettingsTabs();
  
  const handleSave = async () => {
    try {
      // Validar dados obrigatórios (exemplo para o primeiro tab)
      const firstTabData = tabsData[tabs[0].key];
      if (!firstTabData || Object.keys(removeEmptyFields(firstTabData)).length === 0) {
        Toast.show({
          type: "info",
          text1: "Atenção",
          text2: "Preencha os campos obrigatórios antes de salvar.",
          position: "bottom",
          visibilityTime: 3000,
        });
        return;
      }
      
      if (method === "POST") {
        await api.post(endpoint, tabsData);
      } else if (method === "PUT") {
        await api.put(endpoint, tabsData);
      }

      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: "Dados salvos com sucesso.",
        position: "bottom",
        visibilityTime: 3000,
      });

      // Invalida caches se necessário
      tabs.forEach((tab) => {
        tab.tanstackCacheKeys?.forEach((key) => {
          const queryKey = Array.isArray(key) ? key : [key];
          queryClient.invalidateQueries({ queryKey, refetchType: "all" });
        });
      });

      router.back();
    } catch (err: AxiosError | any) {
      handleError(err);
    }
  };

  return (
      <View style={styles.container}>
        <AppBarHeader message={headerTitle} />

        {tabs.length > 1 && (
          <View style={styles.tabBar}>
            {tabs.map(tab => (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tabItem, activeTab === tab.key && styles.activeTab]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
                  {tab.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <ScrollView style={styles.content}>
          {tabs.map(tab => (
            <View key={tab.key} style={{ display: activeTab === tab.key ? 'flex' : 'none' }}>
              {tab.content}
            </View>
          ))}
        </ScrollView>


        <FAB
          style={fabStyle.fab}
          icon={() => <Ionicons name="save" size={24} color="white" />}
          label="Salvar"
          onPress={handleSave}
        />
      </View>
  );
}

export function SettingsTabs(props: SettingsTabsLayoutProps) {
  return (
    <SettingsTabsProvider>
      <SettingsTabsLayout {...props} />
    </SettingsTabsProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tabItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.light.mainColor,
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: Colors.light.mainColor,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 16,
  },
});