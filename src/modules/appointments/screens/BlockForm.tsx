import React, { useState } from "react";
import { View, ScrollView, Text } from "react-native";
import { Appbar, Button, Dialog, Portal, Switch } from "react-native-paper";
import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { appointmentFormStyle as styles } from "../styles/styles";
import { EmployeeSelector } from "../components/AppointmentForm/EmployeeSelector";
import { DatePicker, DateTimeSelector, TimePicker } from "../components/AppointmentForm/DateTimeSelector";
import api from "@/shared/services/apiService";
import { useEmployees } from "../../../shared/hooks/queries/useEmployees";
import { Loading } from "@/shared/components/Loading";
import { useApiErrorHandler } from "@/shared/hooks/useApiErrorHandler";
import Toast from "react-native-toast-message";

export function BlockForm() {
  const queryClient = useQueryClient();
  const apiErrorHandler = useApiErrorHandler();

  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date(Date.now() + 30 * 60 * 1000));
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<number>();
  const [inputWidth, setInputWidth] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [menuVisible, setMenuVisible] = useState({ employee: false, client: false, category: false });
  const [sameDay, setSameDay] = useState(true);

  const { data: employeesData, isLoading: isLoadingEmployees } = useEmployees();

  const handleSave = async () => {
    if (
      !startDate ||
      !startTime ||
      !endTime ||
      !selectedEmployee ||
      (!sameDay && !endDate)
    ) {
      setShowDialog(true);
      return;
    }
    // Calcula datas completas
    const startDateTime = `${startDate}T${startTime.toISOString().split('T')[1]}`;
    const endDateTime = `${(sameDay ? startDate : endDate)}T${endTime.toISOString().split('T')[1]}`;
    
    if (new Date(endDateTime) <= new Date(startDateTime)) {
      setShowDialog(true);
      return;
    };

    try {
      await api.post("/appointment/block", {
        startDate: startDateTime,
        endDate: endDateTime,
        employeeId: selectedEmployee,
      });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });

      Toast.show({
        type: 'success',
        text1: 'Bloqueio criado com sucesso!',
        text2: 'A agenda foi bloqueada para o período selecionado.',
        swipeable: true,
        position: 'bottom',
      });
      
      router.back();
    } catch (error) {
      apiErrorHandler(error);
    }
  };

  if (isLoadingEmployees) return <Loading />;

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Bloquear Agenda" />
      </Appbar.Header>
      
      <ScrollView contentContainerStyle={styles.content}>
        <EmployeeSelector
          employees={employeesData || []}
          selectedEmployee={selectedEmployee}
          setSelectedEmployee={setSelectedEmployee}
          menuVisible={menuVisible}
          setMenuVisible={setMenuVisible}
          inputWidth={inputWidth}
        />

        {/* Switch para mesmo dia ou não */}
        <View style={[styles.row, { alignItems: "center", marginVertical: 8 }]}>
          <Text style={{ marginRight: 8 }}>Termina no mesmo dia?</Text>
          <Switch value={sameDay} onValueChange={setSameDay} />
        </View>

        <DateTimeSelector
          date={startDate}
          time={startTime}
          setShowDatePicker={setShowStartDatePicker}
          setShowTimePicker={setShowStartTimePicker}
          message="Início do Bloqueio"
        />

        <DateTimeSelector
          setShowDatePicker={setShowEndDatePicker}
          setShowTimePicker={setShowEndTimePicker}
          date={sameDay ? startDate : endDate}
          time={endTime}
          showDateSelector={!sameDay}
          message="Fim do Bloqueio"
        />

        <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
          Bloquear
        </Button>
      </ScrollView>

      {/* Pickers */}
      <DatePicker
        date={startDate}
        setDate={setStartDate}
        showDatePicker={showStartDatePicker}
        setShowDatePicker={setShowStartDatePicker}
      />
      <DatePicker
        date={endDate}
        setDate={setEndDate}
        showDatePicker={showEndDatePicker}
        setShowDatePicker={setShowEndDatePicker}
      />
      <TimePicker
        time={startTime}
        setTime={setStartTime}
        showTimePicker={showStartTimePicker}
        setShowTimePicker={setShowStartTimePicker}
      />
      <TimePicker
        time={endTime}
        setTime={setEndTime}
        showTimePicker={showEndTimePicker}
        setShowTimePicker={setShowEndTimePicker}
      />

      <Portal>
        <Dialog visible={showDialog} onDismiss={() => setShowDialog(false)}>
          <Dialog.Title>Atenção</Dialog.Title>
          <Dialog.Content>
            <Text>Preencha todos os campos obrigatórios corretamente!</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDialog(false)}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
