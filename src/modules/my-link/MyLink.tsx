import { StyleSheet, Text, View, Share, Linking } from "react-native";
import { ActionsModal } from "../../shared/components/ActionsModal";
import { useMe } from "../../shared/hooks/queries/useMe";
import { Loading } from "../../shared/components/Loading";
import ErrorScreen from "@/app/ErrorScreen";
import Toast from "react-native-toast-message";
import * as Clipboard from 'expo-clipboard';
import { MyLinkHeader } from "./MyLinkHeader";

interface MyLinkProps {
    visible: boolean;
    onClose: () => void;
}

export function MyLink({ visible, onClose }: MyLinkProps) {
    const { data: user, isLoading, error, refetch } = useMe();

    if (isLoading) return <Loading />;
    if (error || !user) return <ErrorScreen onRetry={refetch} />;

    const safeUser = user;

    async function handleCopyLink() {
        try {
            await Clipboard.setStringAsync(safeUser.companyLink);
            Toast.show({
                type: 'success',
                text1: 'Link copiado',
                text2: 'O link foi copiado para a área de transferência.',
                position: 'top',
                visibilityTime: 2000,
            });
        } catch (e) {
            console.error("Erro ao copiar link:", e);
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Não foi possível copiar o link.',
                position: 'top',
                visibilityTime: 2000,
            });
        }

        onClose();
    };

    async function handleOpenLink() {
        Toast.show({
            type: 'info',
            text1: 'Abrindo link',
            text2: 'O link será aberto no navegador.',
            position: 'top',
            visibilityTime: 2000,
        });

        const supported = await Linking.canOpenURL(safeUser.companyLink);
        if (!supported) {
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Não foi possível abrir o link.',
                position: 'top',
                visibilityTime: 2000,
            });

            return;
        }

        await Linking.openURL(safeUser.companyLink);

        onClose();
    }

    async function handleShareLink() {
        try {
            await Share.share({
                message: safeUser.companyLink,
            });
                                                                                              
            onClose();
        } catch (e) {
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Não foi possível abrir o compartilhamento de link.',
                position: 'top',
                visibilityTime: 2000,
            });
        }
    }

    return (
        <ActionsModal
            options={[
                {
                    label: "Copiar link",
                    action: handleCopyLink,
                    icon: { name: "content-copy", family: "MaterialIcons" },
                },
                {
                    label: "Abrir link",
                    action: handleOpenLink,
                    icon: { name: "open-in-browser", family: "MaterialIcons" },
                },
                {
                    label: "Compartilhar link",
                    action: handleShareLink,
                    icon: { name: "share", family: "MaterialIcons" },
                }
            ]}
            title="Meu Link"
            Header={<MyLinkHeader user={safeUser} />}
            visible={visible}
            onClose={onClose}
        />
    )
}