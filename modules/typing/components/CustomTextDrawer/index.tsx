/**
 * Custom text / lesson editor drawer.
 */

"use client";

import { CustomTextDrawerForm } from "./CustomTextDrawerForm";

type CustomTextDrawerProps = {
  open: boolean;
  onClose: () => void;
  onApplied?: () => void;
};

export const CustomTextDrawer = ({
  open,
  onClose,
  onApplied,
}: CustomTextDrawerProps) => (
  <CustomTextDrawerForm open={open} onClose={onClose} onApplied={onApplied} />
);
