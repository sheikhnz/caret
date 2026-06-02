/**
 * Renders keyboard shortcut keys from the central shortcuts registry.
 */

import { Fragment } from "react";

import { Kbd } from "@/ui/Kbd";

import type { ShortcutDefinition } from "../constants/keyboard-shortcuts";

type ShortcutKeysProps = {
  shortcut: ShortcutDefinition;
};

export const ShortcutKeys = ({ shortcut }: ShortcutKeysProps) => (
  <>
    {shortcut.displayKeys.map((key, index) => (
      <Fragment key={`${shortcut.id}-${key}-${index}`}>
        {index > 0 && shortcut.keySeparator ? (
          <span>{shortcut.keySeparator}</span>
        ) : null}
        <Kbd>{key}</Kbd>
      </Fragment>
    ))}
  </>
);
