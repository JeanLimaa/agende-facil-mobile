import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { Modal, Portal, Button, Card, TextInput, Switch, IconButton } from "react-native-paper";
import { Colors } from "@/shared/constants/Colors";
import { Category, CategoryWorkingHour } from "@/shared/types/category.interface";
import { DailyWorkingHour } from "@/shared/types/working-hours.interface";
import { Employee } from "@/shared/types/employee.interface";
import { CompanyWorkingHours } from "@/shared/types/company.types";
import { useConfirm } from "@/shared/hooks/useConfirm";

interface CategoryWorkingHoursModalProps {
  visible: boolean;
  onClose: () => void;
  category: Category;
  initialHours: CategoryWorkingHour[];
  onSave: (hours: DailyWorkingHour[]) => void;
  loading: boolean;
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

export function CategoryWorkingHoursModal({
  visible,
  onClose,
  category,
  initialHours,
  onSave,
  loading,
  employee,
  companyWorkingHours
}: CategoryWorkingHoursModalProps) {
  const [workingHours, setWorkingHours] = useState<DailyWorkingHour[]>([]);
  const [enabledDays, setEnabledDays] = useState<{ [key: number]: boolean }>({});
  const { confirm, ConfirmDialogComponent } = useConfirm();

  useEffect(() => {
    if (visible) {
      setWorkingHours(initialHours || []);

      // inicializa dias habilitados
      const enabled: { [key: number]: boolean } = {};
      DAYS_OF_WEEK.forEach(day => {
        enabled[day.number] = initialHours?.some(h => h.dayOfWeek === day.number) || false;
      });
      setEnabledDays(enabled);
    }
  }, [visible, initialHours]);

  const handleDayToggle = (dayOfWeek: number, enabled: boolean) => {
    setEnabledDays(prev => ({ ...prev, [dayOfWeek]: enabled }));
    
    if (enabled) {
      // Adiciona horários padrão para este dia
      const existingHour = workingHours.find(h => h.dayOfWeek === dayOfWeek);
      if (!existingHour) {
        setWorkingHours(prev => [...prev, {
          dayOfWeek,
          startTime: '09:00',
          endTime: '18:00'
        }]);
      }
    } else {
      // remove horarios para esse dia
      setWorkingHours(prev => prev.filter(h => h.dayOfWeek !== dayOfWeek));
    }
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

    // 1. Verificar se a empresa está aberta neste dia
    const companyHours = getCompanyWorkingHoursForDay(dayOfWeek);
    if (!companyHours) {
      return 'A empresa não funciona neste dia da semana.';
    }

    // 2. Verificar se os horários estão dentro do funcionamento da empresa
    const categoryStartOk = isTimeWithinRange(startTime, companyHours.startTime, companyHours.endTime);
    const categoryEndOk = isTimeWithinRange(endTime, companyHours.startTime, companyHours.endTime);
    
    if (!categoryStartOk || !categoryEndOk) {
      return `A empresa funciona das ${companyHours.startTime} às ${companyHours.endTime} neste dia.`;
    }

    // 3. Verificar se o funcionário está disponível neste dia
    const employeeHours = getEmployeeWorkingHoursForDay(dayOfWeek);
    if (!employeeHours) {
      return 'O funcionário não trabalha neste dia da semana.';
    }

    // 4. Verificar se os horários estão dentro da disponibilidade do funcionário
    const employeeStartOk = isTimeWithinRange(startTime, employeeHours.startTime, employeeHours.endTime);
    const employeeEndOk = isTimeWithinRange(endTime, employeeHours.startTime, employeeHours.endTime);
    
    if (!employeeStartOk || !employeeEndOk) {
      return `O funcionário trabalha das ${employeeHours.startTime} às ${employeeHours.endTime} neste dia.`;
    }

    return null; // Tudo válido
  };

  const copyHoursToAllDays = async (sourceDayOfWeek: number) => {
    const sourceHour = workingHours.find(h => h.dayOfWeek === sourceDayOfWeek);
    if (!sourceHour || !sourceHour.startTime || !sourceHour.endTime) {
      await confirm({
        title: 'Erro',
        message: 'Por favor, configure primeiro o horário completo para este dia.',
        confirmText: 'OK'
      })
      return;
    }

    const confirmCopy = await confirm({
      title: "Copiar Horários",
      message: `Deseja copiar o horário ${sourceHour.startTime} - ${sourceHour.endTime} para todos os outros dias?`,
      confirmText: "Copiar",
      cancelText: "Cancelar"
    });

    if (!confirmCopy) return;

    // Ativar todos os dias
    const newEnabledDays: { [key: number]: boolean } = {};
    DAYS_OF_WEEK.forEach(day => {
      newEnabledDays[day.number] = true;
    });
    setEnabledDays(newEnabledDays);

    // Copiar horários para todos os dias
    const newWorkingHours = DAYS_OF_WEEK.map(day => ({
      dayOfWeek: day.number,
      startTime: sourceHour.startTime,
      endTime: sourceHour.endTime
    }));
    setWorkingHours(newWorkingHours);
  };

  const formatTimeInput = (value: string): string => {
    // Remove caracteres não numéricos
    const numericValue = value.replace(/[^\d]/g, '');
    
    // Limita a 4 dígitos
    const limitedValue = numericValue.slice(0, 4);
    
    // Formata como HH:mm
    if (limitedValue.length <= 2) {
      return limitedValue;
    } else {
      return `${limitedValue.slice(0, 2)}:${limitedValue.slice(2)}`;
    }
  };

  const validateTimeFormat = (time: string): boolean => {
    if (!time) return true; // Campo vazio é válido
    
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
    return timeRegex.test(time);
  };

  const handleTimeChange = (dayOfWeek: number, field: 'startTime' | 'endTime', value: string) => {
    const formattedValue = formatTimeInput(value);
    
    setWorkingHours(prev => prev.map(hour => 
      hour.dayOfWeek === dayOfWeek 
        ? { ...hour, [field]: formattedValue }
        : hour
    ));
  };

  const handleSave = async () => {
    // Validar formato dos horários
    const invalidFormatHours = workingHours.filter(hour => {
      return !validateTimeFormat(hour.startTime) || !validateTimeFormat(hour.endTime);
    });

    if (invalidFormatHours.length > 0) {
      await confirm({
        title: 'Erro',
        message: 'Por favor, insira horários válidos no formato HH:mm (ex: 09:00).',
        confirmText: 'OK'
      })
      return;
    }

    // Validar se horários estão completos
    const incompleteHours = workingHours.filter(hour => {
      return (hour.startTime && !hour.endTime) || (!hour.startTime && hour.endTime);
    });

    if (incompleteHours.length > 0) {
      await confirm({
        title: 'Erro',
        message: 'Por favor, preencha tanto o horário de início quanto o de fim para todos os dias.',
        confirmText: 'OK'
      })
      return;
    }

    // Validar se horário de início é anterior ao de fim
    const invalidRangeHours = workingHours.filter(hour => {
      if (!hour.startTime || !hour.endTime) return false;
      
      const start = hour.startTime.split(':').map(Number);
      const end = hour.endTime.split(':').map(Number);
      const startMinutes = start[0] * 60 + start[1];
      const endMinutes = end[0] * 60 + end[1];
      return startMinutes >= endMinutes;
    });

    if (invalidRangeHours.length > 0) {
      await confirm({
        title: 'Erro',
        message: 'O horário de início deve ser anterior ao horário de término em todos os dias.',
        confirmText: 'OK'
      });
      return;
    }

    // Validar restrições hierárquicas (empresa -> funcionário -> categoria)
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
      await confirm({
        title: 'Erro',
        message: 'Os seguintes horários estão fora dos períodos permitidos:\n\n' + hierarchicalErrors.join('\n'),
        confirmText: 'OK'
      });
      return;
    }

    onSave(workingHours);
  };

