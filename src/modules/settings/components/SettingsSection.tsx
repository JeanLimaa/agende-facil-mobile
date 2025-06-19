import React from "react";
import { View, StyleSheet } from "react-native";
import { List, Divider } from "react-native-paper";

type SettingsSectionProps = {
  title: string;
  items: {
    label: string;
    icon: string;
    onPress: () => void;
  }[];
};

export function SettingsSection({ title, items }: SettingsSectionProps) {
  return (
    <View style={styles.section}>
      <List.Subheader>{title}</List.Subheader>
      {items.map((item, idx) => (
        <React.Fragment key={item.label}>
          <List.Item
            title={item.label}
            left={props => <List.Icon {...props} icon={item.icon} />}
            onPress={item.onPress}
          />
          {idx < items.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
});
