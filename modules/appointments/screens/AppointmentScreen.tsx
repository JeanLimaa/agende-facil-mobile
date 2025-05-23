import React, { useState } from "react";
import { View, FlatList,  TouchableOpacity } from "react-native";
import { FAB, Card, Text, Switch, Portal, Dialog, Button } from "react-native-paper";
import { Calendar } from "react-native-calendars";
import { Redirect, router } from "expo-router";
import { styles } from "../styles/styles";
import { ActionsModal } from "@/components/ActionsModal";
import api from "@/services/apiService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoadingModal } from "@/components/LoadingModal";
import { IAppointment } from "../types/appointment.types";
import { AppointmentStatus } from "../types/appointment.types";

async function fetchAppointments() {
  const response = await api.get("/appointment/company");
  return response.data.map((item: any) => {
    const dateObj = new Date(item.date);
    
    return {
      id: String(item.id),
      date: item.date.split("T")[0], // extrai apenas a data (YYYY-MM-DD)
      timeStart: dateObj.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' }),
      timeEnd: new Date(dateObj.getTime() + 30 * 60000).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' }),
      client: item.clientName ?? "Cliente não informado",
      appointmentStatus: item.status,
      price: `R$ ${item.totalPrice?.toFixed(2).replace('.', ',') ?? '0,00'}`,
    };
  });
}

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

export function AppointmentScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [isCancelDialogVisible, setIsCancelDialogVisible] = useState(false);

  const [selectedAppointment, setSelectedAppointment] = useState<IAppointment | null>(null);

  const [isActionModalVisible, setIsActionModalVisible] = useState(false);

  const { data, isLoading, error } = useQuery<IAppointment[]>({
    queryKey: ["appointments"],
    queryFn: fetchAppointments,
    refetchInterval: 1 * 60 * 1000,
  });
  const appointments = data || [];

  const queryClient = useQueryClient();

  const changeAppointmentStatus = useMutation({
    mutationFn: async ({ appointmentId, status }: 
      { 
        appointmentId: string; 
        status: "complete" | "cancel";
      }) => {
      return await api.patch(`/appointment/${status}/${appointmentId}`);
    },
  
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  
    onError: (error) => {
      console.error("Erro ao marcar agendamento como atendido:", error);
      alert("Erro ao marcar agendamento como atendido. Por favor, tente novamente.");
    },
  });

  if (isLoading) return <LoadingModal visible={isLoading} />;
  if (error) return <Text>Erro ao carregar os agendamentos.</Text>;
  

  function handleCancel() {
    setIsCancelDialogVisible(true);
    setIsActionModalVisible(false);
  }

  function handleConfirmCancel() {
    toggleAttended("cancel");
    setIsCancelDialogVisible(false);
    setSelectedAppointment(null);
  }

  function openActionsModal(appointment: IAppointment) {
    setSelectedAppointment(appointment);
    setIsActionModalVisible(true);
  }

  function closeActionsModal() {
    setIsActionModalVisible(false);
    setSelectedAppointment(null);
  }

  function handleEdit() {
    if (!selectedAppointment) {
      alert("Nenhum agendamento selecionado.");
      return;
    }
    
    router.push({
      pathname: "/(tabs)/appointment/[appointmentEditId]",
      params: { appointmentEditId: selectedAppointment.id },
    });
    
    closeActionsModal();
  }
  
  async function toggleAttended(status: "complete" | "cancel") {
    if (!selectedAppointment) {
      alert("Nenhum agendamento selecionado.");
      return;
    }
    
    await changeAppointmentStatus.mutateAsync({ appointmentId: selectedAppointment.id, status });

    closeActionsModal();
  }

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
  
  const actionOptions = [];

  if (selectedAppointment) {
    actionOptions.push({ label: "Editar", action: handleEdit, icon: { name: "edit" } });

    if (selectedAppointment.appointmentStatus.toLowerCase() !== AppointmentStatus.COMPLETED.toLowerCase()) {
      actionOptions.push({ label: "Marcar como Atendido", action: () => toggleAttended("complete"), icon: { name: "check-circle" } });
    }

    if (selectedAppointment.appointmentStatus.toLowerCase() === AppointmentStatus.PENDING.toLowerCase()) {
      actionOptions.push({ label: "Cancelar", action: handleCancel, icon: { name: "cancel" } });
    }
  }

  function getStatusBorderColor(status: AppointmentStatus): string {
    switch (status) {
      case AppointmentStatus.COMPLETED:
        return "#4CAF50";
      case AppointmentStatus.CANCELED:
        return "#F44336"; 
      default:
        return "#FF9800"; 
    }
  }

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
        contentContainerStyle={{ paddingBottom: 150 }}
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
              <Card
              key={item.id}
              style={[
                styles.card,
                { borderTopWidth: 4, borderTopColor: getStatusBorderColor(item.appointmentStatus) }
              ]}
              onPress={() => openActionsModal(item)}
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
      <FAB style={styles.fab} icon="plus" onPress={() => router.push("/(tabs)/appointment/new-appointment")} />

      <ActionsModal 
        visible={!!selectedAppointment && isActionModalVisible} 
        onClose={closeActionsModal} 
        title="Ações do Agendamento"
        options={actionOptions}
      />

      <Portal>
        <Dialog visible={isCancelDialogVisible} onDismiss={() => setIsCancelDialogVisible(false)}>
          <Dialog.Title>Cancelar Agendamento</Dialog.Title>
          <Dialog.Content>
            <Text>Tem certeza de que deseja cancelar este agendamento?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsCancelDialogVisible(false)}>Não</Button>
            <Button
              onPress={handleConfirmCancel}
            >
              Sim
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}