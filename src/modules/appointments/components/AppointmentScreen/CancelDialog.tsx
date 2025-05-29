import React from "react";
import { Portal, Dialog, Button, Text } from "react-native-paper";

export function CancelDialog({
  visible,
  onDismiss,
  onConfirm,
}: {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
}) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Cancelar Agendamento</Dialog.Title>
        <Dialog.Content>
          <Text>Tem certeza de que deseja cancelar este agendamento?</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Não</Button>
          <Button onPress={onConfirm}>Sim</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
