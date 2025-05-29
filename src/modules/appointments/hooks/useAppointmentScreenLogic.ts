import { useState, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/shared/services/apiService";
import {  IAppointmentMapped } from "../types/appointment.types";
import { AppointmentStatus } from "../types/appointment.types";
import { router } from "expo-router";
import { groupByDate } from "../helpers/appointments.helper";
import { fetchAppointments } from "../services/fetchAppointments";
import { showAlertForStatusCode } from "@/shared/helpers/showAlertForStatusCode";
import { useApiErrorHandler } from "@/shared/hooks/useApiErrorHandler";
import Toast from "react-native-toast-message";

export function useAppointmentScreenLogic() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [isCancelDialogVisible, setIsCancelDialogVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<IAppointmentMapped | null>(null);
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);
  const apiErrorHandler = useApiErrorHandler();

  const { data, isLoading, error } = useQuery<IAppointmentMapped[]>({
    queryKey: ["appointments"],
    queryFn: fetchAppointments,
    refetchInterval: 1 * 60 * 1000,
  });

  const appointments = data || [];
  const queryClient = useQueryClient();

  const changeAppointmentStatus = useMutation({
    mutationFn: async ({
      appointmentId,
      status,
    }: {
      appointmentId: string;
      status: "complete" | "cancel";
    }) => {
      return await api.patch(`/appointment/${status}/${appointmentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: "Status do agendamento atualizado com sucesso.",
        position: "bottom",
      })
    },
    onError: (error) => {
      apiErrorHandler(error);
      console.error(error);
    },
  });

  const handleShowAll = useCallback(() => {
    setShowAll((prev) => !prev);
    setIsCalendarExpanded(false);
  }, []);

  const handleDayPressed = useCallback((day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    setShowAll(false);
  }, []);

  const openActionsModal = useCallback((appointment: IAppointmentMapped) => {
    setSelectedAppointment(appointment);
    setIsActionModalVisible(true);
  }, []);

  const closeActionsModal = useCallback(() => {
    setIsActionModalVisible(false);
    setSelectedAppointment(null);
  }, []);

  const handleEdit = useCallback(() => {
    if (!selectedAppointment) {
      showAlertForStatusCode(400, "Nenhum agendamento selecionado.");
      return;
    }

    router.push({
      pathname: "/(tabs)/appointment/[appointmentEditId]",
      params: { appointmentEditId: selectedAppointment.id },
    });

    closeActionsModal();
  }, [selectedAppointment, closeActionsModal]);

  const handleCancel = useCallback(() => {
    setIsCancelDialogVisible(true);
    setIsActionModalVisible(false);
  }, []);

  const handleConfirmCancel = useCallback(() => {
    toggleAttended("cancel");
    setIsCancelDialogVisible(false);
    setSelectedAppointment(null);
  }, [selectedAppointment]);

  const toggleAttended = useCallback(
    async (status: "complete" | "cancel") => {
      if (!selectedAppointment) {
        showAlertForStatusCode(400, "Nenhum agendamento selecionado.");
        return;
      }

      await changeAppointmentStatus.mutateAsync({ appointmentId: selectedAppointment.id, status });
      closeActionsModal();
    },
    [selectedAppointment, changeAppointmentStatus, closeActionsModal]
  );

  const filteredAppointments = showAll
    ? appointments
    : appointments.filter((item) => item.date === selectedDate);
  const groupedAppointments = groupByDate(filteredAppointments);
  const dates = Object.keys(groupedAppointments);

  const actionOptions = [];
  if (selectedAppointment) {
    actionOptions.push({ label: "Editar", action: handleEdit, icon: { name: "edit" } });

    if (
      selectedAppointment.appointmentStatus.toLowerCase() !==
      AppointmentStatus.COMPLETED.toLowerCase()
    ) {
      actionOptions.push({
        label: "Marcar como Atendido",
        action: () => toggleAttended("complete"),
        icon: { name: "check-circle" },
      });
    }

    if (
      selectedAppointment.appointmentStatus.toLowerCase() ===
      AppointmentStatus.PENDING.toLowerCase()
    ) {
      actionOptions.push({
        label: "Cancelar",
        action: handleCancel,
        icon: { name: "cancel" },
      });
  }
}

  return {
    isLoading,
    error,
    isCalendarExpanded,
    setIsCalendarExpanded,
    showAll,
    setShowAll,
    selectedDate,
    setSelectedDate,
    groupedAppointments,
    dates,
    selectedAppointment,
    setSelectedAppointment,
    isActionModalVisible,
    setIsActionModalVisible,
    isCancelDialogVisible,
    setIsCancelDialogVisible,
    handleShowAll,
    handleDayPressed,
    openActionsModal,
    closeActionsModal,
    handleEdit,
    handleCancel,
    handleConfirmCancel,
    toggleAttended,
    actionOptions
  };
}
