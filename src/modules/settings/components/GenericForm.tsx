import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet,
} from "react-native";
import { Checkbox, Menu, TextInput, Button } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { Colors } from "@/shared/constants/Colors";
import { useSettingsTabs } from "../contexts/SettingTabsContext";
import WeeklyScheduleField from "@/shared/components/WeeklyScheduleField";

export type FieldValue = string | number | boolean | Date | null | object | Array<any>;
export type FormDataType = Record<string, FieldValue>;

export interface GenericFormField {
  name: string;
  label: string;
  type: "text" | "number" | "email" | "tel" | "date" | "file" | "select" | "checkbox" | "text-area" | "header" | "weekly-schedule";
  placeholder?: string;
  options?: { label: string; value: string }[];
  onChange?: (value: FieldValue, allValues: FormDataType) => void;
  required?: boolean;
}

interface GenericFormProps {
  fields: GenericFormField[];
  tabKey: string;

  initialValues?: FormDataType;
  onChange?: (data: FormDataType) => void;
}

export type GenericFormRef = {
  getData: () => FormDataType;
};

export const GenericForm = ({ fields, initialValues, onChange, tabKey }: GenericFormProps) => {
  const [formData, setFormData] = useState<FormDataType>({});
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

  const handleChange = (name: string, value: FieldValue) => {
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
                  ? new Date(formData[field.name] as string | Date).toLocaleDateString()
                  : "Selecionar data"}
              </Button>

              {showDatePicker && (
                <DateTimePicker
                  value={new Date(currentValue as string | Date)}
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
          return (
            <WeeklyScheduleField
              key={field.name}
              fieldLabel={fieldLabel}
              field={field}
              formData={formData}
              handleChange={handleChange}
            />
          );
        }

        return (
          <View key={field.name}>
            <TextInput
              label={fieldLabel}
              style={styles.input}
              outlineColor={Colors.light.mainColor}
              activeOutlineColor={Colors.light.mainColor}
              value={(formData[field.name]?.toString()) || ''}
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