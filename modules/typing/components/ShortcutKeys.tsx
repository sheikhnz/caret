/**
 * Renders keyboard shortcut keys from the central shortcuts registry.
 */

import { Fragment } from "react";

import { Flex, Typography } from "antd";

import { Kbd } from "@/ui";

import type { ShortcutDefinition } from "../constants/keyboard-shortcuts";

type ShortcutKeysProps = {
  shortcut: ShortcutDefinition;
};

/**
 * Inline shortcut chips — Ant Flex defaults to `display: flex` (block in <p>);
 * override to `inline-flex` so text like "Press F10 to …" stays on one line.
 */
export const ShortcutKeys = ({ shortcut }: ShortcutKeysProps) => (
  <Flex
    component="span"
    align="center"
    gap={4}
    className="tp-shortcut-keys"
    style={{ display: "inline-flex" }}
  >
    {shortcut.displayKeys.map((key, index) => (
      <Fragment key={`${shortcut.id}-${key}`}>
        {index > 0 && shortcut.keySeparator ? (
          <Typography.Text
            component="span"
            className="tp-kbd-separator"
            aria-hidden
          >
            {shortcut.keySeparator}
          </Typography.Text>
        ) : null}
        <Kbd>{key}</Kbd>
      </Fragment>
    ))}
  </Flex>
);
