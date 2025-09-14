import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { GenericalCard } from "./GenericalCard";
import { Colors } from "../constants/Colors";
import { FieldValue, FormDataType, GenericFormField } from "@/modules/settings/components/GenericForm";
import { DailyWorkingHour } from "../types/working-hours.interface";

const weekdays = [
  { key: "sunday", label: "Domingo", dayOfWeek: 0 },
  { key: "monday", label: "Segunda-feira", dayOfWeek: 1 },
  { key: "tuesday", label: "Terça-feira", dayOfWeek: 2 },
  { key: "wednesday", label: "Quarta-feira", dayOfWeek: 3 },
  { key: "thursday", label: "Quinta-feira", dayOfWeek: 4 },
  { key: "friday", label: "Sexta-feira", dayOfWeek: 5 },
  { key: "saturday", label: "Sábado", dayOfWeek: 6 },
] as const;

interface WeeklyScheduleFieldProps {
  field: GenericFormField;
  formData: FormDataType;
  fieldLabel: string;
  handleChange: (name: string, value: FieldValue) => void;
}

export default function WeeklyScheduleField({
  field,
  formData,
  fieldLabel,
  handleChange
}: WeeklyScheduleFieldProps) {
  const [expanded, setExpanded] = useState(false);
  const [errors, setErrors] = useState<{ [day: string]: string }>({});
  const [timePickerState, setTimePickerState] = useState<{
    dayKey: string;
    type: "startTime" | "endTime";
    show: boolean;
  }>({ dayKey: "", type: "startTime", show: false });
  const currentSchedule = formData[field.name] as DailyWorkingHour[] || [];

  const showPicker = (dayKey: string, type: "startTime" | "endTime") => {
    setTimePickerState({ dayKey, type, show: true });
  };

  const getScheduleByDay = (dayOfWeek: number) => {
    return (currentSchedule || []).find((entry: DailyWorkingHour) => entry.dayOfWeek === dayOfWeek);
  };

  const clearDay = (dayKey: string) => {
    const { dayOfWeek } = weekdays.find((d) => d.key === dayKey)!;
    const updated = (currentSchedule || []).filter((entry: DailyWorkingHour) => entry.dayOfWeek !== dayOfWeek);
    handleChange(field.name, updated);

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[dayKey];
      return newErrors;
    });
  };

  const handleTimeChange = (event: any, selectedDate: Date | undefined) => {
    if (!selectedDate) {
      setTimePickerState({ ...timePickerState, show: false });
      return;
    }

    const hours = selectedDate.getHours().toString().padStart(2, "0");
    const minutes = selectedDate.getMinutes().toString().padStart(2, "0");
    const timeString = `${hours}:${minutes}`;

    const { dayKey, type } = timePickerState;
    const { dayOfWeek } = weekdays.find((d) => d.key === dayKey)!;

    let updatedSchedule: DailyWorkingHour[] = [...currentSchedule];
    const index = updatedSchedule.findIndex((entry) => entry.dayOfWeek === dayOfWeek);

    if (index >= 0) {
      updatedSchedule[index] = {
        ...updatedSchedule[index],
        [type]: timeString,
      };
    } else {
      updatedSchedule.push({
        dayOfWeek,
        startTime: type === "startTime" ? timeString : "",
        endTime: type === "endTime" ? timeString : "",
      });
    }

    handleChange(field.name, updatedSchedule);

    const updatedEntry = updatedSchedule.find((entry) => entry.dayOfWeek === dayOfWeek);

    const startTime = updatedEntry?.startTime || "";
    const endTime = updatedEntry?.endTime || "";

    if (startTime && !endTime && type === "startTime") {
      setErrors((prev) => ({
        ...prev,
        [dayKey]: "Informe também o horário de fim",
      }));
    } else if (endTime && !startTime && type === "endTime") {
      setErrors((prev) => ({
        ...prev,
        [dayKey]: "Informe também o horário de início",
      }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[dayKey];
        return newErrors;
      });
    }

    setTimePickerState({ ...timePickerState, show: false });
  };

  const hasAnySchedule = (currentSchedule || []).some(
    (entry: DailyWorkingHour) => entry?.startTime || entry?.endTime
  );

  const renderSummary = () => {
    if (!hasAnySchedule) {
      return (
        <Text style={{ color: "#666" }}>
          {field.placeholder || "Se nenhum horário for definido, será usado o da empresa."}
        </Text>
      );
    }

    return (
      <View style={{ flexDirection: "column", gap: 6 }}>
        {weekdays.map((day) => {
          const schedule = getScheduleByDay(day.dayOfWeek);
          if (!schedule?.startTime && !schedule?.endTime) return null;

          return (
            <View
              key={day.key}
              style={styles.summaryRow}
            >
              <Text style={styles.summaryLabel}>{day.label}</Text>
              <Text style={styles.summaryTime}>
                {schedule?.startTime || "--:--"} às {schedule?.endTime || "--:--"}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View key={field.name} style={{ gap: 8 }}>
      <Text style={styles.label}>{fieldLabel}</Text>

      <View
        style={{
          borderColor: Colors.light.border,
          borderWidth: 1,
          borderRadius: 8,
          padding: 12,
          backgroundColor: Colors.light.background,
        }}
      >
        {renderSummary()}
        <Button
          mode="text"
          onPress={() => setExpanded((prev) => !prev)}
          style={{ marginTop: 8 }}
        >
          {expanded ? "Fechar edição" : "Editar horários"}
        </Button>
      </View>

      {expanded && (
        <View style={{ gap: 12 }}>
          {weekdays.map((day) => {
            const schedule = getScheduleByDay(day.dayOfWeek);
            
            const start = schedule?.startTime || "";
            const end = schedule?.endTime || "";

            return (
              <GenericalCard key={day.key} containerStyle={{ marginHorizontal: 0, gap: 4 }}>
                <Text style={styles.label}>{day.label}</Text>

                <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
                  <Button
                    mode="outlined"
                    style={{ flex: 1 }}
                    onPress={() => showPicker(day.key, "startTime")}
                  >
                    {start ? `Início: ${start}` : "Início"}
                  </Button>
                  <Button
                    mode="outlined"
                    style={{ flex: 1 }}
                    onPress={() => showPicker(day.key, "endTime")}
                  >
                    {end ? `Fim: ${end}` : "Fim"}
                  </Button>

                  {(start || end) && (
                    <Pressable onPress={() => clearDay(day.key)}>
                      <Ionicons name="trash-bin-outline" size={20} color="#d00" />
                    </Pressable>
                  )}
                </View>

                {errors[day.key] && (
                  <Text style={{ color: "red", marginTop: 8, fontSize: 12 }}>{errors[day.key]}</Text>
                )}
              </GenericalCard>
            );
          })}

        </View>
      )}

      {timePickerState.show && (
        <DateTimePicker
          mode="time"
          value={new Date()}
          is24Hour
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    marginBottom: 6,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  summaryLabel: { fontWeight: "500", flex: 1 },
  summaryTime: { color: "#333", fontSize: 14 },
});
