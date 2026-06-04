import type { HTMLAttributes } from "react";

import { joinClassNames } from "@/utils";

export type KbdProps = HTMLAttributes<HTMLElement>;

export const Kbd = ({ className, children, ...props }: KbdProps) => (
  <kbd className={joinClassNames("tp-kbd", className)} {...props}>
    {children}
  </kbd>
);
