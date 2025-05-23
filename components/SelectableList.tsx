import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { TextInput } from "react-native-paper";

type BaseItem = {
  id: string | number;
  name: string;
};

interface SelectableListProps<T extends BaseItem> {
  data: T[];
  isLoading: boolean;
  onSelect: (item: T) => void;
  emptyMessage?: string;
  searchable?: boolean;
  getSearchableValue?: (item: T) => string;
}

export function SelectableList<T extends BaseItem>({
  data,
  onSelect,
  isLoading,
  emptyMessage = "Nenhum item encontrado",
  searchable = false,
  getSearchableValue = (item) => item.name,
}: SelectableListProps<T>) {
  const [search, setSearch] = useState("");

  const filteredData = searchable
    ? data.filter((item) =>
        getSearchableValue(item).toLowerCase().includes(search.toLowerCase())
      )
    : data;

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <>
      {searchable && (
        <TextInput
          placeholder="Buscar..."
          value={search}
          onChangeText={setSearch}
          mode="outlined"
          style={{ marginBottom: 10 }}
          left={<TextInput.Icon icon="magnify" />}
        />
      )}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onSelect(item)} style={styles.item}>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  emptyText: {
    textAlign: "center",
    padding: 10,
  },
});