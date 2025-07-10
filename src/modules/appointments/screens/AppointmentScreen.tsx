import React, { useState } from "react";
import { View } from "react-native";
import { FAB, Text } from "react-native-paper";
import { CalendarToggle } from "../components/AppointmentScreen/CalendarToggle";
import { CalendarSection } from "../components/AppointmentScreen/CalendarSection";
import { ShowAllSwitch } from "../components/AppointmentScreen/ShowAllSwitch";
import { AppointmentList } from "../components/AppointmentScreen/AppointmentList";
import { ActionsModal } from "@/shared/components/ActionsModal";
import { CancelDialog } from "../components/AppointmentScreen/CancelDialog";
import { styles } from "../styles/styles";
import { useAppointmentScreenLogic } from "../hooks/useAppointmentScreenLogic";
import { router } from "expo-router";
import ErrorScreen from "@/app/ErrorScreen";
import { Loading } from "@/shared/components/Loading";
import { fabStyle } from "@/shared/styles/fab";

export function AppointmentScreen() {
  const logic = useAppointmentScreenLogic();
  const [fabModalVisible, setFabModalVisible] = useState(false);

  if (logic.error) return <ErrorScreen onRetry={logic.refetch} message="Erro ao carregar agendamentos" />;
  if (logic.isLoading) return <Loading />

  function handleFabOption(option: "new" | "block") {
    setFabModalVisible(false);
    if (option === "new") {
      router.push("/(tabs)/appointment/new-appointment");
    } else if (option === "block") {
      router.push("/(tabs)/appointment/block");
    }
  }

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
        style={fabStyle.fab}
        icon="plus"
        onPress={() => setFabModalVisible(true)}
      />
      <ActionsModal
        visible={fabModalVisible}
        onClose={() => setFabModalVisible(false)}
        title="O que deseja fazer?"
        options={[
          {
            label: "Novo Agendamento",
            action: () => handleFabOption("new"),
            icon: { name: "add", family: "MaterialIcons" },
          },
          {
            label: "Bloquear Agenda",
            action: () => handleFabOption("block"),
            icon: { name: "block", family: "MaterialIcons" },
          },
        ]}
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