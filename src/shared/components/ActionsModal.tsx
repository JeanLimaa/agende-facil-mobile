import React from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, Text, TextStyle } from 'react-native';
import { MaterialIcons, Ionicons, Feather, FontAwesome } from '@expo/vector-icons';

type IconFamily = 'MaterialIcons' | 'Ionicons' | 'Feather' | 'FontAwesome';

interface ActionItem {
  label: string;
  action: () => void;
  style?: TextStyle;
  icon: {name: string, family?: IconFamily};
  color?: string
}

interface ActionsModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: ActionItem[];
  Header?: React.ReactNode;
}

const getIconComponent = (family: IconFamily) => {
  switch (family) {
    case 'MaterialIcons':
      return MaterialIcons;
    case 'Ionicons':
      return Ionicons;
    case 'Feather':
      return Feather;
    case 'FontAwesome':
      return FontAwesome;
    default:
      return MaterialIcons;
  }
};

export const ActionsModal = ({ visible, onClose, title, options, Header }: ActionsModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
        <TouchableOpacity style={styles.modal} activeOpacity={1}>
          {Header ? Header : <Text style={styles.modalTitle}>{title}</Text>}

          {options.map((opt, index) => {
            const IconComponent = getIconComponent(opt.icon?.family ?? 'MaterialIcons');
            return (
              <TouchableOpacity key={index} onPress={opt.action} style={styles.modalOption}>
                <View style={[styles.optionContent]}>
                  <IconComponent name={opt.icon.name as any} size={24} color={opt?.color ?? "black"} />
                  <Text style={[styles.modalOptionText, {color: opt?.color}]}>{opt.label}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
    teste: {
        color: 'red',
    },
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modal: {
        backgroundColor: '#fff',
        padding: 16,
        width: '100%',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    modalOption: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    optionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    modalOptionText: {
        fontSize: 16,
    },
});
