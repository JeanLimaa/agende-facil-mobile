import React, { useState } from "react";
import { TextInput, IconButton } from "react-native-paper";
import { View, StyleSheet } from "react-native";

interface PasswordFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  label: string;
  placeholder?: string;
  error?: boolean;
  style?: object;
  mode?: "flat" | "outlined";
}

export function PasswordField({
  value,
  onChangeText,
  label,
  placeholder,
  error,
  style,
  mode = "outlined",
  ...props
}: PasswordFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={[styles.container, style]}>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={!isPasswordVisible}
        mode={mode}
        error={error}
        right={
          <TextInput.Icon
            icon={isPasswordVisible ? "eye-off" : "eye"}
            onPress={togglePasswordVisibility}
          />
        }
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
});