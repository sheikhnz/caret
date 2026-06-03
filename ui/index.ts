export { Badge } from "./Badge";
export { Button } from "./Button";
export { Card } from "./Card";
export { Input } from "./Input";
export { Select } from "./Select";
export { Textarea } from "./Textarea";
export { Kbd } from "./Kbd";
export { Label } from "./Label";
export { Modal } from "./Modal";
export { SegmentedButton } from "./SegmentedButton";
export { SegmentedGroup, SEGMENTED_GROUP_CLASS } from "./SegmentedGroup";
export { Separator } from "./Separator";
export {
  Skeleton,
  SkeletonLoader,
  SKELETON_IDS,
  SKELETON_REGISTRY,
  isSkeletonId,
  type SkeletonId,
} from "./skeletons";

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
] as const;

export type UIComponentName = (typeof UI_COMPONENTS)[number];
