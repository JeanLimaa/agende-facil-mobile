import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { useCategoriesAndServices, useCategoryById } from '@/shared/hooks/queries/useCategoriesAndServices';
import api from '@/shared/services/apiService';
import { useRoute } from '@react-navigation/native';
import { router } from "expo-router";
import { Loading } from '@/shared/components/Loading';
import ErrorScreen from '@/app/ErrorScreen';
import { useApiErrorHandler } from '@/shared/hooks/useApiErrorHandler';
import { SelectableListModal } from '@/shared/components/SelectableListModal';
import { Category } from '@/modules/appointments/types/category.interface';
import { Button } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { useConfirm } from '@/shared/hooks/useConfirm';
import { AppBarHeader } from '@/shared/components/AppBarHeader';
import { Colors } from '@/shared/constants/Colors';

export function DeleteCategories() {
    const { confirm: confirmDelete, ConfirmDialogComponent: ConfirmDeleteDialogComponent } = useConfirm();
    const handleApiError = useApiErrorHandler();

    const {
        data: allCategoriesData,
        error: categoriesError,
        refetch: refetchCategories,
        isLoading: categoriesLoading
    } = useCategoriesAndServices(true, false);
    const allCategories = allCategoriesData?.categories || [];

    const route = useRoute();
    const { categoryId } = route.params as { categoryId: number | null };

    const {
        data: categorySelected,
        error: categoryError,
        refetch: refetchCategory,
        isLoading: categoryLoading
    } = useCategoryById(categoryId);

    const [moveAppointmentsToCategoryId, setMoveAppointmentsToCategoryId] = useState<number | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const hasOnlyOneCategory = allCategories.length === 1;

    // Filtrando categorias para não exibir a atual
    const filteredCategories = allCategories.filter(cat => cat.id !== categoryId);

    if (categoriesLoading || categoryLoading) return <Loading />;

    if (categoriesError || categoryError || !categorySelected) {
        return (
            <ErrorScreen
                message="Erro ao carregar categorias"
                onRetry={() => {
                    refetchCategories();
                    refetchCategory();
                }}
            />
        );
    }

    const handleMoveServices = async () => {
        if (!moveAppointmentsToCategoryId) {
            Alert.alert('Erro', 'Por favor, selecione uma nova categoria.');
            return;
        }

        const confirmed = await confirmDelete({
            title: "Excluir Categoria",
            message: "Você tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.",
            confirmText: "Excluir",
            cancelText: "Cancelar",
        });

        if (!confirmed) return;

        try {
            await api.delete(`/category/${categoryId}`, {
                data: { moveAppointmentsToCategoryId }
            });
            Toast.show({
                type: 'success',
                text1: 'Sucesso',
                text2: 'Categoria excluída com sucesso.'
            });
            refetchCategories();

            router.back();
        } catch (error) {
            handleApiError(error);
        }
    };

    const deleteButtonDisabled = hasOnlyOneCategory || !moveAppointmentsToCategoryId;

    return (
        <>
            <AppBarHeader message="Excluir Categoria" />

            <View style={styles.container}>
                <Text style={styles.label}>
                    Selecione a nova categoria para substituir a categoria <Text style={styles.bold}>{categorySelected.name}</Text>:
                </Text>

                {hasOnlyOneCategory && (
                    <Text style={styles.warning}>
                        ⚠️ Não é possível excluir esta categoria porque você só possui uma. Crie outra categoria para poder mover os serviços.
                    </Text>
                )}

                <Button
                    onPress={() => setModalVisible(true)}
                    mode="contained"
                    style={styles.selectButton}
                    disabled={hasOnlyOneCategory}
                >
                    {moveAppointmentsToCategoryId
                        ? allCategories.find(cat => cat.id === moveAppointmentsToCategoryId)?.name
                        : "Selecione a categoria"}
                </Button>

                <Button
                    mode='contained'
                    onPress={handleMoveServices}
                    disabled={deleteButtonDisabled}
                    style={!deleteButtonDisabled ? styles.deleteButton : styles.disabledButton}
                >
                    Deletar Categoria
                </Button>


                <SelectableListModal
                    data={filteredCategories}
                    isLoading={categoriesLoading}
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    handleSelect={(category: Category) => setMoveAppointmentsToCategoryId(category.id)}
                    emptyMessage='Nenhuma categoria disponível'
                />

                {ConfirmDeleteDialogComponent}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 16,
        marginBottom: 12,
    },
    bold: {
        fontWeight: 'bold',
    },
    warning: {
        color: '#b00020',
        fontSize: 14,
        marginVertical: 18,
    },
    selectButton: {
        marginBottom: 16,
        backgroundColor: Colors.light.mainColor
    },
    deleteButton: {
        marginTop: 8,
        backgroundColor: Colors.light.error,
    },
    disabledButton: {
        marginTop: 8,
        backgroundColor: Colors.light.backgroundSecondary,
    }
});

export default DeleteCategories;