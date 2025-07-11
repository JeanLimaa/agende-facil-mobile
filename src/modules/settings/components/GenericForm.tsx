import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet,
  Pressable,
} from "react-native";
import { Checkbox, Menu, TextInput, Button, Icon } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { Colors } from "@/shared/constants/Colors";
import { GenericalCard } from "@/shared/components/GenericalCard";
import { Ionicons } from "@expo/vector-icons";
import { useSettingsTabs } from "../contexts/SettingTabsContext";

interface Field {
  name: string;
  label: string;
  type: "text" | "number" | "email" | "tel" | "date" | "file" | "select" | "checkbox" | "text-area" | "header" | "weekly-schedule";
  placeholder?: string;
  options?: { label: string; value: string }[];
  onChange?: (value: any, allValues: Record<string, any>) => void;
  required?: boolean;
}

interface GenericFormProps {
  fields: Field[];
  tabKey: string
  
  initialValues?: Record<string, any>; 
  onChange?: (data: Record<string, any>) => void;
}

export type GenericFormRef = {
  getData: () => Record<string, any>;
};

export const GenericForm = ({ fields, initialValues, onChange, tabKey }: GenericFormProps) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [menuVisible, setMenuVisible] = useState<string | null>(null); // para abrir só um select de cada vez

  const { setTabData } = useSettingsTabs();

  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
    }
  }, [initialValues]);

  useEffect(() => {
    if (setTabData) {
      setTabData(tabKey, formData);
    }
  }, [formData, tabKey]);

  const handleChange = (name: string, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [name]: value };

      const fieldObj = fields.find(field => field.name === name);
      if (fieldObj && typeof fieldObj.onChange === "function") {
        fieldObj.onChange(value, updated);
      }

      if (onChange) {
        onChange(updated);
      }

      return updated;
    });
  };

  const handleFilePick = async (fieldName: string) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      handleChange(fieldName, uri);
    }
  };

  return (
    <View style={{ gap: 20 }}>
      {fields.map(field => {
        const fieldLabel = field.required ? `${field.label} *` : field.label;

        if (field.type === "date") {
          const [showDatePicker, setShowDatePicker] = useState(false);
          const currentValue = formData[field.name] || new Date();

          return (
            <View key={field.name}>
              <Text style={styles.label}>{fieldLabel}</Text>
              <Button onPress={() => setShowDatePicker(true)} mode="outlined">
                {formData[field.name]
                  ? new Date(formData[field.name]).toLocaleDateString()
                  : "Selecionar data"}
              </Button>

              {showDatePicker && (
                <DateTimePicker
                  value={new Date(currentValue)}
                  onChange={(_, date) => {
                    setShowDatePicker(false);
                    if (date) handleChange(field.name, date);
                  }}
                  mode="date"
                />
              )}
            </View>
          );
        }

        if (field.type === "file") {
          return (
            <View key={field.name}>
              <Text style={styles.label}>{fieldLabel}</Text>
              <Button mode="contained" onPress={() => handleFilePick(field.name)}>
                Selecionar Imagem
              </Button>
              {formData[field.name] && <Text>Imagem selecionada!</Text>}
            </View>
          );
        }

        if (field.type === "checkbox") {
          return (
            <View key={field.name} style={styles.checkboxContainer}>
              <View style={styles.checkBoxContainerRow}>
                <Checkbox
                  status={formData[field.name] ? "checked" : "unchecked"}
                  onPress={() => handleChange(field.name, !formData[field.name])}
                />
                <Text style={styles.checkboxLabel}>{fieldLabel}</Text>
              </View>

              <Text style={styles.placeholderLabel}>{field.placeholder}</Text>
            </View>
          );
        }

        if (field.type === "select" && field.options) {
          return (
            <View key={field.name}>
              <Text>{fieldLabel}</Text>
              <Menu
                visible={menuVisible === field.name}
                onDismiss={() => setMenuVisible(null)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setMenuVisible(field.name)}
                    style={{ justifyContent: "flex-start" }}
                  >
                    {formData[field.name]
                      ? field.options.find((opt) => opt.value === formData[field.name])?.label
                      : "Selecione"}
                  </Button>
                }
              >
                {field.options.map((option) => (
                  <Menu.Item
                    key={option.value}
                    onPress={() => {
                      handleChange(field.name, option.value);
                      setMenuVisible(null);
                    }}
                    title={option.label}
                  />
                ))}
              </Menu>
            </View>
          );
        }

        if (field.type === "header") {
          return (
            <Text key={field.name} style={styles.header}>
              {fieldLabel}
            </Text>
          );
        }

        if (field.type === "weekly-schedule") {
          const weekdays = [
            { key: "monday", label: "Segunda-feira" },
            { key: "tuesday", label: "Terça-feira" },
            { key: "wednesday", label: "Quarta-feira" },
            { key: "thursday", label: "Quinta-feira" },
            { key: "friday", label: "Sexta-feira" },
            { key: "saturday", label: "Sábado" },
            { key: "sunday", label: "Domingo" },
          ];

          const [expanded, setExpanded] = useState(false);
          const [errors, setErrors] = useState<{ [day: string]: string }>({});
          const [timePickerState, setTimePickerState] = useState<{
            dayKey: string;
            type: "start" | "end";
            show: boolean;
          }>({ dayKey: "", type: "start", show: false });

          const showPicker = (dayKey: string, type: "start" | "end") => {
            setTimePickerState({ dayKey, type, show: true });
          };

          const clearDay = (dayKey: string) => {
            const currentSchedule = formData[field.name] || {};
            const updated = { ...currentSchedule };
            delete updated[dayKey];
            handleChange(field.name, updated);

            // Remove erro
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

            const currentSchedule = formData[field.name] || {};
            const dayKey = timePickerState.dayKey;
            const type = timePickerState.type;

            const updatedSchedule = {
              ...currentSchedule,
              [dayKey]: {
                ...(currentSchedule[dayKey] || {}),
                [type]: timeString,
              },
            };
            console.log("Updated Schedule:", updatedSchedule);
            handleChange(field.name, updatedSchedule);

            // Validação imediata
            const { start, end } = updatedSchedule[dayKey];
            if (start && !end && type === "start") {
              setErrors((prev) => ({
                ...prev,
                [dayKey]: "Informe também o horário de fim",
              }));
            } else if (end && !start && type === "end") {
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

          const hasAnySchedule = Object.values(formData[field.name] || {}).some(
            (day: any) => day?.start || day?.end
          );

          const renderSummary = () => {
            if (!hasAnySchedule) {
              return (
                <Text style={{ color: "#666" }}>
                  {field.placeholder || "Se nenhum horário for definido, será usado o da empresa."}
                </Text>
              );
            }

            return weekdays.map((day) => {
              const schedule = formData[field.name]?.[day.key];
              if (!schedule?.start && !schedule?.end) return null;

              return (
                <Text key={day.key}>
                  {day.label}: {schedule?.start || "--:--"} às {schedule?.end || "--:--"}
                </Text>
              );
            });
          };

          return (
            <View key={field.name} style={{ gap: 8 }}>
              <Text style={styles.label}>{fieldLabel}</Text>

              <View
                style={{
                  borderColor: "#ccc",
                  borderWidth: 1,
                  borderRadius: 8,
                  padding: 12,
                  backgroundColor: "#f9f9f9",
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
                    const start = formData[field.name]?.[day.key]?.start || "";
                    const end = formData[field.name]?.[day.key]?.end || "";

                    return (
                      <GenericalCard key={day.key} containerStyle={{ marginHorizontal: 0, gap: 4 }}>
                        <Text style={styles.label}>{day.label}</Text>

                        <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
                          <Button
                            mode="outlined"
                            style={{ flex: 1 }}
                            onPress={() => showPicker(day.key, "start")}
                          >
                            {start ? `Início: ${start}` : "Início"}
                          </Button>
                          <Button
                            mode="outlined"
                            style={{ flex: 1 }}
                            onPress={() => showPicker(day.key, "end")}
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

        return (
          <View key={field.name}>
            <TextInput
              label={fieldLabel}
              style={styles.input}
              outlineColor={Colors.light.mainColor}
              activeOutlineColor={Colors.light.mainColor}
              value={formData[field.name] || ""}
              onChangeText={text => handleChange(field.name, text)}
              keyboardType={
                field.type === "email" ? "email-address" :
                field.type === "tel" ? "phone-pad" : 
                field.type === "number" ? "numeric" : "default"
              }
              multiline={field.type === "text-area"}
              numberOfLines={field.type === "text-area" ? 4 : 1}
            />
            {field.placeholder && <Text style={styles.placeholderLabel}>{field.placeholder}</Text>}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.light.background,
    borderColor: Colors.light.border,
    borderWidth: 1,
    padding: 0.5,
    borderRadius: 8,
  },
  checkboxContainer: {
    backgroundColor: Colors.light.background,
    padding: 10,
    borderRadius: 8,
    borderColor: Colors.light.border,
    gap: 5
  },
  checkBoxContainerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxLabel: {
    fontSize: 16,
  },
  placeholderLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginLeft: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});