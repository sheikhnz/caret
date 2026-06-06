import {
  ClockCircleOutlined,
  CoffeeOutlined,
  EditOutlined,
  FieldTimeOutlined,
  FontColorsOutlined,
  HighlightOutlined,
  NumberOutlined,
  OrderedListOutlined,
  ReadOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import type { ComponentType } from "react";

import type { TestMode } from "@/modules/typing/types/config";

export type TestConfigIcon = ComponentType<{
  "aria-hidden"?: boolean;
  className?: string;
}>;

export const CONFIG_TRANSITION = { duration: 0.25, ease: "easeInOut" as const };
export const LAYOUT_TRANSITION = { layout: CONFIG_TRANSITION };

export const TEST_CONFIG_MODES: {
  key: TestMode;
  label: string;
  icon: TestConfigIcon;
}[] = [
  { key: "time", label: "Time", icon: FieldTimeOutlined },
  { key: "words", label: "Words", icon: UnorderedListOutlined },
  { key: "quote", label: "Quote", icon: ReadOutlined },
  { key: "custom", label: "Custom", icon: HighlightOutlined },
  { key: "zen", label: "Zen", icon: CoffeeOutlined },
];

export {
  ClockCircleOutlined as Clock,
  OrderedListOutlined as ListOrdered,
  FontColorsOutlined as Punctuation,
  NumberOutlined as Hash,
  EditOutlined as Pencil,
};
