import React from "react";
import { ActionsModal } from "@/shared/components/ActionsModal";

export function ClientActionsModal({
  visible,
  onClose,
  onEdit,
  onBlock,
  onCall,
  onWhatsApp,
  onDelete,
  clientName
}: {
  visible: boolean;
  onClose: () => void;
  clientName: string;
  onEdit: () => void;
  onBlock: () => void;
  onCall: () => void;
  onWhatsApp: () => void;
  onDelete: () => void;
}) {
  return (
    <ActionsModal
      visible={visible}
      onClose={onClose}
      title={clientName}
      options={[
        { label: "Editar", action: onEdit, icon: { name: "edit", family: "MaterialIcons" } },
        { label: "Bloquear", action: onBlock, icon: { name: "block", family: "MaterialIcons" } },
        { label: "Ligar", action: onCall, icon: { name: "phone", family: "MaterialIcons" } },
        { label: "WhatsApp", action: onWhatsApp, icon: { name: "whatsapp", family: "FontAwesome" }, color: "#25D366" },
        { label: "Deletar", action: onDelete, icon: { name: "delete", family: "MaterialIcons" }, color: "red" },
    ]}
    />
  );
}
