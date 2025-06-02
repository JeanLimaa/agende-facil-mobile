import { ClientFormScreen } from "@/modules/clients/screens/ClientFormScreen";
import { useGlobalSearchParams, useLocalSearchParams } from "expo-router";
import React from "react";

export default function EditClientPage() {
  const { id } = useGlobalSearchParams();
  const idValue = Array.isArray(id) ? id[0] : id;
  return <ClientFormScreen clientId={idValue} />;
}