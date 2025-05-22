import React, { useState, useEffect, useMemo } from "react";
import { View, ScrollView, Text } from "react-native";
import { Appbar,  Button, Dialog, Portal, Divider } from "react-native-paper";
import { router } from "expo-router";
import api from "@/services/apiService";
import { AxiosError, AxiosResponse } from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Client } from "../types/client.interface";
import { Employee } from "../types/employee.interface";
import { Service } from "../types/service.interface";
import { Category } from "../types/category.interface"; 
import { AppointmentEditResponse } from "../types/appointment.types";
import { appointmentFormStyle as styles } from "../styles/styles";
import { EmployeeSelector } from "../components/EmployeeSelector";
import { ClientSelector } from "../components/ClientSelector";
import { DatePicker, DateTimeSelector, TimePicker } from "../components/DateTimeSelector";
import { ServiceSelector } from "../components/ServiceSelector";
import { SummaryShow } from "../components/SummaryShow";

async function fetchAppointment(appointmentId: number): Promise<AppointmentEditResponse> {
    const response = await api.get(`/appointment/${appointmentId}`);
    return response.data;
}

export function AppointmentForm({appointmentEditId}: {appointmentEditId?: string}) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<number>();

  const [selectedClient, setSelectedClient] = useState<Client>();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [categories, setCategories] = useState<Category[]>([{
    id: 0,
    name: "Todas",
  }]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const [showDialog, setShowDialog] = useState(false);
  const [menuVisible, setMenuVisible] = useState({ employee: false, client: false, category: false });

  const [inputWidth, setInputWidth] = useState(0);

  const [discount, setDiscount] = useState(0);
  const subTotalPrice = useMemo(() => {
    return services.filter(s => selectedServices.includes(s.id))
    .reduce((sum, service) => sum + service.price, 0);
  }, [selectedServices, services]);
  const totalPrice = (subTotalPrice - discount) >= 0 ? subTotalPrice - discount : 0;

  const queryClient = useQueryClient();
  
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get(`/employee/list/all`);
        setEmployees(response.data);
        
        if (!(response.data.length > 0)) {
          setShowDialog(true);
          return;
        };

        setSelectedEmployee(response.data[0].id);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error(error?.response?.data);
        }
      }
    };

    fetchEmployees();
  }, []);

  // Mock de fetch de serviços quando funcionário é selecionado
  useEffect(() => {
    if (selectedEmployee) {
      const fetchData = async () => {
        try {
          const categorysResponse: AxiosResponse<Category[]> = await api.get(`/category/list-all`);
          const allCategories = {
            id: 0,
            name: "Todas",
          };
          setCategories([allCategories, ...categorysResponse.data]);

          const servicesResponse = await api.get(`/service/list-all`);
          setServices(servicesResponse.data)
        } catch (error) {
          if (error instanceof AxiosError) {
            console.error(error?.response?.data);
          }
        }
      };

      fetchData();
    }
  }, [selectedEmployee]);

  const handleSave = async () => {
    if (!date || !time || !selectedEmployee || !selectedClient || selectedServices.length === 0) {
      setShowDialog(true);
      return;
    }

    try {
      await api.post('/appointment', {
        serviceId: selectedServices,
        employeeId: selectedEmployee,
        date: `${date}T${time.toISOString().split('T')[1]}`,
        clientId: selectedClient.id,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error?.response?.data);
      }
    };
    
    queryClient.invalidateQueries({ queryKey: ['appointments'] });

    router.back();
  };

  const { data: editItemData, isLoading, error } = useQuery({
    queryKey: ['employees'],
    queryFn: () => fetchAppointment(Number(appointmentEditId)),
    enabled: !!appointmentEditId,
  });

  useEffect(() => {
    if (editItemData?.employee) {
      setSelectedEmployee(editItemData.employee.id);
      setSelectedServices(editItemData.appointmentServices.map(s => s.serviceId));
    }
  }, [editItemData]);
  

  if (isLoading) return <Text>Carregando...</Text>;
  if (error) return <Text>Erro ao carregar os dados</Text>;

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Novo Agendamento" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <EmployeeSelector 
          employees={employees}
          selectedEmployee={selectedEmployee}
          setSelectedEmployee={setSelectedEmployee}
          menuVisible={menuVisible}
          setMenuVisible={setMenuVisible}
          inputWidth={inputWidth}
        />

        {/* Seleção de Cliente */}
        <ClientSelector
          selectedClient={selectedClient}
          setSelectedClient={setSelectedClient}
          menuVisible={menuVisible}
          setMenuVisible={setMenuVisible}
          inputWidth={inputWidth}
          setInputWidth={setInputWidth}
        />
        
        {/* Seleção de Data e Hora */}
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

        <Button 
          mode="contained" 
          onPress={handleSave}
          style={styles.saveButton}
        >
          Salvar
        </Button>
      </ScrollView>

      {/* Date Picker */}
      <DatePicker 
        date={date}
        setDate={setDate}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
      />

      {/* Time Picker */}
      <TimePicker 
        showTimePicker={showTimePicker}
        setShowTimePicker={setShowTimePicker}
        time={time}
        setTime={setTime}
      />

      {/* Dialog de Validação */}
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