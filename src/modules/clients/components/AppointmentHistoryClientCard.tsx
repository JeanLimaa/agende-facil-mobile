import React from "react";
import { Card, Text } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import { format } from "date-fns";
import { ClientAppointments } from "@/shared/types/client.interface";
import { Service } from "@/shared/types/service.interface";

export function AppointmentHistoryClientCard({ appointment }: { appointment: ClientAppointments }) {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <Text style={styles.date}>{format(appointment.date, "dd/MM/yyyy 'às' HH:mm")}</Text>
        </View>
        <Text style={styles.status}>Status: {translateStatus(appointment.status)}</Text>
        <Text style={styles.employee}>Atendido por: {appointment.employee?.name || "Não informado"}</Text>
        <Text style={styles.title}>Serviços:</Text>
        {appointment.services.map((service: Service) => (
          <Text key={service.id} style={styles.service}>
            - {service.name} ({service.duration}min): R$ {service.price}
          </Text>
        ))}
        <Text style={styles.total}>Total: R$ {appointment.totalPrice}</Text>
      </Card.Content>
    </Card>
  );
}

function getStatusIcon(status: string) {
  switch (status) {
    case "CANCELLED":
      return "cancel";
    case "CONFIRMED":
      return "check-circle";
    case "FINISHED":
      return "done-all";
    default:
      return "help";
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "CANCELLED":
      return "#e74c3c";
    case "CONFIRMED":
      return "#3498db";
    case "FINISHED":
      return "#2ecc71";
    default:
      return "#bdc3c7";
  }
}

function translateStatus(status: string) {
  switch (status) {
    case "CANCELLED":
      return "Cancelado";
    case "CONFIRMED":
      return "Confirmado";
    case "FINISHED":
      return "Finalizado";
    default:
      return status;
  }
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontWeight: "bold",
    fontSize: 16,
  },
  status: {
    marginVertical: 4,
    color: "#555",
  },
  employee: {
    fontStyle: "italic",
    marginBottom: 6,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  service: {
    marginLeft: 8,
    fontSize: 14,
    marginBottom: 2,
  },
  total: {
    marginTop: 6,
    fontWeight: "bold",
  },
});
