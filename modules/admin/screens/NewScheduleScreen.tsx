import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Appbar, TextInput, Button, Dialog, Portal } from "react-native-paper";
import { Calendar } from "react-native-calendars";
//import {DateTimePickerAndroid} from "@react-native-community/datetimepicker";
import { router } from "expo-router";

export function NewScheduleScreen() {
  const [date, setDate] = useState("");
  const [timeStart, setTimeStart] = useState(new Date());
  const [timeEnd, setTimeEnd] = useState(new Date());
  const [client, setClient] = useState("");
  const [price, setPrice] = useState("");
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleSave = () => {
    if (!date || !client || !price) {
      setShowDialog(true);
      return;
    }

    // enviar os dados para o backend
    console.log({ date, timeStart, timeEnd, client, price });

    // Volta para a tela anterior após salvar
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Barra de Navegação */}
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Novo Agendamento" />
      </Appbar.Header>

      {/* Seleção de Data */}
      <Calendar
        onDayPress={(day: { dateString: React.SetStateAction<string>; }) => setDate(day.dateString)}
        markedDates={{ [date]: { selected: true, selectedColor: "#FF6600" } }}
        style={styles.calendar}
        theme={{ selectedDayBackgroundColor: "#FF6600", todayTextColor: "#FF6600" }}
      />

      {/* Seleção de Horários */}
      <Button mode="outlined" onPress={() => setShowStartPicker(true)} style={styles.input}>
        Horário Início: {timeStart.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
      </Button>
{/*       {showStartPicker && (
        <DateTimePickerAndroid
          value={timeStart}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event: any, selectedTime: Date | undefined) => {
            setShowStartPicker(false);
            if (selectedTime) setTimeStart(selectedTime);
          }}
        />
      )} */}

      <Button mode="outlined" onPress={() => setShowEndPicker(true)} style={styles.input}>
        Horário Fim: {timeEnd.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
      </Button>
      {/* {showEndPicker && (
        <DateTimePickerAndroid
          value={timeEnd}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event: any, selectedTime: Date | undefined) => {
            setShowEndPicker(false);
            if (selectedTime) setTimeEnd(selectedTime);
          }}
        />
      )} */}

      {/* Input de Cliente */}
      <TextInput
        label="Nome do Cliente"
        value={client}
        onChangeText={setClient}
        style={styles.input}
      />

      {/* Input de Preço */}
      <TextInput
        label="Valor (R$)"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />

      {/* Botões de Ação */}
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
          Salvar
        </Button>
        <Button mode="outlined" onPress={() => router.back()} style={styles.cancelButton}>
          Cancelar
        </Button>
      </View>

      {/* Diálogo de Validação */}
      <Portal>
        <Dialog visible={showDialog} onDismiss={() => setShowDialog(false)}>
          <Dialog.Title>Atenção</Dialog.Title>
          <Dialog.Content>
            <Button mode="text" onPress={() => setShowDialog(false)}>
              Preencha todos os campos obrigatórios!
            </Button>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#EAEAEA",
  },
  header: {
    backgroundColor: "#FF6600",
  },
  calendar: {
    marginBottom: 10,
  },
  input: {
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveButton: {
    flex: 1,
    marginRight: 5,
    backgroundColor: "#FF6600",
  },
  cancelButton: {
    flex: 1,
    marginLeft: 5,
  },
});

