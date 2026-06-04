/**
 * Renders keyboard shortcut keys from the central shortcuts registry.
 */

import { Fragment } from "react";

import { Flex } from "antd";

import { Kbd } from "@/ui";

import type { ShortcutDefinition } from "../constants/keyboard-shortcuts";

type ShortcutKeysProps = {
  shortcut: ShortcutDefinition;
};

export const ShortcutKeys = ({ shortcut }: ShortcutKeysProps) => (
  <Flex align="center" gap={4} component="span" className="tp-shortcut-keys">
    {shortcut.displayKeys.map((key, index) => (
      <Fragment key={`${shortcut.id}-${key}`}>
        {index > 0 && shortcut.keySeparator ? (
          <span className="tp-kbd-separator" aria-hidden>
            {shortcut.keySeparator}
          </span>
        ) : null}
        <Kbd>{key}</Kbd>
      </Fragment>
    ))}
  </Flex>
);
