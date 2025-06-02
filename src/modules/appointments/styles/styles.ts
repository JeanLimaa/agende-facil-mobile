import { Colors } from "@/shared/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#EAEAEA",
    },
    header: {
      backgroundColor: Colors.light.mainColor,
    },
    toggleButton: {
      backgroundColor: Colors.light.mainColor,
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
      backgroundColor: Colors.light.mainColor,
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

export const appointmentFormStyle = StyleSheet.create({
  selectedServiceItem: {
      borderRadius: 8,
      borderBottomColor: "purple",
      borderBottomWidth: 2,
  },
  container: {
    flex: 1,
    backgroundColor: "#EAEAEA",
  },
  content: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
    width: '100%',
  },
  flex: {
    flex: 1,
  },
  input: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.light.textSecondary,
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginBottom: 8,
    borderBottomWidth: 0.5,
    borderColor: Colors.light.textSecondary,
    textAlign: "right",
    minWidth: 80,
  },

  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 8,
  },
  chip: {
    margin: 2,
  },
  chipSelected: {
    backgroundColor: Colors.light.mainColor,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  serviceInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 8,
  },
  saveButton: {
    marginTop: 16,
    backgroundColor: Colors.light.mainColor,
  },
  sectionContainer: {
    marginBottom: 6,
  },
  summarySection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "700",
    margin: 5,
    color: Colors.light.textSecondary
  },
  sectionSubLabel: {
    fontSize: 13,
    fontWeight: "500",
    margin: 5,
    color: Colors.light.textSecondary
  },
  smallLabel: {
    fontSize: 12,
    marginHorizontal: 5,
    marginBottom: 5,
    color: Colors.light.textSecondary
  },
  mediumLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginHorizontal: 5,
    marginBottom: 5,
    color: Colors.light.textSecondary
  }
});