import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#EAEAEA",
    },
    header: {
      backgroundColor: "#FF6600",
    },
    toggleButton: {
      backgroundColor: "#FF6600",
      padding: 10,
      alignItems: "center",
    },
    toggleButtonText: {
      color: "#FFF",
      fontWeight: "bold",
    },
    calendar: {
      marginBottom: 10,
    },
    switchContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 10,
      backgroundColor: "#FFF",
      marginBottom: 10,
    },
    clientName: {
      fontWeight: "bold",
    },
    appointmentStatus: {
      color: "gray",
      fontSize: 12,
    },
    price: {
      fontWeight: "bold",
      marginTop: 5,
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
      backgroundColor: "#FF6600",
    },
    cardContainer: {
        margin: 10,
        gap: 5,
    },
    card: {
        padding: 10,
        backgroundColor: "#FFF",
    },
    cardRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    dateSection: {
        marginBottom: 15,
        gap: 10
    },
    dateText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        textAlign: "left",
        marginBottom: 5,
    },
  });