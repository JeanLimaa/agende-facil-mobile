import { useCallback } from "react";
import { AxiosError } from "axios";
import { Alert } from "react-native"; 
import { showAlertForStatusCode } from "@/shared/helpers/showAlertForStatusCode.helper.";

export function useApiErrorHandler() {
  const handleApiError = useCallback((error: unknown, defaultMessage = "Erro inesperado") => {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const data = error.response?.data;

      showAlertForStatusCode(status ?? null, data?.message || defaultMessage);
    } else {
      Alert.alert("Erro", defaultMessage);
      console.error("Erro desconhecido:", error);
    }
  }, []);

  return handleApiError;
}
