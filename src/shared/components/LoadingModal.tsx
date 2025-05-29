import React from "react";
import { Modal, View, ActivityIndicator, StyleSheet } from "react-native";

export function LoadingModal({ visible }: { visible: boolean }) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
    >
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#FF6600" />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
});