  const getValidationMessage = (dayOfWeek: number): string | null => {
    // Checa se a empresa funciona neste dia
    const companyHours = getCompanyWorkingHoursForDay(dayOfWeek);
    if (!companyHours) {
      return 'Empresa fechada neste dia';
    }

    // Check se o funcionário trabalha neste dia
    const employeeHours = getEmployeeWorkingHoursForDay(dayOfWeek);
    if (!employeeHours) {
      return 'Funcionário não trabalha neste dia';
    }

    return null;
  };

  const getAvailableTimeRange = (dayOfWeek: number): string | null => {
    const companyHours = getCompanyWorkingHoursForDay(dayOfWeek);
    const employeeHours = getEmployeeWorkingHoursForDay(dayOfWeek);
    
    if (!companyHours || !employeeHours) return null;

    // Calcula a interseção dos horários da empresa e do funcionário
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
            Configurar Horários
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 20, color: Colors.light.textSecondary }}>
            {category?.name}
          </Text>

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
                          <TextInput
                            mode="outlined"
                            value={hour.startTime}
                            onChangeText={(value) => handleTimeChange(day.number, 'startTime', value)}
                            placeholder="09:00"
                            dense
                            keyboardType="numeric"
                            maxLength={5}
                            error={!!(hour.startTime && !validateTimeFormat(hour.startTime))}
                          />
                        </View>
                        <Text style={{ marginTop: 15 }}>às</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 12, marginBottom: 4 }}>Fim</Text>
                          <TextInput
                            mode="outlined"
                            value={hour.endTime}
                            onChangeText={(value) => handleTimeChange(day.number, 'endTime', value)}
                            placeholder="18:00"
                            dense
                            keyboardType="numeric"
                            maxLength={5}
                            error={!!(hour.endTime && !validateTimeFormat(hour.endTime))}
                          />
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

      {ConfirmDialogComponent}
    </Portal>
  );
}