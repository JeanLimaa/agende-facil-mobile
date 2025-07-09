import React, { forwardRef, useImperativeHandle, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  //TextInput 
} from "react-native";
import { Checkbox, Menu, TextInput, Button } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { Colors } from "@/shared/constants/Colors";

interface Field {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "date" | "file" | "select" | "checkbox" | "text-area";
  placeholder?: string;
  options?: { label: string; value: string }[];
}


interface GenericFormProps {
  fields: Field[];
}

export const GenericForm = forwardRef(({ fields }: GenericFormProps, ref) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [menuVisible, setMenuVisible] = useState<string | null>(null); // para abrir só um select de cada vez

  useImperativeHandle(ref, () => ({
    getData: () => formData
  }));

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
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
        if (field.type === "date") {
          return (
            <View key={field.name}>
              <Text style={styles.label}>{field.label}</Text>
              <DateTimePicker
                value={formData[field.name] || new Date()}
                onChange={(_, date) => handleChange(field.name, date)}
                mode="date"
              />
            </View>
          );
        }

        if (field.type === "file") {
          return (
            <View key={field.name}>
              <Text style={styles.label}>{field.label}</Text>
              <Button mode="contained" onPress={() => handleFilePick(field.name)}>
                Selecionar Imagem
              </Button>
              {formData[field.name] && <Text>Imagem selecionada!</Text>}
            </View>
          );
        }

        if (field.type === "text-area") {
          return (
            <View key={field.name}>
              <TextInput
                mode="outlined"
                label={field.label}
                style={[styles.input, { height: 100 }]}
                value={formData[field.name] || ""}
                onChangeText={text => handleChange(field.name, text)}
                multiline
                numberOfLines={8}
              />
            </View>
          );
        }

        if (field.type === "checkbox") {
          return (
            <View key={field.name} style={styles.checkboxContainer}>
              <Checkbox
                status={formData[field.name] ? "checked" : "unchecked"}
                onPress={() => handleChange(field.name, !formData[field.name])}
              />
              <Text style={styles.checkboxLabel}>{field.label}</Text>
            </View>
          );
        }

        if (field.type === "select" && field.options) {
          return (
            <View key={field.name}>
              <Text>{field.label}</Text>
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

        return (
          <View key={field.name}>
            <TextInput
              label={field.label}
              style={styles.input}
              outlineColor={Colors.light.mainColor}
              activeOutlineColor={Colors.light.mainColor}
              value={formData[field.name] || ""}
              onChangeText={text => handleChange(field.name, text)}
              keyboardType={field.type === "email" ? "email-address" : field.type === "tel" ? "phone-pad" : "default"}
            />
          </View>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 0.5,
    borderRadius: 8,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxLabel: {
    fontSize: 16,
  },
});