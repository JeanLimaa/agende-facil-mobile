import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { Modal, Portal, Button, Card, TextInput, Switch } from "react-native-paper";
import { Colors } from "@/shared/constants/Colors";
import { Category, CategoryWorkingHour } from "@/shared/types/category.interface";
import { DailyWorkingHour } from "@/shared/types/working-hours.interface";

interface CategoryWorkingHoursModalProps {
  visible: boolean;
  onClose: () => void;
  category: Category;
  initialHours: CategoryWorkingHour[];
  onSave: (hours: DailyWorkingHour[]) => void;
  loading: boolean;
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
  loading
}: CategoryWorkingHoursModalProps) {
  const [workingHours, setWorkingHours] = useState<DailyWorkingHour[]>([]);
  const [enabledDays, setEnabledDays] = useState<{ [key: number]: boolean }>({});

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

  const handleTimeChange = (dayOfWeek: number, field: 'startTime' | 'endTime', value: string) => {
    setWorkingHours(prev => prev.map(hour => 
      hour.dayOfWeek === dayOfWeek 
        ? { ...hour, [field]: value }
        : hour
    ));
  };

  const handleSave = () => {
    // Validar horários
    const invalidHours = workingHours.filter(hour => {
      const start = hour.startTime.split(':').map(Number);
      const end = hour.endTime.split(':').map(Number);
      const startMinutes = start[0] * 60 + start[1];
      const endMinutes = end[0] * 60 + end[1];
      return startMinutes >= endMinutes;
    });

    if (invalidHours.length > 0) {
      alert('Horário de início deve ser anterior ao horário de término em todos os dias.');
      return;
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
            Configurar Horários
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 20, color: Colors.light.textSecondary }}>
            {category?.name}
          </Text>

          <ScrollView style={{ maxHeight: 400 }}>
            {DAYS_OF_WEEK.map((day) => {
              const hour = getHourForDay(day.number);
              const isDayEnabled = enabledDays[day.number];
              
              return (
                <Card key={day.number} style={{ marginBottom: 12 }}>
                  <Card.Content>
                    <View style={{ 
                      flexDirection: 'row', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: isDayEnabled ? 12 : 0
                    }}>
                      <Text style={{ fontSize: 16, fontWeight: '500' }}>
                        {day.name}
                      </Text>
                      <Switch
                        value={isDayEnabled}
                        onValueChange={(enabled) => handleDayToggle(day.number, enabled)}
                      />
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
    </Portal>
  );
}