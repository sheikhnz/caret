/**
 * Custom text / lesson editor form (modal body and actions).
 */

"use client";

import { useCustomTextStore } from "@/modules/typing/stores/custom-text-store";

import { CustomTextModalFormContent } from "./CustomTextModalFormContent";

type CustomTextModalFormProps = {
  open: boolean;
  onClose: () => void;
  onApplied?: () => void;
};

export const CustomTextModalForm = ({
  open,
  onClose,
  onApplied,
}: CustomTextModalFormProps) => {
  const { settings, revision } = useCustomTextStore();

  if (!open) return null;

  return (
    <CustomTextModalFormContent
      key={revision}
      settings={settings}
      onClose={onClose}
      onApplied={onApplied}
    />
  );
};
