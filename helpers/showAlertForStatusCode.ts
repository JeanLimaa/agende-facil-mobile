import { Alert } from "react-native";

export function showAlertForStatusCode(status: number | null, message: string) {
  switch (status) {
    case 400:
      Alert.alert("Erro de validação", message);
      break;
    case 401:
      Alert.alert("Não autorizado", "Você precisa estar logado para continuar.");
      break;
    case 404:
      Alert.alert("Não encontrado", "O recurso solicitado não existe.");
      break;
    case 500:
      Alert.alert("Erro interno", "Erro no servidor. Tente novamente mais tarde.");
      break;
    default:
      Alert.alert("Erro", message);
      break;
  }
}