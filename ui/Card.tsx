import { cn } from "@/utils";

interface CardProps {
  elevated?: boolean;
  className?: string;
  id?: string;
  children: React.ReactNode;
}

export function Card({ elevated = false, className, id, children }: CardProps) {
  return (
    <div
      id={id}
      className={cn(
        "rounded-md border border-border-subtle bg-surface p-5 md:p-6",
        elevated &&
          "border-border bg-surface-elevated shadow-(--tp-shadow-elevated)",
        className,
      )}
    >
      {children}
    </div>
  );
}
