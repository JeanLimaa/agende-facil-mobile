import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from "react-native";
import { Appbar, TextInput, Button, Dialog, Portal, Chip, Checkbox, Divider, Menu } from "react-native-paper";
import { Calendar, DateData } from "react-native-calendars";
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";

interface Employee {
  id: number;
  name: string;
}

interface Service {
  id: number;
  name: string;
  price: number;
  categoryId: number;
}

export function NewScheduleScreen() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<number>();
  const [clients] = useState(["Cliente 1", "Cliente 2", "Cliente 3"]);
  const [selectedClient, setSelectedClient] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [categories, setCategories] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>();
  const [showDialog, setShowDialog] = useState(false);
  const [menuVisible, setMenuVisible] = useState({ employee: false, client: false, category: false });

  // Mock de fetch de funcionários
  useEffect(() => {
    // Substituir por chamada real à API
    const fakeEmployees = [
      { id: 1, name: "Funcionário 1" },
      { id: 2, name: "Funcionário 2" }
    ];
    setEmployees(fakeEmployees);
    if (fakeEmployees.length > 0) {
      setSelectedEmployee(fakeEmployees[0].id);
    }
  }, []);

  // Mock de fetch de serviços quando funcionário é selecionado
  useEffect(() => {
    if (selectedEmployee) {
      // Substituir por chamada real à API
      const fakeServices = [
        { id: 1, name: "Corte", price: 50, categoryId: 1 },
        { id: 2, name: "Barba", price: 30, categoryId: 1 },
        { id: 3, name: "Massagem", price: 80, categoryId: 2 }
      ];
      setServices(fakeServices);
      setCategories([...new Set(fakeServices.map(s => s.categoryId))]);
    }
  }, [selectedEmployee]);

  const totalPrice = services
    .filter(s => selectedServices.includes(s.id))
    .reduce((sum, service) => sum + service.price, 0);

  const handleSave = () => {
    if (!date || !time || !selectedEmployee || !selectedClient || selectedServices.length === 0) {
      setShowDialog(true);
      return;
    }

    console.log({
      date,
      time,
      employee: selectedEmployee,
      client: selectedClient,
      services: selectedServices,
      totalPrice
    });

    router.back();
  };

  const toggleService = (serviceId: number) => {
    setSelectedServices(prev => 
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Novo Agendamento" />
      </Appbar.Header>

      {/* Seleção de Funcionário */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionLabel}>Funcionário</Text>

        <View style={styles.sectionContainer}>
          <Menu
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
            onDismiss={() => setMenuVisible({ ...menuVisible, client: false })}
            anchor={
              <Button 
                onPress={() => setMenuVisible({ ...menuVisible, client: true })}
                mode="outlined"
                style={styles.input}
              >
                {selectedClient || "Selecione o cliente"}
              </Button>
            }>
            {clients.map(client => (
              <Menu.Item
                key={client}
                title={client}
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
            <TouchableOpacity onPress={() => setShowDatePicker(true)} activeOpacity={0.8}  >
              <TextInput
                label="Data"
                value={date.split('-').reverse().join('/')}
                right={<TextInput.Icon icon="calendar" onPress={() => setShowDatePicker(true)} />}
                style={{width: '100%'}}
                editable={false}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowTimePicker(true)} activeOpacity={0.8} >
              <TextInput
              label="Horário"
              value={time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              right={<TextInput.Icon icon="clock" onPress={() => setShowTimePicker(true)} />}
              style={{width: '100%'}}
              editable={false}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Serviços</Text>

          {/* Filtro de Categoria */}
          <View style={styles.chipContainer}>
            {categories.map(category => (
              <Chip
                key={category}
                selected={selectedCategory === category}
                onPress={() => setSelectedCategory(
                  selectedCategory === category ? undefined : category
                )}
                style={styles.chip}
              >
                Categoria {category}
              </Chip>
            ))}
          </View>

          {/* Lista de Serviços */}
          {services
            .filter(s => !selectedCategory || s.categoryId === selectedCategory)
            .map(service => (
              <View key={service.id}>
                <View style={styles.serviceItem}>
                  <Checkbox
                    status={selectedServices.includes(service.id) ? 'checked' : 'unchecked'}
                    onPress={() => toggleService(service.id)}
                  />
                  <View style={styles.serviceInfo}>
                    <Text>{service.name}</Text>
                    <Text>R$ {service.price.toFixed(2)}</Text>
                  </View>
                </View>
                <Divider />
              </View>
            ))}
        </View>

        <Divider />

        <View>
          <Text style={styles.sectionLabel}>Valor Total</Text>
          <Text style={styles.sectionLabel}>R$ {totalPrice.toFixed(2)}</Text>
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
      <Portal >
        <Dialog visible={showDatePicker} onDismiss={() => setShowDatePicker(false)} >
          <Dialog.Content>
            <Calendar
              onDayPress={(day: DateData) => {
                setDate(day.dateString);
                setShowDatePicker(false);
              }}
              markedDates={{ [date]: { selected: true } }}
            />
          </Dialog.Content>
        </Dialog>
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
    fontWeight: "bold",
    margin: 5,
    color: Colors.light.textSecondary
  },
});