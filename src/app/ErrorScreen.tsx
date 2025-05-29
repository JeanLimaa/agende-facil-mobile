import React from "react";
import { View, Text, StyleSheet, Button, Image } from "react-native";

type ErrorScreenProps = {
  message?: string;
  onRetry?: () => void;
};

export default function ErrorScreen({ message, onRetry }: ErrorScreenProps) {
  return (
    <View style={styles.container}>        
      <Text style={styles.title}>Algo deu errado</Text>
      <Text style={styles.message}>
        {message || "Não foi possível carregar as informações. Tente novamente."}
      </Text>
      {onRetry && (
        <Button title="Tentar novamente" onPress={onRetry} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
});
