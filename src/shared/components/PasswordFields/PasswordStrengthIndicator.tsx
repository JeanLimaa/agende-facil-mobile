import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/shared/constants/Colors";

interface PasswordStrengthIndicatorProps {
  password: string;
}

export type PasswordStrength = "weak" | "medium" | "strong";

export function getPasswordStrength(password: string): PasswordStrength {
  if (password.length < 8) return "weak";

  let score = 0;
  
  // Verifica presença de letras minúsculas
  if (/[a-z]/.test(password)) score++;
  
  // Verifica presença de letras maiúsculas
  if (/[A-Z]/.test(password)) score++;
  
  // Verifica presença de números
  if (/\d/.test(password)) score++;
  
  // Verifica presença de símbolos especiais
  if (/[@$!%*?&]/.test(password)) score++;
  
  // Verifica comprimento maior que 12 caracteres
  if (password.length >= 12) score++;

  if (score <= 2) return "weak";
  if (score <= 3) return "medium";
  return "strong";
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  if (!password) return null;

  const strength = getPasswordStrength(password);
  
  const getStrengthConfig = () => {
    switch (strength) {
      case "weak":
        return {
          label: "Fraca",
          color: "#FF6B6B",
          widthPercentage: 33,
        };
      case "medium":
        return {
          label: "Média",
          color: "#FFD93D", 
          widthPercentage: 66,
        };
      case "strong":
        return {
          label: "Forte",
          color: "#6BCF7F",
          widthPercentage: 100,
        };
    }
  };

  const config = getStrengthConfig();

  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        <View 
          style={[
            styles.strengthBar, 
            { 
              backgroundColor: config.color,
              width: `${config.widthPercentage}%` 
            }
          ]} 
        />
      </View>
      <Text style={[styles.strengthText, { color: config.color }]}>
        Força da senha: {config.label}
      </Text>
      {strength === "weak" && (
        <Text style={styles.helpText}>
          Use pelo menos 8 caracteres com letras maiúsculas, minúsculas, números e símbolos
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 16,
  },
  barContainer: {
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    overflow: "hidden",
  },
  strengthBar: {
    height: "100%",
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
  },
  helpText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
});