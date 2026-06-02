/**
 * Custom text / lesson editor modal.
 */

"use client";

import { CustomTextModalForm } from "./CustomTextModalForm";

type CustomTextModalProps = {
  open: boolean;
  onClose: () => void;
  onApplied?: () => void;
};

export const CustomTextModal = ({
  open,
  onClose,
  onApplied,
}: CustomTextModalProps) => (
  <CustomTextModalForm open={open} onClose={onClose} onApplied={onApplied} />
);
