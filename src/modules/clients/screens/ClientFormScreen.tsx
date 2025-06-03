import React, { useEffect, useRef, useState } from "react";
import { View, KeyboardAvoidingView, Platform } from "react-native";
import { TextInput, Button, Text, Appbar, Divider } from "react-native-paper";
import { styles } from "../styles/styles";
import api from "@/shared/services/apiService";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { AppBarHeader } from "@/shared/components/AppBarHeader";
import { useClientById, useClients } from "@/shared/hooks/queries/useClients";
import { Loading } from "@/shared/components/Loading";
import ErrorScreen from "@/app/ErrorScreen";
import { useApiErrorHandler } from "@/shared/hooks/useApiErrorHandler";
import { useQueryClient } from "@tanstack/react-query";

export function ClientFormScreen({
  clientId,
}: {clientId?: string}) {
  const handleError = useApiErrorHandler();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const hasLoaded = useRef(false);
  const clientEditQuery = useClientById(Number(clientId));

  const isEdit = Boolean(clientId);
  
  useEffect(() => {
    if (isEdit && clientEditQuery && clientEditQuery.data && !Array.isArray(clientEditQuery.data) && !hasLoaded.current) {
      const client = clientEditQuery.data;
      setName(client.name);
      setPhone(client.phone);
      setEmail(client?.email || "");
    }
  }, [isEdit, clientEditQuery?.data]);
  
  if (isEdit && clientEditQuery?.isLoading) return <Loading />;
  if (isEdit && clientEditQuery?.error) return <ErrorScreen onRetry={clientEditQuery?.refetch} />;

  const handleSave = async () => {
    if (!name || !phone) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Nome e telefone são obrigatórios.",
        position: "bottom",
      });
      return;
    }

    setIsSaving(true);
    try {
      isEdit  
      ? await api.put(`/clients/${clientId}`, { name, email, phone }) 
      : await api.post("/clients", { name, email, phone });

      queryClient.invalidateQueries(isEdit ? {queryKey: ["client", clientId]} : { queryKey: ["clients"] });

      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: isEdit ? "Cliente atualizado com sucesso." : "Cliente criado com sucesso.",
        position: "bottom"
      });
      router.back();
    } catch (error) {
      handleError(error)
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F8F8F8" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <AppBarHeader message={isEdit ? "Editar Cliente" : "Novo Cliente"} />


      <View style={styles.formContainer}>
        <TextInput
          label="Nome *"
          value={name}
          onChangeText={setName}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          mode="outlined"
          keyboardType="email-address"
        />
        <TextInput
          label="Telefone *"
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
          mode="outlined"
          keyboardType="phone-pad"
        />
        <Button
          mode="contained"
          onPress={handleSave}
          loading={isSaving}
          style={styles.saveButton}
        >
          Salvar
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}
