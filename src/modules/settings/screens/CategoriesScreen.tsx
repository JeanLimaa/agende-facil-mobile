import React from "react";
import { View, Text, FlatList } from "react-native";
import { AppBarHeader } from "@/shared/components/AppBarHeader";
import { Loading } from "@/shared/components/Loading";
import ErrorScreen from "@/app/ErrorScreen";
import { ActionsModal } from "@/shared/components/ActionsModal";
import { FAB } from "react-native-paper";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { fabStyle } from "@/shared/styles/fab";
import { GenericalCard } from "@/shared/components/GenericalCard";
import { useCategoriesAndServices } from "@/shared/hooks/queries/useCategoriesAndServices";

export default function CategoriesScreen() {
  const navigation = useNavigation<any>();
  const { data, refetch, isLoading, error } = useCategoriesAndServices(true, false);

  const categories = data?.categories || [];

  const [actionsModalVisible, setActionsModalVisible] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<number | null>(null);
 
  if(isLoading) return <Loading />;
  if(error) return <ErrorScreen message="Erro ao carregar categorias" onRetry={refetch} />;

  const openActions = (categoryId: number) => {
    setSelectedCategory(categoryId);
    setActionsModalVisible(true);
  }

  const cleanActions = () => {
    setSelectedCategory(null);
    setActionsModalVisible(false);
  }

  function handleAddCategory() {
    cleanActions();

    navigation.navigate("settings/records/categories/category-form", { categoryId: null });
  }

  function handleEditCategory(categoryId: number | null) {
    if(!categoryId) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Nenhuma categoria selecionada.'
      });
      return;
    }
    
    cleanActions();

    navigation.navigate("settings/records/categories/category-form", { categoryId });
  }

  async function handleDeleteCategory(categoryId: number | null) {
    if (!categoryId) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Nenhuma categoria selecionada.'
      });
      return;
    }

    cleanActions();

    navigation.navigate("settings/records/categories/delete-category", { categoryId });
  }

  return (
    <View style={{ flex: 1 }}>
      <AppBarHeader message="Profissionais" />
      
      <FlatList
        data={categories}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <GenericalCard
            onPress={() => openActions(item.id)}
            showAvatar={true}
            name={item.name}
          >
            <View>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
            </View>
            </GenericalCard>
        )}
        ListEmptyComponent={
          <View style={{ padding: 16, alignItems: 'center' }}>
            <Text style={{ color: '#999' }}>Nenhuma categoria encontrada</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 16 }}
      />

      <FAB
        icon="plus"
        style={fabStyle.fab}
        onPress={handleAddCategory}
      />

      <ActionsModal
        visible={actionsModalVisible}
        onClose={() => setActionsModalVisible(false)}
        title="Ações do Profissional"
        options={[
          { 
            label: "Editar", 
            action: () => handleEditCategory(selectedCategory), 
            icon: { name: "edit", family: "MaterialIcons" }, 
            color: "#1E88E5" 
          },
          { 
            label: "Excluir", 
            action: () => handleDeleteCategory(selectedCategory), 
            icon: { name: "delete", family: "MaterialIcons" }, 
            color: "#E53935" 
          }
        ]}
      />
    </View>
  );
}