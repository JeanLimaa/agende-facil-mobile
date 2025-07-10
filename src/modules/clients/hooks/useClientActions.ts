import { useState } from "react";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { Linking } from "react-native";
import { useConfirm } from "@/shared/hooks/useConfirm";
import { Client } from "@/shared/types/client.interface";
import api from "@/shared/services/apiService";

export const useClientActions = (refetch: () => void) => {
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [actionModalVisible, setActionModalVisible] = useState(false);
    const { confirm, ConfirmDialogComponent } = useConfirm();

    const openActions = (client: Client) => {
        setSelectedClient(client);
        setActionModalVisible(true);
    };

    const handleEdit = () => {
        setActionModalVisible(false);
        if (selectedClient)
            router.push({ pathname: "/(tabs)/clients/edit", params: { id: selectedClient.id } });
    };

    const handleBlock = async () => {
        setActionModalVisible(false);
        if (!selectedClient) return;

        const action = selectedClient.isBlocked ? "Desbloquear" : "Bloquear";
        const confirmed = await confirm({
            title: `${action} Cliente`,
            message: `Tem certeza que deseja ${action.toLowerCase()} ${selectedClient.name}?`,
            confirmText: action,
            cancelText: "Cancelar",
        });

        if (!confirmed) return;

        try {
            await api.patch(`/clients/${selectedClient.id}/block`);
            await refetch();
            Toast.show({ type: "success", text1: `${action} com sucesso!` });
        } catch {
            Toast.show({ type: "error", text1: "Erro ao bloquear/desbloquear" });
        }
    };

    const handleCall = () => {
        setActionModalVisible(false);
        if (selectedClient?.phone) Linking.openURL(`tel:${selectedClient.phone}`);
    };

    const handleWhatsApp = () => {
        setActionModalVisible(false);
        if (!selectedClient?.phone) return;
        const phone = selectedClient.phone.replace(/\D/g, "");
        Linking.openURL(`https://wa.me/${phone}`);
    };

    const handleHistory = () => {
        setActionModalVisible(false);
        if (selectedClient)
            router.push({ pathname: "/(tabs)/clients/appointments-history", params: { id: selectedClient.id } });
    };

    return {
        openActions,
        selectedClient,
        setActionModalVisible,
        actionModalVisible,
        handleEdit,
        handleBlock,
        handleCall,
        handleWhatsApp,
        handleHistory,
        ConfirmDialogComponent
    };
};