import React from "react";
import { View, FlatList } from "react-native";
import { Text, Card } from "react-native-paper";
import { styles } from "../../styles/styles";
import { AppointmentStatus } from "@/shared/types/appointment.types";
import { getStatusBorderColor } from "../../helpers/appointments.helper";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
interface IAppointmentMapped {
  id: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  client: string;
  appointmentStatus: AppointmentStatus;
  price: string;
}

export function AppointmentList({
  groupedAppointments,
  dates,
  onCardPress,
  showAll,
  selectedDate,
}: {
  groupedAppointments: Record<string, IAppointmentMapped[]>;
  dates: string[];
  onCardPress: (item: IAppointmentMapped) => void;
  showAll: boolean;
  selectedDate: string;
}) {
  return (
    <View style={styles.cardContainer}>
      <FlatList
        data={dates}
        contentContainerStyle={{ paddingBottom: 150 }}
        keyExtractor={(date) => date}
        renderItem={({ item: date }) => (
          <View style={styles.dateSection}>
            <Text style={styles.dateText}>
              {format(parseISO(date), "EEEE, dd/MM/yyyy", {locale: ptBR})}
            </Text>
            {groupedAppointments[date].map((item) => (
              <Card
                key={item.id}
                style={[
                  styles.card,
                  { borderTopWidth: 4, borderTopColor: getStatusBorderColor(item.appointmentStatus) },
                ]}
                onPress={() => onCardPress(item)}
              >
                <Card.Content>
                  <View style={styles.cardRow}>
                    <Text style={styles.clientName}>{item.client}</Text>
                    <Text style={styles.appointmentStatus}>{item.appointmentStatus}</Text>
                  </View>
                  <View style={styles.cardRow}>
                    <Text>{`${item.timeStart} - ${item.timeEnd}`}</Text>
                    <Text style={styles.price}>{item.price}</Text>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {showAll
              ? "Nenhum agendamento encontrado."
              : selectedDate === new Date().toISOString().split("T")[0]
              ? "Nenhum agendamento encontrado para hoje."
              : `Nenhum agendamento encontrado para o dia ${new Date(selectedDate).toLocaleDateString("pt-BR")}.`}
          </Text>
        }
      />
    </View>
  );
}
