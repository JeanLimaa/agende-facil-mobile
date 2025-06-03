import React from "react";
import { ActionsModal } from "@/shared/components/ActionsModal";

export function ClientActionsModal({
  visible,
  onClose,
  onEdit,
  onBlock,
  onHistory,
  isBlocked,
  onCall,
  onWhatsApp,
  clientName
}: {
  visible: boolean;
  onClose: () => void;
  clientName: string;
  onEdit: () => void;
  onBlock: () => void;
  isBlocked: boolean;
  onCall: () => void;
  onWhatsApp: () => void;
  onHistory: () => void;
}) {
  return (
    <ActionsModal
      visible={visible}
      onClose={onClose}
      title={clientName}
      options={[
        { 
          label: "Editar", 
          action: onEdit, 
          icon: { name: "edit", family: "MaterialIcons" }, 
          color: "#1E88E5"
        },
        { 
          label: "Ligar", 
          action: onCall, 
          icon: { name: "phone", family: "MaterialIcons" }, 
          color: "#388E3C" 
        },
        { 
          label: "WhatsApp", 
          action: onWhatsApp, 
          icon: { name: "whatsapp", family: "FontAwesome" }, 
          color: "#25D366" 
        },
        { 
          label: isBlocked ? "Desbloquear" : "Bloquear", 
          action: onBlock, 
          icon: { name: isBlocked ? "lock-open" : "block", family: "MaterialIcons" },
          color: isBlocked ? "#388E3C" : "#E53935"
        },
        {
          label: "Histórico de Agendamentos",
          action: onHistory,
          icon: { name: "history", family: "MaterialIcons" },
          color: "#546E7A"
        }
      ]}
    />
  );
}
