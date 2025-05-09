import React, { useState, useEffect, useMemo } from "react";
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from "react-native";
import { Appbar, TextInput, Button, Dialog, Portal, Chip, Checkbox, Divider, Menu, Modal } from "react-native-paper";
import { Calendar, DateData } from "react-native-calendars";
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/Colors";
import { BASE_URL } from "@/constants/apiUrl";
import api from "@/services/apiService";
import { Axios, AxiosError, AxiosResponse } from "axios";
import { textCapitalize } from "@/helpers/textCapitalize";
import { formatToCurrency } from "@/helpers/formatValue";
import { useQuery } from "@tanstack/react-query";
import { Client } from "../types/client.interface";
import { Employee } from "../types/employee.interface";
import { Service } from "../types/service.interface";
import { Category } from "../types/category.interface"; 
import { AppointmentEditResponse } from "../types/appointment.types";

async function fetchSchedule(scheduleId: number): Promise<AppointmentEditResponse> {
    const response = await api.get(`/appointment/${scheduleId}`);
    return response.data;
}

export function ScheduleForm({scheduleEditId}: {scheduleEditId?: string}) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<number>();
  const [clients] = useState<Client[]>([
    {id: 1, name: "Cliente 1"},
    {id: 2, name: "Cliente 2"},
    {id: 3, name: "Cliente 3"},
  ]);
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
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error?.response?.data);
      }
    };

    router.back();
  };

  const toggleService = (serviceId: number) => {
    setSelectedServices(prev => 
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const { data: editItemData, isLoading, error } = useQuery({
    queryKey: ['employees'],
    queryFn: () => fetchSchedule(Number(scheduleEditId)),
    enabled: !!scheduleEditId,
  });

  if (isLoading) return <Text>Carregando...</Text>;
  if (error) return <Text>Erro ao carregar os dados</Text>;

  useEffect(() => {
    if (editItemData?.employee) {
      setSelectedEmployee(editItemData.employee.id);
      editItemData.appointmentServices.forEach(service => {
        setSelectedServices(prev => [...prev, service.serviceId]);
      });
    }
  }, [editItemData]);


  const filteredServices = services.filter(s => !selectedCategoryId || s.categoryId === selectedCategoryId);

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Novo Agendamento" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Seleção de Funcionário */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Funcionário</Text>

          <Menu
            style={{width: inputWidth}}
            visible={menuVisible.employee}
            onDismiss={() => setMenuVisible({ ...menuVisible, employee: false })}
            anchor={
              <Button 
                onPress={() => setMenuVisible({ ...menuVisible, employee: true })}
                mode="outlined"
                style={styles.input}
              >
                {selectedEmployee 
                  ? employees.find(e => e.id === selectedEmployee)?.name
                  : "Selecione o funcionário"}
              </Button>
            }>
            {employees.map(employee => (
              <Menu.Item
                key={employee.id}
                title={employee.name}
                onPress={() => {
                  setSelectedEmployee(employee.id);
                  setMenuVisible({ ...menuVisible, employee: false });
                }}
              />
            ))}
          </Menu>
        </View>

        {/* Seleção de Cliente */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Cliente</Text>

          <Menu
            visible={menuVisible.client}
            style={{width: inputWidth}}
            onDismiss={() => setMenuVisible({ ...menuVisible, client: false })}
            anchor={
              <Button 
                onPress={() => setMenuVisible({ ...menuVisible, client: true })}
                mode="outlined"
                style={styles.input}
                onLayout={(event) => setInputWidth(event.nativeEvent.layout.width)}
              >
                {selectedClient?.name || "Selecione o cliente"}
              </Button>
            }>
            {clients.map(client => (
              <Menu.Item
                key={client.id}
                title={client.name}
                onPress={() => {
                  setSelectedClient(client);
                  setMenuVisible({ ...menuVisible, client: false });
                }}
              />
            ))}
          </Menu>
        </View>
        
        {/* Seleção de Data e Hora */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Data e Horário</Text>

          <View style={styles.row}>
            <TouchableOpacity 
              onPress={() => setShowDatePicker(true)} 
              activeOpacity={0.8}
              style={styles.flex}
            >
              <TextInput
                label="Data"
                value={date.split('-').reverse().join('/')}
                right={<TextInput.Icon icon="calendar" onPress={() => setShowDatePicker(true)} />}
                editable={false}
              />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setShowTimePicker(true)} 
              activeOpacity={0.8}
              style={styles.flex}
            >
              <TextInput
              label="Horário"
              value={time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              right={<TextInput.Icon icon="clock" onPress={() => setShowTimePicker(true)} />}
              editable={false}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Serviços</Text>

          {/* Filtro de Categoria */}
          <View>
            <Text style={styles.smallLabel}>Filtrar por categoria</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.chipContainer}
            >
              {categories.map(category => (
                <Chip
                  key={category.id}
                  selected={selectedCategoryId === category.id}
                  onPress={() => setSelectedCategoryId(
                    selectedCategoryId === category.id ? 0 : category.id
                  )}
                  style={[styles.chip, selectedCategoryId === category.id && styles.chipSelected]}
                >
                  {textCapitalize(category.name)}
                </Chip>
              ))}
            </ScrollView>
          </View>

          {/* Lista de Serviços */}
          {services.length === 0 ? <Text style={styles.mediumLabel}>Nenhum serviço encontrado</Text> : 
            filteredServices
            .map(service => (
              <View key={service.id}>
                <View style={styles.serviceItem}>
                  <Checkbox
                    status={selectedServices.includes(service.id) ? 'checked' : 'unchecked'}
                    onPress={() => toggleService(service.id)}
                  />
                  <View style={styles.serviceInfo}>
                    <Text>{service.name}</Text>
                    <Text>{formatToCurrency(service.price)}</Text>
                  </View>
                </View>
                <Divider />
              </View>
          ))}
          {services.length > 0 && filteredServices.length === 0 ? 
            <Text style={styles.mediumLabel}>Não há serviços cadastrados para essa categoria.</Text> 
          : null}
            
        </View>

        <Divider />

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Resumo</Text>
{/*           <View>
            <Text style={styles.sectionLabel}>SubTotal</Text>
            <Text style={styles.sectionLabel}>{formatToCurrency(totalPrice)}</Text>
          </View>
          <View>
            <Text style={styles.sectionLabel}>Desconto</Text>
            <TextInput
              keyboardType="numeric"
              style={styles.input}
              value={discount.toString()}
              onChangeText={(value) => setDiscount(Number(value.replace(/\D/g, '')))}
            />
          </View> */}
          <View>
            <Text style={styles.sectionSubLabel}>Valor Total</Text>
            <Text style={styles.sectionSubLabel}>{formatToCurrency(totalPrice)}</Text>
          </View>
        </View>

        <Button 
          mode="contained" 
          onPress={handleSave}
          style={styles.saveButton}
        >
          Salvar
        </Button>
      </ScrollView>

      {/* Date Picker */}
      <Portal>
        <Modal
          visible={showDatePicker}
          onDismiss={() => setShowDatePicker(false)}
          style={{margin: 10}}
        >
          <Calendar
            onDayPress={(day: DateData) => {
              setDate(day.dateString);
              setShowDatePicker(false);
            }}
            markedDates={{ [date]: { selected: true } }}
            style={{
              borderRadius: 10,
            }}
          />
        </Modal>
      </Portal>


      {/* Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={true}
          onChange={(_, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) setTime(selectedTime);
          }}
        />
      )}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAEAEA",
  },
  header: {
    backgroundColor: "#FF6600",
  },
  content: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
    width: '100%',
  },
  flex: {
    flex: 1,
  },
  input: {
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 8,
  },
  chip: {
    margin: 2,
  },
  chipSelected: {
    backgroundColor: Colors.light.mainColor,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  serviceInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 8,
  },
  saveButton: {
    marginTop: 16,
    backgroundColor: "#FF6600",
  },
  sectionContainer: {
    marginBottom: 6,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "700",
    margin: 5,
    color: Colors.light.textSecondary
  },
  sectionSubLabel: {
    fontSize: 13,
    fontWeight: "500",
    margin: 5,
    color: Colors.light.textSecondary
  },
  smallLabel: {
    fontSize: 12,
    marginHorizontal: 5,
    marginBottom: 5,
    color: Colors.light.textSecondary
  },
  mediumLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginHorizontal: 5,
    marginBottom: 5,
    color: Colors.light.textSecondary
  }
});