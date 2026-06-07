"use client";

import { memo } from "react";
import { Flex } from "antd";

import { joinClassNames } from "@/utils";

import {
  FINGER_CSS_CLASS,
  FINGER_MAP_LAYOUT,
  FINGER_ROW_CLASS,
  type FingerId,
  type FingerMapKey,
} from "../constants";
import { isTargetKey, normalizeTargetKey } from "./target-key-match";

type KeyboardProps = {
  targetKey: string | null;
  activeFinger: FingerId | null;
};

type KeyCapProps = {
  keyDef: FingerMapKey;
  targetKey: string | null;
  activeFinger: FingerId | null;
};

const KeyCap = memo(({ keyDef, targetKey, activeFinger }: KeyCapProps) => {
  const highlighted = isTargetKey({ keyLabel: keyDef.label, targetKey });
  const fingerActive = activeFinger === keyDef.finger && highlighted;
  const capLabel = keyDef.displayLabel ?? keyDef.label;

  return (
    <div
      className={joinClassNames(
        "tp-finger-map-key",
        FINGER_CSS_CLASS[keyDef.finger],
        keyDef.wide && "tp-finger-map-key--wide",
        highlighted && "tp-finger-map-key--target",
        fingerActive && "tp-finger-map-key--finger-active",
      )}
      aria-hidden
    >
      <span
        className={joinClassNames(
          "tp-finger-map-key-label",
          keyDef.wide && "tp-finger-map-key-label--wide",
        )}
      >
        {capLabel}
      </span>
    </div>
  );
});

KeyCap.displayName = "KeyCap";

/**
 * ANSI QWERTY keyboard grid with per-finger color coding and target-key highlight.
 */
export const Keyboard = memo(({ targetKey, activeFinger }: KeyboardProps) => {
  const normalizedTarget = normalizeTargetKey(targetKey);

  return (
    <div className="tp-finger-map-scroll">
      <Flex vertical align="center" gap={6} className="tp-finger-map-keyboard">
        {FINGER_MAP_LAYOUT.map((row, rowIndex) => (
          <Flex
            key={rowIndex}
            gap={5}
            justify="center"
            className={joinClassNames(
              "tp-finger-map-row",
              FINGER_ROW_CLASS[row.offset],
            )}
          >
            {row.keys.map((keyDef) => (
              <KeyCap
                key={keyDef.wide ? "space" : keyDef.label}
                keyDef={keyDef}
                targetKey={normalizedTarget}
                activeFinger={activeFinger}
              />
            ))}
          </Flex>
        ))}
      </Flex>
    </div>
  );
});

Keyboard.displayName = "Keyboard";
