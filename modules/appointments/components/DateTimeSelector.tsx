import { TouchableOpacity, View, Text } from "react-native";
import { Modal, Portal, TextInput } from "react-native-paper";
import { appointmentFormStyle as styles } from "../styles/styles";
import { Calendar, DateData } from "react-native-calendars";
import DateTimePicker from '@react-native-community/datetimepicker';

interface DateTimeSelectorProps {
    date: string;
    time: Date;
    setShowDatePicker: (show: boolean) => void;
    setShowTimePicker: (show: boolean) => void;
}

export function DateTimeSelector({
    date,
    time,
    setShowDatePicker,
    setShowTimePicker,
}: DateTimeSelectorProps ) {
    return (
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
    )
};

export interface DatePickerProps {
    showDatePicker: boolean;
    setShowDatePicker: (show: boolean) => void;
    date: string;
    setDate: (date: string) => void;
}

export function DatePicker({
    showDatePicker,
    setShowDatePicker,
    date,
    setDate,
}: DatePickerProps) {
    return (
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
    )
}

export interface TimePickerProps {
    showTimePicker: boolean;
    setShowTimePicker: (show: boolean) => void;
    time: Date;
    setTime: (time: Date) => void;
}

export function TimePicker({
    showTimePicker,
    setShowTimePicker,
    time,
    setTime,
}: TimePickerProps) {
    return (
      <>
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
      </>
    )
}