/**
 * Neutral hand pair shown before the user starts typing.
 */

import { memo } from "react";

import { HandIcon } from "./HandIcon";

export const StaticHands = memo(() => (
  <div className="tp-typing-hands__pair">
    <div className="tp-typing-hands__hand tp-typing-hands__hand--left">
      <HandIcon />
    </div>
    <div className="tp-typing-hands__hand tp-typing-hands__hand--right">
      <HandIcon />
    </div>
  </div>
));

StaticHands.displayName = "StaticHands";
