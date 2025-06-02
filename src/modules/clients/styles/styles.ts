import { StyleSheet } from "react-native";
import { Colors } from "@/shared/constants/Colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAEAEA",
  },
  searchbar: {
    margin: 10,
  },
  card: {
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: "#fff",
  },
  clientName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  clientPhone: {
    fontSize: 14,
    color: "gray",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: Colors.light.mainColor,
  },
  formContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 16,
    elevation: 2,
    justifyContent: "flex-start",
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: Colors.light.text,
    textAlign: "center",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#FFF",
  },
  saveButton: {
    marginTop: 16,
    backgroundColor: Colors.light.mainColor,
  },
  loadButton: {
    marginBottom: 16,
    backgroundColor: Colors.light.mainColor,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    gap: 8,
  },
});
