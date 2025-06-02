import React from "react";
import { Card, Text } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import { Colors } from "@/shared/constants/Colors";

export function ClientCard({ client, onPress }: { client: any; onPress: () => void }) {
  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <Text style={styles.name}>{client.name}</Text>
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
});
