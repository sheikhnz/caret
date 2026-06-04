import type { ReactNode } from "react";

export type ProviderProps = {
  children: ReactNode;
};

export type ProviderComponent = (props: ProviderProps) => ReactNode;
