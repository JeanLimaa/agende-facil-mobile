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

type TabItem = {
  key: string;
  title: string;
  content: ReactNode;
  ref: React.RefObject<any>;
  endpoint: string;
  method: "POST" | "PUT";
  tanstackCacheKeys?: string[];
};

type SettingsTabsLayoutProps = {
  tabs: TabItem[];
  headerTitle: string;
};

export function SettingsTabsLayout({ tabs, headerTitle }: SettingsTabsLayoutProps) {
  const [activeTab, setActiveTab] = useState(tabs[0].key);
  const handleError = useApiErrorHandler();
  const queryClient = useQueryClient()

  const handleSave = async () => {
    try {
      for (const tab of tabs) {
        const data = tab.ref?.current?.getData?.();
        const noData = !data || Object.keys(data).length <= 0;
        
        if(tab.key === tabs[0].key && noData) {
          Toast.show({
            type: "info",
            text1: "Atenção",
            text2: "Preencha os campos obrigatórios antes de salvar.",
            position: "bottom",
            visibilityTime: 3000,
          });
          return;
        }

        if(noData) return;

        if (data) {
          if (tab.method === "POST") {
            await api.post(tab.endpoint, data);
          }
          if (tab.method === "PUT") {
            await api.put(tab.endpoint, data);
          }
          
          Toast.show({
            type: "success",
            text1: "Sucesso",
            text2: `Dados de ${tab.title} salvo com sucesso.`,
            position: "bottom",
            visibilityTime: 3000,
          });
        }

        if (tab.tanstackCacheKeys && tab.tanstackCacheKeys?.length > 0) {
          for(const key of tab.tanstackCacheKeys) {
            queryClient.invalidateQueries({ queryKey: [key], refetchType: "all" });
          }
        }
      }
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
        style={styles.fab}
        icon={() => <Ionicons name="save" size={24} color="white" />}
        label="Salvar"
        onPress={handleSave}
      />
    </View>
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
  fab: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: Colors.light.mainColor,
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