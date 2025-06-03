import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { View, FlatList, Platform } from "react-native";
import { Button, Checkbox, Text, Appbar, Divider, ActivityIndicator } from "react-native-paper";
import * as Contacts from "expo-contacts";
import { styles } from "../styles/styles";
import api from "@/shared/services/apiService";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { AppBarHeader } from "@/shared/components/AppBarHeader";
import { ContactItem } from "../components/ContactItem";
import { EmptyText } from "@/shared/components/EmptyText";

export function ImportContactsScreen() {
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  
  const loadContacts = async () => {
    setIsLoading(true);
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== "granted") {
      Toast.show({
        type: "error",
        text1: "Permissão negada",
        text2: "Não foi possível acessar os contatos.",
      });
      setIsLoading(false);
      return;
    }

    const { data } = await Contacts.getContactsAsync({ fields: [Contacts.Fields.PhoneNumbers] });
    setContacts(data.filter(c => c.phoneNumbers && c.phoneNumbers.length > 0));
    setIsLoading(false);
  };

  const toggleSelectContact = (id: string) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((contactId) => contactId !== id) : [...prev, id]
    );
  };

  const handleImport = async () => {
    if (selectedContacts.length === 0) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Selecione pelo menos um contato para importar.",
      });
      return;
    }

    setIsImporting(true);
    try {
      const contactsToImport = contacts.filter((contact) =>
        selectedContacts.includes(contact.id ?? "")
      ).map(c => ({
        name: c.name,
        phone: c.phoneNumbers?.[0]?.number || "",
        email: c.emails?.[0]?.email || "",
      }));
      await api.post("/clients/import", { contacts: contactsToImport });
      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: "Contatos importados com sucesso.",
      });
      router.back();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível importar os contatos.",
      });
    } finally {
      setIsImporting(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const renderItem = useCallback(
  ({ item }: { item: Contacts.Contact }) => (
    <ContactItem
      id={item.id ?? ""}
      name={item.name}
      phone={item.phoneNumbers?.[0]?.number ?? ""}
      isSelected={selectedContacts.includes(item.id ?? "")}
      onToggle={toggleSelectContact}
    />
  ),
  [selectedContacts]
);

  return (
    <View style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
      <AppBarHeader message="Importar Contatos" />

      <View style={styles.formContainer}>
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id ?? ""}
          style={{ marginBottom: 16, marginTop: 8 }}
          renderItem={renderItem}
          ListEmptyComponent={
            !isLoading
              ? () => (
                  <EmptyText>
                    Nenhum contato encontrado. Verifique se você concedeu permissão para acessar os contatos.
                  </EmptyText>
                )
              : null
          }
        />
        <Button
          mode="contained"
          onPress={handleImport}
          loading={isImporting}
          style={styles.saveButton}
        >
          Importar Contatos
        </Button>
      </View>
    </View>
  );
}
