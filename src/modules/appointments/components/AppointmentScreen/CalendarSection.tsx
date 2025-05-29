import React from "react";
import { Calendar } from "react-native-calendars";
import { styles } from "../../styles/styles";
import { Colors } from "@/shared/constants/Colors";

export function CalendarSection({
  isExpanded,
  selectedDate,
  onDayPress,
}: {
  isExpanded: boolean;
  selectedDate: string;
  onDayPress: (day: { dateString: string }) => void;
}) {
  if (!isExpanded) return null;
  return (
    <Calendar
      onDayPress={onDayPress}
      markedDates={{ [selectedDate]: { selected: true, selectedColor: Colors.light.mainColor } }}
      style={styles.calendar}
      theme={{ selectedDayBackgroundColor: Colors.light.mainColor , todayTextColor: Colors.light.mainColor  }}
    />
  );
}
