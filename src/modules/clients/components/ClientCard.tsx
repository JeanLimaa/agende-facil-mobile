import React from "react";
import { Card, Text } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import { Colors } from "@/shared/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { Client } from "@/shared/types/client.interface";

export function ClientCard({ client, onPress }: { client: Client; onPress: () => void }) {
  const isBlocked = client?.isBlocked;

  return (
    <Card style={[styles.card, isBlocked && styles.blockedCard]} onPress={onPress}>
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{client.name}</Text>
          {isBlocked && (
            <View style={styles.blockedTag}>
              <MaterialIcons name="block" size={16} color="#D32F2F" />
              <Text style={styles.blockedText}>Bloqueado</Text>
            </View>
          )}
        </View>
        <Text style={styles.phone}>{client.phone}</Text>
      </Card.Content>
    </Card>
  );
}


const styles = StyleSheet.create({
  card: {
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: "#fff",
  },
  blockedCard: {
    borderColor: "#D32F2F",
    borderWidth: 1.5,
  },
  content: {
    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  blockedTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FDECEA",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  blockedText: {
    color: "#D32F2F",
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "bold",
  },
});