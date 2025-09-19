import React, { useState, useEffect, useMemo } from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { Button, Chip, HelperText } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { GenericalCard } from "./GenericalCard";
import { Colors } from "../constants/Colors";
import { FieldValue, FormDataType, GenericFormField } from "@/modules/settings/components/GenericForm";
import { DailyWorkingHour } from "../types/working-hours.interface";
import { useConfirm } from "../hooks/useConfirm";

const weekdays = [
  { key: "sunday", label: "Domingo", dayOfWeek: 0 },
  { key: "monday", label: "Segunda-feira", dayOfWeek: 1 },
  { key: "tuesday", label: "Terça-feira", dayOfWeek: 2 },
  { key: "wednesday", label: "Quarta-feira", dayOfWeek: 3 },
  { key: "thursday", label: "Quinta-feira", dayOfWeek: 4 },
  { key: "friday", label: "Sexta-feira", dayOfWeek: 5 },
  { key: "saturday", label: "Sábado", dayOfWeek: 6 },
] as const;

const weekdaysShort = [
  { key: "sunday", label: "Dom", dayOfWeek: 0 },
  { key: "monday", label: "Seg", dayOfWeek: 1 },
  { key: "tuesday", label: "Ter", dayOfWeek: 2 },
  { key: "wednesday", label: "Qua", dayOfWeek: 3 },
  { key: "thursday", label: "Qui", dayOfWeek: 4 },
  { key: "friday", label: "Sex", dayOfWeek: 5 },
  { key: "saturday", label: "Sáb", dayOfWeek: 6 },
] as const;

interface WeeklyScheduleFieldProps {
  field: GenericFormField;
  formData: FormDataType;
  fieldLabel: string;
  handleChange: (name: string, value: FieldValue) => void;
}

interface ValidationError {
  type: "missing_end" | "missing_start" | "invalid_range" | "invalid_format";
  message: string;
}

// Utilitários para validação de horário
const parseTime = (timeString: string): number | null => {
  if (!timeString || !timeString.match(/^\d{2}:\d{2}$/)) return null;
  const [hours, minutes] = timeString.split(':').map(Number);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  return hours * 60 + minutes;
};

const isValidTimeRange = (startTime: string, endTime: string): boolean => {
  const start = parseTime(startTime);
  const end = parseTime(endTime);
  if (start === null || end === null) return false;
  return start < end;
};

