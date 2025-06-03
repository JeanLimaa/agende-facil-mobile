import React, { useState } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { useClientAppointments } from "../hooks/useClientAppointments";
import { AppointmentHistoryClientCard } from "../components/AppointmentHistoryClientCard";
import { Loading } from "@/shared/components/Loading";
import ErrorScreen from "@/app/ErrorScreen";
import { AppBarHeader } from "@/shared/components/AppBarHeader";
import { EmptyText } from "@/shared/components/EmptyText";

export function ClientAppointmentHistoryScreen({ clientId }: { clientId: number }) {
  const { data, isLoading, error, refetch } = useClientAppointments(clientId);

  if (isLoading) return <Loading />;
  if (error) return <ErrorScreen onRetry={refetch} />;

  return (
    <>
        <AppBarHeader message="Histórico de Agendamentos" />

        <View style={styles.container}>
        <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <AppointmentHistoryClientCard appointment={item} />}
            contentContainerStyle={{ paddingBottom: 16 }}
            ListEmptyComponent={
              <EmptyText>
                Nenhum agendamento encontrado para este cliente.
              </EmptyText>
            }
        />
        </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  filterButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});
