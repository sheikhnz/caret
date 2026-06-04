import type { ProviderComponent, ProviderProps } from "./types";

/**
 * Nests providers outer → inner. Add new entries to `APP_PROVIDER_CHAIN` only.
 */
export const composeProviders = (
  ...providers: ProviderComponent[]
): ProviderComponent => {
  const ComposedProvider = ({ children }: ProviderProps) =>
    providers.reduceRight(
      (acc, Provider) => <Provider>{acc}</Provider>,
      children,
    );

  return ComposedProvider;
};