export default function WeeklyScheduleField({
  field,
  formData,
  fieldLabel,
  handleChange
}: WeeklyScheduleFieldProps) {
  const {
    confirm,
    ConfirmDialogComponent
  } = useConfirm();
  const [expanded, setExpanded] = useState(false);
  const [errors, setErrors] = useState<{ [day: string]: ValidationError | null }>({});
  const [timePickerState, setTimePickerState] = useState<{
    dayKey: string;
    type: "startTime" | "endTime";
    show: boolean;
    currentTime: Date;
  }>({ dayKey: "", type: "startTime", show: false, currentTime: new Date() });

  const currentSchedule = useMemo(() => {
    return (formData[field.name] as DailyWorkingHour[]) || [];
  }, [formData, field.name]);


  // Função para obter horário atual de um dia específico
  const getScheduleByDay = (dayOfWeek: number): DailyWorkingHour | undefined => {
    return currentSchedule.find((entry: DailyWorkingHour) => entry.dayOfWeek === dayOfWeek);
  };

  // Função para validar um dia específico
  const validateDay = (dayKey: string, startTime: string, endTime: string): ValidationError | null => {
    if (startTime && !endTime) {
      return { type: "missing_end", message: "Informe também o horário de fim" };
    }

    if (endTime && !startTime) {
      return { type: "missing_start", message: "Informe também o horário de início" };
    }

    if (startTime && endTime) {
      if (!isValidTimeRange(startTime, endTime)) {
        return { type: "invalid_range", message: "Horário de início deve ser menor que o de fim" };
      }
    }

    return null;
  };

  // Atualizar validações quando o schedule mudar
  useEffect(() => {
    const newErrors: { [day: string]: ValidationError | null } = {};

    weekdays.forEach((day) => {
      const schedule = getScheduleByDay(day.dayOfWeek);
      if (schedule) {
        const error = validateDay(day.key, schedule.startTime || "", schedule.endTime || "");
        newErrors[day.key] = error;
      }
    });

    // evita loop se não mudou nada
    if (JSON.stringify(newErrors) !== JSON.stringify(errors)) {
      setErrors(newErrors);
    }
  }, [currentSchedule]);


  const showPicker = (dayKey: string, type: "startTime" | "endTime") => {
    const day = weekdays.find(d => d.key === dayKey);
    if (!day) return;

    const schedule = getScheduleByDay(day.dayOfWeek);
    let initialTime = new Date();

    if (schedule && schedule[type]) {
      const [hours, minutes] = schedule[type].split(':').map(Number);
      initialTime.setHours(hours, minutes, 0, 0);
    } else {
      // Horários padrão sugeridos
      if (type === "startTime") {
        initialTime.setHours(8, 0, 0, 0);
      } else {
        initialTime.setHours(17, 0, 0, 0);
      }
    }

    setTimePickerState({
      dayKey,
      type,
      show: true,
      currentTime: initialTime
    });
  };

  const clearDay = async (dayKey: string) => {
    const day = weekdays.find((d) => d.key === dayKey);
    if (!day) return;

    const confirmDelete = await confirm({
      title: "Remover horário",
      message: `Deseja remover o horário de ${day.label}?`,
      cancelText: "Cancelar",
      confirmText: "Remover",
    })

    if (!confirmDelete) return;

    const updated = currentSchedule.filter(
      (entry: DailyWorkingHour) => entry.dayOfWeek !== day.dayOfWeek
    );
    handleChange(field.name, updated);
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
    const day = weekdays.find((d) => d.key === dayKey);
    if (!day) {
      setTimePickerState({ ...timePickerState, show: false });
      return;
    }

    // Criar uma cópia atualizada do schedule
    let updatedSchedule: DailyWorkingHour[] = [...currentSchedule];
    const existingIndex = updatedSchedule.findIndex((entry) => entry.dayOfWeek === day.dayOfWeek);

    if (existingIndex >= 0) {
      // Atualizar entrada existente
      updatedSchedule[existingIndex] = {
        ...updatedSchedule[existingIndex],
        [type]: timeString,
      };
    } else {
      // Criar nova entrada
      const newEntry: DailyWorkingHour = {
        dayOfWeek: day.dayOfWeek,
        startTime: type === "startTime" ? timeString : "",
        endTime: type === "endTime" ? timeString : "",
      };
      updatedSchedule.push(newEntry);
    }

    // Ordenar por dia da semana
    updatedSchedule.sort((a, b) => a.dayOfWeek - b.dayOfWeek);

    handleChange(field.name, updatedSchedule);
    setTimePickerState({ ...timePickerState, show: false });
  };

  const copyToAllDays = async (sourceDayKey: string) => {
    const sourceDay = weekdays.find(d => d.key === sourceDayKey);
    if (!sourceDay) return;

    const sourceSchedule = getScheduleByDay(sourceDay.dayOfWeek);
    if (!sourceSchedule?.startTime || !sourceSchedule?.endTime) return;

    const confirmCopy = await confirm({
      title: "Copiar horário",
      message: `Copiar o horário de ${sourceDay.label} (${sourceSchedule.startTime}h às ${sourceSchedule.endTime}h) para todos os dias?`,
      cancelText: "Cancelar",
      confirmText: "Copiar",
    });

    if (!confirmCopy) return;

    const newSchedule = weekdays.map(day => ({
      dayOfWeek: day.dayOfWeek,
      startTime: sourceSchedule.startTime,
      endTime: sourceSchedule.endTime,
    }));
    handleChange(field.name, newSchedule);
  };

  const hasAnySchedule = currentSchedule.some(
    (entry: DailyWorkingHour) => entry?.startTime || entry?.endTime
  );

  const getActiveDaysCount = () => {
    return currentSchedule.filter(entry => entry.startTime && entry.endTime).length;
  };

  const renderQuickActions = () => {
    const commonSchedules = [
      { name: "Seg-Sex 8h-17h", days: [1, 2, 3, 4, 5], start: "08:00", end: "17:00" },
      { name: "Seg-Sex 9h-18h", days: [1, 2, 3, 4, 5], start: "09:00", end: "18:00" },
      { name: "Seg-Sáb 8h-17h", days: [1, 2, 3, 4, 5, 6], start: "08:00", end: "17:00" },
      { name: "Todos os dias 8h-17h", days: [0, 1, 2, 3, 4, 5, 6], start: "08:00", end: "17:00" },
    ];

    return (
      <View style={styles.quickActions}>
        <Text style={styles.quickActionsTitle}>Modelos rápidos:</Text>
        <View style={styles.quickActionsContainer}>
          {commonSchedules.map((schedule, index) => (
            <Chip
              key={index}
              mode="outlined"
              style={styles.quickActionChip}
              onPress={() => {
                const newSchedule = schedule.days.map(dayOfWeek => ({
                  dayOfWeek,
                  startTime: schedule.start,
                  endTime: schedule.end,
                }));
                handleChange(field.name, newSchedule);
              }}
            >
              {schedule.name}
            </Chip>
          ))}
        </View>
      </View>
    );
  };

  const renderSummary = () => {
    if (!hasAnySchedule) {
      return (
        <View style={styles.emptyState}>
          <MaterialIcons name="schedule" size={24} color="#999" />
          <Text style={styles.emptyStateText}>
            {field.placeholder || "Nenhum horário definido. Será utilizado o horário da empresa."}
          </Text>
        </View>
      );
    }

    const activeDays = getActiveDaysCount();

    return (
      <View style={styles.summaryContainer}>
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryTitle}>
            {activeDays} {activeDays === 1 ? 'dia configurado' : 'dias configurados'}
          </Text>
        </View>

        <View style={styles.summaryGrid}>
          {weekdaysShort.map((day) => {
            const schedule = getScheduleByDay(day.dayOfWeek);
            const isActive = schedule?.startTime && schedule?.endTime;

            return (
              isActive && <View key={day.key} style={[styles.summaryDay, isActive && styles.summaryDayActive]}>
                <Text style={[styles.summaryDayLabel, isActive && styles.summaryDayLabelActive]}>
                  {day.label}
                </Text>
                {isActive && (
                  <Text style={styles.summaryDayTime}>
                    {schedule?.startTime}-{schedule?.endTime}h
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View key={field.name} style={{ gap: 12 }}>
      <Text style={styles.label}>{fieldLabel}</Text>

      <View style={styles.container}>
        {renderSummary()}

        <Button
          mode="text"
          onPress={() => setExpanded((prev) => !prev)}
          style={{ marginTop: 8 }}
          icon={expanded ? "chevron-up" : "chevron-down"}
        >
          {expanded ? "Fechar edição" : "Editar horários"}
        </Button>
      </View>

      {expanded && (
        <View style={{ gap: 16, marginBottom: 96 }}>
          {renderQuickActions()}

          <View style={{ gap: 12 }}>
            {weekdays.map((day) => {
              const schedule = getScheduleByDay(day.dayOfWeek);
              const start = schedule?.startTime || "";
              const end = schedule?.endTime || "";
              const hasError = errors[day.key] !== null && errors[day.key] !== undefined;

              return (
                <GenericalCard
                  key={day.key}
                  containerStyle={{
                    ...styles.dayCard,
                    ...(hasError ? styles.dayCardError : {}),
                  }}
                >
                  <View style={styles.dayHeader}>
                    <Text style={styles.dayLabel}>{day.label}</Text>
                    {(start && end && !hasError) && (
                      <Pressable
                        onPress={() => copyToAllDays(day.key)}
                        style={styles.copyButton}
                      >
                        <MaterialIcons name="content-copy" size={16} color={Colors.light.mainColor} />
                        <Text style={styles.copyButtonText}>Copiar para todos</Text>
                      </Pressable>
                    )}
                  </View>

                  <View style={styles.timeInputs}>
                    <Button
                      mode="outlined"
                      style={[styles.timeButton, start && styles.timeButtonFilled]}
                      onPress={() => showPicker(day.key, "startTime")}
                      icon="clock-outline"
                    >
                      {start ? start : "Início"}
                    </Button>

                    <MaterialIcons name="arrow-forward" size={20} color="#999" />

                    <Button
                      mode="outlined"
                      style={[styles.timeButton, end && styles.timeButtonFilled]}
                      onPress={() => showPicker(day.key, "endTime")}
                      icon="clock-outline"
                    >
                      {end ? end : "Fim"}
                    </Button>

                    {(start || end) && (
                      <Pressable onPress={() => clearDay(day.key)} style={styles.deleteButton}>
                        <Ionicons name="trash-bin-outline" size={20} color="#d00" />
                      </Pressable>
                    )}
                  </View>

                  {hasError && (
                    <HelperText type="error" visible={hasError}>
                      {errors[day.key]?.message}
                    </HelperText>
                  )}
                </GenericalCard>
              );
            })}
          </View>
        </View>
      )}

      {timePickerState.show && (
        <DateTimePicker
          mode="time"
          value={timePickerState.currentTime}
          is24Hour
          display="default"
          onChange={handleTimeChange}
        />
      )}

      {ConfirmDialogComponent}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 4,
  },
  container: {
    borderColor: Colors.light.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    backgroundColor: Colors.light.background,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 16,
  },
  emptyStateText: {
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
  summaryContainer: {
    gap: 12,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.light.text,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  summaryDay: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 8,
    minWidth: 45,
    alignItems: "center",
  },
  summaryDayActive: {
    backgroundColor: Colors.light.mainColor + "20",
    borderWidth: 1,
    borderColor: Colors.light.mainColor + "40",
  },
  summaryDayLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
  },
  summaryDayLabelActive: {
    color: Colors.light.mainColor,
  },
  summaryDayTime: {
    fontSize: 10,
    color: Colors.light.mainColor,
    marginTop: 2,
  },
  quickActions: {
    gap: 8,
  },
  quickActionsTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.light.text,
  },
  quickActionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  quickActionChip: {
    backgroundColor: "transparent",
  },
  dayCard: {
    marginHorizontal: 0,
    gap: 12,
  },
  dayCardError: {
    borderColor: "#d00",
    borderWidth: 1,
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dayLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.light.text,
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: Colors.light.mainColor + "10",
  },
  copyButtonText: {
    fontSize: 12,
    color: Colors.light.mainColor,
  },
  timeInputs: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  timeButton: {
    flex: 1,
  },
  timeButtonFilled: {
    backgroundColor: Colors.light.mainColor + "10",
  },
  deleteButton: {
    padding: 8,
  },
});