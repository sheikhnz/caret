/**
 * Custom text / lesson editor form (drawer body and actions).
 */

"use client";

import { useCustomTextStore } from "@/modules/typing/stores";
import { CustomTextDrawerFormContent } from "./CustomTextDrawerFormContent";

type CustomTextDrawerFormProps = {
  open: boolean;
  onClose: () => void;
  onApplied?: () => void;
};

export const CustomTextDrawerForm = ({
  open,
  onClose,
  onApplied,
}: CustomTextDrawerFormProps) => {
  const { settings, revision } = useCustomTextStore();

  return (
    <CustomTextDrawerFormContent
      key={revision}
      open={open}
      settings={settings}
      onClose={onClose}
      onApplied={onApplied}
    />
  );
};
