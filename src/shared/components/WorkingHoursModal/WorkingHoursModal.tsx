import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { Modal, Portal, Button, Card, TextInput, Switch, IconButton } from "react-native-paper";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from "@/shared/constants/Colors";
import { DailyWorkingHour, WorkingHours } from "@/shared/types/working-hours.interface";
import { Employee } from "@/shared/types/employee.interface";
import { CompanyWorkingHours } from "@/shared/types/company.types";
import { useConfirm } from "@/shared/hooks/useConfirm";

type WorkingHoursType = 'company' | 'employee' | 'category';

interface WorkingHoursModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  initialHours: DailyWorkingHour[] | WorkingHours[];
  onSave: (hours: DailyWorkingHour[]) => void;
  loading: boolean;
  type: WorkingHoursType;
  employee?: Employee;
  companyWorkingHours?: CompanyWorkingHours;
}

const DAYS_OF_WEEK = [
  { number: 0, name: 'Domingo', short: 'Dom' },
  { number: 1, name: 'Segunda-feira', short: 'Seg' },
  { number: 2, name: 'Terça-feira', short: 'Ter' },
  { number: 3, name: 'Quarta-feira', short: 'Qua' },
  { number: 4, name: 'Quinta-feira', short: 'Qui' },
  { number: 5, name: 'Sexta-feira', short: 'Sex' },
  { number: 6, name: 'Sábado', short: 'Sáb' },
];

