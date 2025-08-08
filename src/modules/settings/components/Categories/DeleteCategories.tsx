import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
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

    return (
        <View>
            <AppBarHeader message="Excluir Categoria" />
            
            <Text>
                Selecione a nova categoria para substituir a categoria <Text style={{ fontWeight: 'bold' }}>{categorySelected.name}</Text>:
            </Text>

            <Button
                onPress={() => setModalVisible(true)}
                mode="outlined"
            >
                {moveAppointmentsToCategoryId ? allCategories.find(cat => cat.id === moveAppointmentsToCategoryId)?.name : "Selecione a categoria"}
            </Button>

            <SelectableListModal
                data={allCategories}
                isLoading={categoriesLoading}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                handleSelect={(category: Category) => setMoveAppointmentsToCategoryId(category.id)}
                emptyMessage='Nenhuma categoria disponível'
            />

            <Button mode='contained' onPress={handleMoveServices}>
                Deletar
            </Button>

            {ConfirmDeleteDialogComponent}
        </View>
    );
};

export default DeleteCategories;
