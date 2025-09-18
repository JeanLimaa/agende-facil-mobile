import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { AppBarHeader } from "@/shared/components/AppBarHeader";
import { PasswordField } from "@/shared/components/PasswordFields/PasswordField";
import { PasswordStrengthIndicator } from "@/shared/components/PasswordFields/PasswordStrengthIndicator";
import { Button, HelperText } from "react-native-paper";
import { Colors } from "@/shared/constants/Colors";
import api from "@/shared/services/apiService";
import { useApiErrorHandler } from "@/shared/hooks/useApiErrorHandler";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { AxiosError } from "axios";

interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ValidationErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export default function ChangePasswordScreen() {
  const [formData, setFormData] = useState<ChangePasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const handleError = useApiErrorHandler();

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Validar senha atual
    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = "Senha atual é obrigatória";
    }

    // Validar nova senha
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "Nova senha é obrigatória";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Nova senha deve ter no mínimo 8 caracteres";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.newPassword)) {
      newErrors.newPassword = "Nova senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 símbolo especial";
    }

    // Validar confirmação de senha
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirmação de senha é obrigatória";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }

    // Verificar se nova senha é diferente da atual
    if (formData.currentPassword && formData.newPassword && formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = "A nova senha deve ser diferente da senha atual";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ChangePasswordFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: "Senha atualizada com sucesso.",
        position: "bottom",
        visibilityTime: 3000,
      });

      router.back();
    } catch (err: AxiosError | any) {
      handleError(err, err instanceof AxiosError ? err.response?.data?.message : "");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.currentPassword.trim() &&
      formData.newPassword.trim() &&
      formData.confirmPassword.trim() &&
      formData.newPassword === formData.confirmPassword &&
      formData.newPassword.length >= 8 &&
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.newPassword) &&
      Object.keys(errors).length === 0
    );
  };

  return (
    <View style={styles.container}>
      <AppBarHeader message="Alterar senha" />
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.form}>
          <Text style={styles.description}>
            Para sua segurança, confirme sua senha atual antes de definir uma nova senha.
          </Text>

          <PasswordField
            label="Senha atual"
            value={formData.currentPassword}
            onChangeText={(value) => handleInputChange("currentPassword", value)}
            error={!!errors.currentPassword}
            placeholder="Digite sua senha atual"
          />
          {errors.currentPassword && (
            <HelperText type="error" visible={!!errors.currentPassword}>
              {errors.currentPassword}
            </HelperText>
          )}

          <PasswordField
            label="Nova senha"
            value={formData.newPassword}
            onChangeText={(value) => handleInputChange("newPassword", value)}
            error={!!errors.newPassword}
            placeholder="Digite sua nova senha"
          />
          {errors.newPassword && (
            <HelperText type="error" visible={!!errors.newPassword}>
              {errors.newPassword}
            </HelperText>
          )}
          
          <PasswordStrengthIndicator password={formData.newPassword} />

          <PasswordField
            label="Confirmar nova senha"
            value={formData.confirmPassword}
            onChangeText={(value) => handleInputChange("confirmPassword", value)}
            error={!!errors.confirmPassword}
            placeholder="Digite novamente sua nova senha"
          />
          {errors.confirmPassword && (
            <HelperText type="error" visible={!!errors.confirmPassword}>
              {errors.confirmPassword}
            </HelperText>
          )}

          <View style={styles.requirements}>
            <Text style={styles.requirementsTitle}>Requisitos da senha:</Text>
            <Text style={styles.requirementItem}>• Mínimo 8 caracteres</Text>
            <Text style={styles.requirementItem}>• Pelo menos 1 letra minúscula</Text>
            <Text style={styles.requirementItem}>• Pelo menos 1 letra maiúscula</Text>
            <Text style={styles.requirementItem}>• Pelo menos 1 número</Text>
            <Text style={styles.requirementItem}>• Pelo menos 1 símbolo especial (@$!%*?&)</Text>
          </View>

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={!isFormValid() || isLoading}
            style={[
              styles.submitButton,
              !isFormValid() && styles.submitButtonDisabled
            ]}
            contentStyle={styles.submitButtonContent}
          >
            Atualizar Senha
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  form: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  description: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 20,
  },
  requirements: {
    backgroundColor: "#F0F7FF",
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.mainColor,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 8,
  },
  requirementItem: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  submitButton: {
    marginTop: 8,
    backgroundColor: Colors.light.mainColor,
  },
  submitButtonDisabled: {
    backgroundColor: "#CCCCCC",
  },
  submitButtonContent: {
    paddingVertical: 4,
  },
});
