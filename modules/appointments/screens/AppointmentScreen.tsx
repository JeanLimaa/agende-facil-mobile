import React from "react";
import { View } from "react-native";
import { FAB, Text } from "react-native-paper";
import { CalendarToggle } from "../components/AppointmentScreen/CalendarToggle";
import { CalendarSection } from "../components/AppointmentScreen/CalendarSection";
import { ShowAllSwitch } from "../components/AppointmentScreen/ShowAllSwitch";
import { AppointmentList } from "../components/AppointmentScreen/AppointmentList";
import { ActionsModal } from "@/components/ActionsModal";
import { CancelDialog } from "../components/AppointmentScreen/CancelDialog";
import { LoadingModal } from "@/components/LoadingModal";
import { styles } from "../styles/styles";
import { useAppointmentScreenLogic } from "../hooks/useAppointmentScreenLogic";
import { router } from "expo-router";

export function AppointmentScreen() {
  const logic = useAppointmentScreenLogic();

  if (logic.isLoading) return <LoadingModal visible={logic.isLoading} />;
  if (logic.error) return <Text>Erro ao carregar os agendamentos.</Text>;

  return (
    <View style={styles.container}>
      <CalendarToggle
        isExpanded={logic.isCalendarExpanded}
        onToggle={() => logic.setIsCalendarExpanded((v) => !v)}
      />
      <CalendarSection
        isExpanded={logic.isCalendarExpanded}
        selectedDate={logic.selectedDate}
        onDayPress={logic.handleDayPressed}
      />
      <ShowAllSwitch showAll={logic.showAll} onToggle={logic.handleShowAll} />
      <AppointmentList
        groupedAppointments={logic.groupedAppointments}
        dates={logic.dates}
        onCardPress={logic.openActionsModal}
        showAll={logic.showAll}
        selectedDate={logic.selectedDate}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => router.push("/(tabs)/appointment/new-appointment")}
      />
      <ActionsModal
        visible={!!logic.selectedAppointment && logic.isActionModalVisible}
        onClose={logic.closeActionsModal}
        title="Ações do Agendamento"
        options={logic.actionOptions}
      />
      <CancelDialog
        visible={logic.isCancelDialogVisible}
        onDismiss={() => logic.setIsCancelDialogVisible(false)}
        onConfirm={logic.handleConfirmCancel}
      />
    </View>
  );
}