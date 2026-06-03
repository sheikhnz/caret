import {
  AtSign,
  Clock,
  Hash,
  ListOrdered,
  PenLine,
  Pencil,
  Quote,
  Sparkles,
  Timer,
  Type,
  type LucideIcon,
} from "lucide-react";

import type { TestMode } from "@/modules/typing/types/config";

export const CONFIG_TRANSITION = { duration: 0.25, ease: "easeInOut" as const };
export const LAYOUT_TRANSITION = { layout: CONFIG_TRANSITION };

export const TEST_CONFIG_SIDE_GAP = "1em";

export const TEST_CONFIG_MODES: {
  key: TestMode;
  label: string;
  icon: LucideIcon;
}[] = [
  { key: "time", label: "Time", icon: Timer },
  { key: "words", label: "Words", icon: Type },
  { key: "quote", label: "Quote", icon: Quote },
  { key: "custom", label: "Custom", icon: PenLine },
  { key: "zen", label: "Zen", icon: Sparkles },
];

export { Clock, ListOrdered, AtSign, Hash, Pencil };
