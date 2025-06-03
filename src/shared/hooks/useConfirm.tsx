import React, { useState } from "react";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog/ConfirmDialog";

type Options = {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
};

export function useConfirm() {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<Options | null>(null);
  const [resolver, setResolver] = useState<(value: boolean) => void>();

  const confirm = (opts: Options): Promise<boolean> => {
    setOptions(opts);
    setVisible(true);

    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  };

  const handleConfirm = () => {
    setVisible(false);
    resolver?.(true);
  };

  const handleCancel = () => {
    setVisible(false);
    resolver?.(false);
  };

  const dialog = options && (
    <ConfirmDialog
      visible={visible}
      title={options.title}
      message={options.message}
      confirmText={options.confirmText}
      cancelText={options.cancelText}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );

  return { confirm, ConfirmDialogComponent: dialog };
}