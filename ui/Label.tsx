import type { LabelHTMLAttributes } from "react";

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  required?: boolean;
};

export const Label = ({
  className,
  required = false,
  children,
  ...props
}: LabelProps) => (
  <label
    className={["block text-sm font-medium", className].filter(Boolean).join(" ")}
    {...props}
  >
    {children}
    {required ? (
      <span className="text-(--ant-color-error)" aria-hidden>
        {" "}
        *
      </span>
    ) : null}
  </label>
);
