import type { HeadFragmentComponent } from "./types";

/**
 * Renders head fragments in order. Add new entries to `APP_HEAD_CHAIN` only.
 */
export const composeHead = (
  ...fragments: HeadFragmentComponent[]
): HeadFragmentComponent => {
  const ComposedHead = () => (
    <>
      {fragments.map((Fragment, index) => (
        <Fragment key={Fragment.name || String(index)} />
      ))}
    </>
  );

  return ComposedHead;
};
