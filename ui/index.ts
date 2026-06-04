export { AntdProvider } from "./AntdProvider";
export { Badge } from "./Badge";
export { Button } from "./Button";
export { Card } from "./Card";
export { Input } from "./Input";
export { Select } from "./Select";
export type { SelectProps } from "antd";
export { Textarea } from "./Textarea";
export { Kbd } from "./Kbd";
export { Label } from "./Label";
export { Modal } from "./Modal";
export {
  AppPillAction,
  AppSegmented,
  AppToggleGroup,
  Segmented,
  SEGMENTED_GROUP_CLASS,
  TEST_CONFIG_PILL_CLASS,
  type SegmentedOption,
} from "./SegmentedControl";
export { Separator } from "./Separator";
export {
  Skeleton,
  SkeletonLoader,
  SKELETON_IDS,
  SKELETON_REGISTRY,
  isSkeletonId,
  type SkeletonId,
} from "./skeletons";

export { Divider, Space, Typography, Slider, Checkbox, Flex, List } from "antd";

export const UI_COMPONENTS = [
  "Badge",
  "Button",
  "Card",
  "Separator",
  "Input",
  "Select",
  "Textarea",
  "Kbd",
  "Label",
  "Modal",
  "Segmented",
] as const;

export type UIComponentName = (typeof UI_COMPONENTS)[number];
