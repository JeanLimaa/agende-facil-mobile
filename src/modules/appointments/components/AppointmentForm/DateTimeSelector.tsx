import { TouchableOpacity, View, Text } from "react-native";
import { Modal, Portal, TextInput } from "react-native-paper";
import { appointmentFormStyle as styles } from "../../styles/styles";
import { Calendar, DateData } from "react-native-calendars";
import DateTimePicker from '@react-native-community/datetimepicker';
import {format} from 'date-fns';
import { formatDate } from "../../helpers/date.helper";
interface DateTimeSelectorProps {
    date: string;
    time: Date;
    setShowDatePicker: (show: boolean) => void;
    setShowTimePicker: (show: boolean) => void;

    showDateSelector?: boolean;
    showTimeSelector?: boolean;
    message?: string;
}

export function DateTimeSelector({
    date,
    time,
    setShowDatePicker,
    setShowTimePicker,
    showDateSelector = true,
    showTimeSelector = true,
    message = "Data e Horário",
}: DateTimeSelectorProps ) {
    return (
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionLabel}>{message}</Text>

            <View style={styles.row}>
                {showDateSelector && <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    activeOpacity={0.8}
                    style={styles.flex}
                >
                    <TextInput
                        label="Data"
                        value={formatDate(date)}
                        right={<TextInput.Icon icon="calendar" onPress={() => setShowDatePicker(true)} />}
                        editable={false}
                    />
                </TouchableOpacity>}

                {showTimeSelector && <TouchableOpacity
                    onPress={() => setShowTimePicker(true)}
                    activeOpacity={0.8}
                    style={styles.flex}
                >
                    <TextInput
                        label="Horário"
                        value={format(time, 'HH:mm')}
                        right={<TextInput.Icon icon="clock" onPress={() => setShowTimePicker(true)} />}
                        editable={false}
                    />
                </TouchableOpacity>}
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