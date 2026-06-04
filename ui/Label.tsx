import type { LabelHTMLAttributes } from "react";

import { joinClassNames } from "@/utils";

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  required?: boolean;
};

export const Label = ({
  className,
  required = false,
  children,
  ...props
}: LabelProps) => (
  <label className={joinClassNames("tp-form-label", className)} {...props}>
    {children}
    {required ? (
      <span className="tp-form-label-required" aria-hidden>
        {" "}
        *
      </span>
    ) : null}
  </label>
);
