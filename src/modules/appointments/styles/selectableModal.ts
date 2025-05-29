import { StyleSheet } from "react-native";

export const selectableModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  container: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    maxHeight: "80%",
  },
});