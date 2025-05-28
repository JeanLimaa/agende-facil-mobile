import React, { useMemo, useState, useEffect } from "react";
import { View, ScrollView, Text } from "react-native";
import { Appbar, Button, Dialog, Portal, Divider } from "react-native-paper";
import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";

import { appointmentFormStyle as styles } from "../styles/styles";
import { EmployeeSelector } from "../components/AppointmentForm/EmployeeSelector";
import { ClientSelector } from "../components/AppointmentForm/ClientSelector";
import { DatePicker, DateTimeSelector, TimePicker } from "../components/AppointmentForm/DateTimeSelector";
import { ServiceSelector } from "../components/AppointmentForm/ServiceSelector";
import { SummaryShow } from "../components/AppointmentForm/SummaryShow";

import { useEmployees } from "../hooks/useEmployees";
import { useCategoriesAndServices } from "../hooks/useCategoriesAndServices";
import { useAppointmentEdit } from "../hooks/useAppointmentEdit";

import api from "@/services/apiService";
import { Client } from "../types/client.interface";
import { Loading } from "@/components/Loading";
import { useApiErrorHandler } from "@/hooks/useApiErrorHandler";

export function AppointmentForm({ appointmentEditId }: { appointmentEditId?: string }) {
  const queryClient = useQueryClient();
  const apiErrorHandler = useApiErrorHandler();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<number>();
  const [selectedClient, setSelectedClient] = useState<Client>();
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const [discount, setDiscount] = useState(0);
  const [inputWidth, setInputWidth] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [menuVisible, setMenuVisible] = useState({ employee: false, client: false, category: false });

  // Requisições
  const { data: employeesData, isLoading: isLoadingEmployees } = useEmployees();
  const { data: categoriesServicesData, isLoading: isLoadingCategoriesServices } = useCategoriesAndServices(!!selectedEmployee);
  const { data: editItemData, isLoading: isLoadingEdit } = useAppointmentEdit(appointmentEditId);

  const services = categoriesServicesData?.services || [];
  const categories = categoriesServicesData?.categories || [];

  // Valores calculados
  const subTotalPrice = useMemo(() => {
    return services
      .filter(service => selectedServices.includes(service.id))
      .reduce((acc, curr) => acc + curr.price, 0);
  }, [selectedServices, services]);

  const totalPrice = Math.max(subTotalPrice - discount, 0);

  useEffect(() => {
    if (editItemData) {
      setSelectedEmployee(editItemData.employee.id);
      setSelectedServices(editItemData.appointmentServices.map(s => s.serviceId));
      setSelectedClient(editItemData.client);
      setDate(editItemData.date.split('T')[0]);
      setTime(new Date(editItemData.date));
      setDiscount(editItemData.discount || 0);
    }
  }, [editItemData]);

  const handleSave = async () => {
    if (!date || !time || !selectedEmployee || !selectedClient || selectedServices.length === 0) {
      setShowDialog(true);
      return;
    }

    try {
      const payload = {
        serviceId: selectedServices,
        employeeId: selectedEmployee,
        date: `${date}T${time.toISOString().split('T')[1]}`,
        clientId: selectedClient.id,
        discount,
      };

      if (appointmentEditId) {
        await api.put(`/appointment/${appointmentEditId}`, payload);
      } else {
        await api.post(`/appointment`, payload);
      }

      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      router.back();
    } catch (error) {
        apiErrorHandler(error);
    }
  };

  if (isLoadingEmployees || isLoadingCategoriesServices || (appointmentEditId && isLoadingEdit)) return <Loading />;
  
  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Novo Agendamento" />
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

        <ClientSelector
          selectedClient={selectedClient}
          setSelectedClient={setSelectedClient}
          menuVisible={menuVisible}
          setMenuVisible={setMenuVisible}
          inputWidth={inputWidth}
          setInputWidth={setInputWidth}
        />

        <DateTimeSelector
          date={date}
          time={time}
          setShowDatePicker={setShowDatePicker}
          setShowTimePicker={setShowTimePicker}
        />

        <ServiceSelector
          services={services}
          categories={categories}
          selectedServices={selectedServices}
          setSelectedServices={setSelectedServices}
          selectedCategoryId={selectedCategoryId}
          setSelectedCategoryId={setSelectedCategoryId}
        />

        <Divider />

        <SummaryShow
          subTotalPrice={subTotalPrice}
          totalPrice={totalPrice}
          discount={discount}
          setDiscount={setDiscount}
        />

        <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
          Salvar
        </Button>
      </ScrollView>

      <DatePicker
        date={date}
        setDate={setDate}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
      />

      <TimePicker
        time={time}
        setTime={setTime}
        showTimePicker={showTimePicker}
        setShowTimePicker={setShowTimePicker}
      />

      <Portal>
        <Dialog visible={showDialog} onDismiss={() => setShowDialog(false)}>
          <Dialog.Title>Atenção</Dialog.Title>
          <Dialog.Content>
            <Text>Preencha todos os campos obrigatórios!</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDialog(false)}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}