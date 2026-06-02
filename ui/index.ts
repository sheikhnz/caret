export { Badge } from "./Badge";
export { Button } from "./Button";
export { Card } from "./Card";
export { Input } from "./Input";
export { Textarea } from "./Textarea";
export { Kbd } from "./Kbd";
export { Label } from "./Label";
export { Separator } from "./Separator";

export const UI_COMPONENTS = [
  "Badge",
  "Button",
  "Card",
  "Separator",
  "Input",
  "Textarea",
  "Kbd",
  "Label",
] as const;

export type UIComponentName = (typeof UI_COMPONENTS)[number];