export function WorkingHoursModal({
  visible,
  onClose,
  title,
  subtitle,
  initialHours,
  onSave,
  loading,
  type,
  employee,
  companyWorkingHours
}: WorkingHoursModalProps) {
  const [workingHours, setWorkingHours] = useState<DailyWorkingHour[]>([]);
  const [enabledDays, setEnabledDays] = useState<{ [key: number]: boolean }>({});
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerData, setTimePickerData] = useState<{
    dayOfWeek: number;
    field: 'startTime' | 'endTime';
    currentTime: Date;
  } | null>(null);
  const { confirm, ConfirmDialogComponent } = useConfirm();

  useEffect(() => {
    if (visible) {
      // Convert initial hours to the expected format
      const hoursArray = initialHours?.map(h => ({
        dayOfWeek: h.dayOfWeek,
        startTime: h.startTime,
        endTime: h.endTime
      })) || [];
      
      setWorkingHours(hoursArray);

      // Initialize enabled days
      const enabled: { [key: number]: boolean } = {};
      DAYS_OF_WEEK.forEach(day => {
        enabled[day.number] = hoursArray.some(h => h.dayOfWeek === day.number) || false;
      });
      setEnabledDays(enabled);
    }
  }, [visible, initialHours]);

  const handleDayToggle = (dayOfWeek: number, enabled: boolean) => {
    setEnabledDays(prev => ({ ...prev, [dayOfWeek]: enabled }));
    
    if (enabled) {
      // Add default hours for this day
      const existingHour = workingHours.find(h => h.dayOfWeek === dayOfWeek);
      if (!existingHour) {
        const defaultHours = getDefaultHoursForDay(dayOfWeek);
        setWorkingHours(prev => [...prev, {
          dayOfWeek,
          startTime: defaultHours.startTime,
          endTime: defaultHours.endTime
        }]);
      }
    } else {
      // Remove hours for this day
      setWorkingHours(prev => prev.filter(h => h.dayOfWeek !== dayOfWeek));
    }
  };

  const getDefaultHoursForDay = (dayOfWeek: number) => {
    if (type === 'employee' && companyWorkingHours) {
      const companyHours = companyWorkingHours.workingHours?.find(h => h.dayOfWeek === dayOfWeek);
      if (companyHours) {
        return {
          startTime: companyHours.startTime,
          endTime: companyHours.endTime
        };
      }
    }
    
    // For category type, try to use employee hours as default
    if (type === 'category' && employee) {
      const employeeHours = employee.workingHours?.find(h => h.dayOfWeek === dayOfWeek);
      if (employeeHours) {
        return {
          startTime: employeeHours.startTime,
          endTime: employeeHours.endTime
        };
      }
    }

    // Default fallback
    return {
      startTime: '09:00',
      endTime: '18:00'
    };
  };

  const parseTimeToMinutes = (time: string): number => {
    if (!time || !time.includes(':')) return 0;
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const isTimeWithinRange = (time: string, startTime: string, endTime: string): boolean => {
    if (!time || !startTime || !endTime) return false;
    const timeMinutes = parseTimeToMinutes(time);
    const startMinutes = parseTimeToMinutes(startTime);
    const endMinutes = parseTimeToMinutes(endTime);
    return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
  };

  const getCompanyWorkingHoursForDay = (dayOfWeek: number) => {
    return companyWorkingHours?.workingHours?.find(h => h.dayOfWeek === dayOfWeek);
  };

  const getEmployeeWorkingHoursForDay = (dayOfWeek: number) => {
    return employee?.workingHours?.find(h => h.dayOfWeek === dayOfWeek);
  };

  const validateHierarchicalConstraints = (dayOfWeek: number, startTime: string, endTime: string): string | null => {
    if (!startTime || !endTime) return null;

    // For employee type: validate against company hours
    if (type === 'employee') {
      const companyHours = getCompanyWorkingHoursForDay(dayOfWeek);
      if (!companyHours) {
        return 'A empresa não funciona neste dia da semana.';
      }

      const employeeStartOk = isTimeWithinRange(startTime, companyHours.startTime, companyHours.endTime);
      const employeeEndOk = isTimeWithinRange(endTime, companyHours.startTime, companyHours.endTime);
      
      if (!employeeStartOk || !employeeEndOk) {
        return `A empresa funciona das ${companyHours.startTime} às ${companyHours.endTime} neste dia.`;
      }
    }

    // For category type: validate against both company and employee hours
    if (type === 'category') {
      const companyHours = getCompanyWorkingHoursForDay(dayOfWeek);
      if (!companyHours) {
        return 'A empresa não funciona neste dia da semana.';
      }

      const categoryStartOk = isTimeWithinRange(startTime, companyHours.startTime, companyHours.endTime);
      const categoryEndOk = isTimeWithinRange(endTime, companyHours.startTime, companyHours.endTime);
      
      if (!categoryStartOk || !categoryEndOk) {
        return `A empresa funciona das ${companyHours.startTime} às ${companyHours.endTime} neste dia.`;
      }

      const employeeHours = getEmployeeWorkingHoursForDay(dayOfWeek);
      if (!employeeHours) {
        return 'O funcionário não trabalha neste dia da semana.';
      }

      const employeeStartOk = isTimeWithinRange(startTime, employeeHours.startTime, employeeHours.endTime);
      const employeeEndOk = isTimeWithinRange(endTime, employeeHours.startTime, employeeHours.endTime);
      
      if (!employeeStartOk || !employeeEndOk) {
        return `O funcionário trabalha das ${employeeHours.startTime} às ${employeeHours.endTime} neste dia.`;
      }
    }

    return null;
  };

  const getValidationMessage = (dayOfWeek: number): string | null => {
    if (type === 'company') return null;

    if (type === 'employee') {
      const companyHours = getCompanyWorkingHoursForDay(dayOfWeek);
      if (!companyHours) {
        return 'Empresa fechada neste dia';
      }
      return null;
    }

    if (type === 'category') {
      const companyHours = getCompanyWorkingHoursForDay(dayOfWeek);
      if (!companyHours) {
        return 'Empresa fechada neste dia';
      }

      const employeeHours = getEmployeeWorkingHoursForDay(dayOfWeek);
      if (!employeeHours) {
        return 'Funcionário não trabalha neste dia';
      }
    }

    return null;
  };

  const getAvailableTimeRange = (dayOfWeek: number): string | null => {
    if (type === 'company') return null; // Sem restrições para empresa

    if (type === 'employee') {
      const companyHours = getCompanyWorkingHoursForDay(dayOfWeek);
      if (!companyHours) return null;
      return `${companyHours.startTime} - ${companyHours.endTime}`;
    }

    if (type === 'category') {
      const companyHours = getCompanyWorkingHoursForDay(dayOfWeek);
      const employeeHours = getEmployeeWorkingHoursForDay(dayOfWeek);
      
      if (!companyHours || !employeeHours) return null;

      // Calcular interseção dos horários
      const companyStart = parseTimeToMinutes(companyHours.startTime);
      const companyEnd = parseTimeToMinutes(companyHours.endTime);
      const employeeStart = parseTimeToMinutes(employeeHours.startTime);
      const employeeEnd = parseTimeToMinutes(employeeHours.endTime);

      const availableStart = Math.max(companyStart, employeeStart);
      const availableEnd = Math.min(companyEnd, employeeEnd);

      if (availableStart >= availableEnd) return null;

      const formatTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60).toString().padStart(2, '0');
        const mins = (minutes % 60).toString().padStart(2, '0');
        return `${hours}:${mins}`;
      };

      return `${formatTime(availableStart)} - ${formatTime(availableEnd)}`;
    }

    return null;
  };

  const copyHoursToAllDays = async (sourceDayOfWeek: number) => {
    const sourceHour = workingHours.find(h => h.dayOfWeek === sourceDayOfWeek);
    if (!sourceHour || !sourceHour.startTime || !sourceHour.endTime) {
      Alert.alert('Erro', 'Por favor, configure primeiro o horário completo para este dia.');
      return;
    }

    const confirmCopy = await confirm({
      title: 'Copiar Horários',
      message: `Deseja copiar o horário ${sourceHour.startTime} - ${sourceHour.endTime} para todos os outros dias?`,
      confirmText: "Copiar",
      cancelText: "Cancelar"
    });

    if (!confirmCopy) return;

    // Valida se algum dia não pode receber esses horários
    const validationErrors: string[] = [];
    DAYS_OF_WEEK.forEach(day => {
      if (day.number !== sourceDayOfWeek) {
        const error = validateHierarchicalConstraints(day.number, sourceHour.startTime, sourceHour.endTime);
        if (error) {
          validationErrors.push(`${day.name}: ${error}`);
        }
      }
    });

    if (validationErrors.length > 0) {
      Alert.alert(
        'Alguns dias não podem usar este horário',
        validationErrors.join('\n\n') + '\n\nDeseja copiar apenas para os dias válidos?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Copiar válidos', 
            onPress: () => copyToValidDaysOnly(sourceHour)
          }
        ]
      );
      return;
    }

    // Habilita todos os dias e copia os horários
    const newEnabledDays: { [key: number]: boolean } = {};
    DAYS_OF_WEEK.forEach(day => {
      newEnabledDays[day.number] = true;
    });
    setEnabledDays(newEnabledDays);

    // Copia os horários para todos os dias
    const newWorkingHours = DAYS_OF_WEEK.map(day => ({
      dayOfWeek: day.number,
      startTime: sourceHour.startTime,
      endTime: sourceHour.endTime
    }));
    setWorkingHours(newWorkingHours);
  };

  const copyToValidDaysOnly = (sourceHour: DailyWorkingHour) => {
    const newEnabledDays = { ...enabledDays };
    const newWorkingHours: DailyWorkingHour[] = [...workingHours];

    DAYS_OF_WEEK.forEach(day => {
      if (day.number !== sourceHour.dayOfWeek) {
        const error = validateHierarchicalConstraints(day.number, sourceHour.startTime, sourceHour.endTime);
        if (!error) {
          newEnabledDays[day.number] = true;
          const existingIndex = newWorkingHours.findIndex(h => h.dayOfWeek === day.number);
          if (existingIndex >= 0) {
            newWorkingHours[existingIndex] = {
              dayOfWeek: day.number,
              startTime: sourceHour.startTime,
              endTime: sourceHour.endTime
            };
          } else {
            newWorkingHours.push({
              dayOfWeek: day.number,
              startTime: sourceHour.startTime,
              endTime: sourceHour.endTime
            });
          }
        }
      }
    });

    setEnabledDays(newEnabledDays);
    setWorkingHours(newWorkingHours);
  };

  const validateTimeFormat = (time: string): boolean => {
    if (!time) return true; 
    
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
    return timeRegex.test(time);
  };

  const showTimePickerModal = (dayOfWeek: number, field: 'startTime' | 'endTime') => {
    const currentHour = workingHours.find(h => h.dayOfWeek === dayOfWeek);
    let initialTime = new Date();
    
    if (currentHour && currentHour[field]) {
      const [hours, minutes] = currentHour[field].split(':').map(Number);
      initialTime.setHours(hours, minutes, 0, 0);
    } else {
      initialTime.setHours(field === 'startTime' ? 8 : 17, 0, 0, 0);
    }

    setTimePickerData({ dayOfWeek, field, currentTime: initialTime });
    setShowTimePicker(true);
  };

  const handleTimePickerChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    
    if (selectedTime && timePickerData) {
      const hours = selectedTime.getHours().toString().padStart(2, '0');
      const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}`;

      setWorkingHours(prev => prev.map(hour => 
        hour.dayOfWeek === timePickerData.dayOfWeek 
          ? { ...hour, [timePickerData.field]: timeString }
          : hour
      ));
    }
    
    setTimePickerData(null);
  };

  const handleSave = () => {
    const invalidFormatHours = workingHours.filter(hour => {
      return !validateTimeFormat(hour.startTime) || !validateTimeFormat(hour.endTime);
    });

    if (invalidFormatHours.length > 0) {
      Alert.alert('Formato Inválido', 'Por favor, insira horários válidos no formato HH:mm (ex: 09:00).');
      return;
    }

    const incompleteHours = workingHours.filter(hour => {
      return (hour.startTime && !hour.endTime) || (!hour.startTime && hour.endTime);
    });

    if (incompleteHours.length > 0) {
      Alert.alert('Horários Incompletos', 'Por favor, preencha tanto o horário de início quanto o de fim para todos os dias.');
      return;
    }

    const invalidRangeHours = workingHours.filter(hour => {
      if (!hour.startTime || !hour.endTime) return false;
      
      const start = hour.startTime.split(':').map(Number);
      const end = hour.endTime.split(':').map(Number);
      const startMinutes = start[0] * 60 + start[1];
      const endMinutes = end[0] * 60 + end[1];
      return startMinutes >= endMinutes;
    });

    if (invalidRangeHours.length > 0) {
      Alert.alert('Horários Inválidos', 'O horário de início deve ser anterior ao horário de término em todos os dias.');
      return;
    }

    if (type !== 'company') {
      const hierarchicalErrors: string[] = [];
      workingHours.forEach(hour => {
        if (hour.startTime && hour.endTime) {
          const error = validateHierarchicalConstraints(hour.dayOfWeek, hour.startTime, hour.endTime);
          if (error) {
            const dayName = DAYS_OF_WEEK.find(d => d.number === hour.dayOfWeek)?.name;
            hierarchicalErrors.push(`${dayName}: ${error}`);
          }
        }
      });

      if (hierarchicalErrors.length > 0) {
        Alert.alert(
          'Horários Inválidos',
          'Os seguintes horários estão fora dos períodos permitidos:\n\n' + hierarchicalErrors.join('\n'),
          [{ text: 'OK' }]
        );
        return;
      }
    }

    onSave(workingHours);
  };

  const getHourForDay = (dayOfWeek: number) => {
    return workingHours.find(h => h.dayOfWeek === dayOfWeek);
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={{
          backgroundColor: 'white',
          margin: 20,
          borderRadius: 10,
          maxHeight: '80%'
        }}
      >
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
            {title}
          </Text>
          {subtitle && (
            <Text style={{ fontSize: 16, marginBottom: 20, color: Colors.light.textSecondary }}>
              {subtitle}
            </Text>
          )}

          <ScrollView style={{ maxHeight: 400 }}>
            {DAYS_OF_WEEK.map((day) => {
              const hour = getHourForDay(day.number);
              const isDayEnabled = enabledDays[day.number];
              const validationMessage = getValidationMessage(day.number);
              const availableRange = getAvailableTimeRange(day.number);
              const isInvalidDay = !!validationMessage;
              
              return (
                <Card key={day.number} style={{ 
                  marginBottom: 12,
                  backgroundColor: isInvalidDay ? '#FFEBEE' : 'white'
                }}>
                  <Card.Content>
                    <View style={{ 
                      flexDirection: 'row', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: isDayEnabled ? 12 : 0
                    }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: '500' }}>
                          {day.name}
                        </Text>
                        {availableRange && (
                          <Text style={{ fontSize: 12, color: Colors.light.textSecondary }}>
                            Disponível: {availableRange}
                          </Text>
                        )}
                        {validationMessage && (
                          <Text style={{ fontSize: 12, color: '#D32F2F', marginTop: 2 }}>
                            {validationMessage}
                          </Text>
                        )}
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        {isDayEnabled && hour && hour.startTime && hour.endTime && !isInvalidDay && (
                          <IconButton
                            icon="content-copy"
                            iconColor={Colors.light.mainColor}
                            size={20}
                            onPress={() => copyHoursToAllDays(day.number)}
                            style={{ margin: 0 }}
                          />
                        )}
                        <Switch
                          value={isDayEnabled}
                          onValueChange={(enabled) => handleDayToggle(day.number, enabled)}
                          disabled={isInvalidDay}
                        />
                      </View>
                    </View>
                    
                    {isDayEnabled && hour && (
                      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 12, marginBottom: 4 }}>Início</Text>
                          <TouchableOpacity 
                            onPress={() => showTimePickerModal(day.number, 'startTime')}
                            style={[
                              styles.timeButton,
                              hour.startTime ? styles.timeButtonFilled : styles.timeButtonEmpty
                            ]}
                          >
                            <Text style={[
                              styles.timeButtonText,
                              hour.startTime ? styles.timeButtonTextFilled : styles.timeButtonTextEmpty
                            ]}>
                              {hour.startTime || '09:00'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <Text style={{ marginTop: 15 }}>às</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 12, marginBottom: 4 }}>Fim</Text>
                          <TouchableOpacity 
                            onPress={() => showTimePickerModal(day.number, 'endTime')}
                            style={[
                              styles.timeButton,
                              hour.endTime ? styles.timeButtonFilled : styles.timeButtonEmpty
                            ]}
                          >
                            <Text style={[
                              styles.timeButtonText,
                              hour.endTime ? styles.timeButtonTextFilled : styles.timeButtonTextEmpty
                            ]}>
                              {hour.endTime || '18:00'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </Card.Content>
                </Card>
              );
            })}
          </ScrollView>

          <View style={{ 
            flexDirection: 'row', 
            gap: 12, 
            marginTop: 20,
            justifyContent: 'flex-end'
          }}>
            <Button 
              mode="outlined" 
              onPress={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              mode="contained" 
              onPress={handleSave}
              loading={loading}
              disabled={loading}
            >
              Salvar
            </Button>
          </View>
        </View>
      </Modal>
      
      {showTimePicker && timePickerData && (
        <DateTimePicker
          value={timePickerData.currentTime}
          mode="time"
          is24Hour={true}
          display="spinner"
          onChange={handleTimePickerChange}
        />
      )}
      
      {ConfirmDialogComponent}
    </Portal>
  );
}

const styles = StyleSheet.create({
  timeButton: {
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  timeButtonFilled: {
    borderColor: Colors.light.mainColor,
    backgroundColor: Colors.light.mainColor + '10',
  },
  timeButtonEmpty: {
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  timeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  timeButtonTextFilled: {
    color: Colors.light.mainColor,
  },
  timeButtonTextEmpty: {
    color: '#666',
  },
});