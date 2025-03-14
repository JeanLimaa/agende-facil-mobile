import React, { useState } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Appbar, FAB, Card, Text, Switch } from "react-native-paper";
import { Calendar } from "react-native-calendars";
import { router } from "expo-router";
import { styles } from "../styles/styles";

interface IAppointment {
  id: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  client: string;
  appointmentStatus: string;
  price: string;
}

const appointments: IAppointment[] = [
  { id: "1", date: "2025-01-01", timeStart: "15:00", timeEnd: "15:30", client: "Cliente 1", appointmentStatus: "Pago", price: "R$ 100,00" },
  { id: "2", date: "2025-01-01", timeStart: "16:00", timeEnd: "16:30", client: "Cliente 2", appointmentStatus: "Pendente", price: "R$ 150,00" },
  { id: "3", date: "2025-01-02", timeStart: "14:00", timeEnd: "14:30", client: "Cliente 3", appointmentStatus: "Pago", price: "R$ 200,00" },
  { id: "4", date: "2025-02-03", timeStart: "14:00", timeEnd: "14:30", client: "Cliente 3", appointmentStatus: "Pago", price: "R$ 200,00" },
];

// Função para agrupar os agendamentos por data E ordenamente do mais recente para o mais antigo
const groupByDate = (appointments: IAppointment[]): { [key: string]: IAppointment[] } => {
  const grouped = appointments.reduce((acc, appointment) => {
    const date = appointment.date; // "YYYY-MM-DD"
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(appointment);
    return acc;
  }, {} as Record<string, IAppointment[]>);

  // Ordena as chaves por data
  const sortedEntries = Object.entries(grouped).sort(([dateA], [dateB]) => 
    new Date(dateB).getTime() - new Date(dateA).getTime()
  );
  
  // Reconstrói o objeto ordenado
  return Object.fromEntries(sortedEntries);
};

export function ScheduleScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(true);
  const [showAll, setShowAll] = useState(false);

  function handleShowAll() {
    setShowAll(!showAll);
    setIsCalendarExpanded(false);
  }

  function handleDayPressed(day: { dateString: React.SetStateAction<string>; }) {
    setSelectedDate(day.dateString);
    setShowAll(false);
  }

  // Filtra os agendamentos conforme a opção escolhida
  const filteredAppointments = showAll ? appointments : appointments.filter(item => item.date === selectedDate);
  const groupedAppointments = groupByDate(filteredAppointments);
  const dates = Object.keys(groupedAppointments);
  
  return (
    <View style={styles.container}>
      {/* Botão de Mostrar/Ocultar Calendário */}
      <TouchableOpacity onPress={() => setIsCalendarExpanded(!isCalendarExpanded)} style={styles.toggleButton}>
        <Text style={styles.toggleButtonText}>{isCalendarExpanded ? "Ocultar Calendário" : "Mostrar Calendário"}</Text>
      </TouchableOpacity>

      {/* Calendário */}
      {isCalendarExpanded && (
        <Calendar
          onDayPress={handleDayPressed}
          markedDates={{ [selectedDate]: { selected: true, selectedColor: "#FF6600" } }}
          style={styles.calendar}
          theme={{ selectedDayBackgroundColor: "#FF6600", todayTextColor: "#FF6600" }}
        />
      )}

      {/* Alternar entre Filtrar ou Mostrar Todos */}
      <View style={styles.switchContainer}>
        <Text>Mostrar Todos</Text>
        <Switch value={showAll} onValueChange={handleShowAll} />
      </View>

      {/* Lista de Agendamentos */}
      <View style={styles.cardContainer}>
      <FlatList
        data={dates}
        keyExtractor={(date) => date}
        renderItem={({ item: date }) => (
          <View style={styles.dateSection}>
            <Text style={styles.dateText}>
                {new Date(date).toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                })}
            </Text>

            {groupedAppointments[date].map((item: any) => (
              <Card key={item.id} style={styles.card}>
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
        ListEmptyComponent={(
          <Text style={styles.emptyText}>
            {
              showAll
              ? "Nenhum agendamento encontrado."
              : selectedDate === new Date().toISOString().split("T")[0]
              ? "Nenhum agendamento encontrado para hoje."
              : `Nenhum agendamento encontrado para o dia ${new Date(selectedDate).toLocaleDateString("pt-BR")}.`
            }
          </Text>
        )}
      />
      </View>

      {/* Botão Flutuante de Adicionar */}
      <FAB style={styles.fab} icon="plus" onPress={() => router.push("/(tabs)/schedule/new-schedule")} />
    </View>
  );
}