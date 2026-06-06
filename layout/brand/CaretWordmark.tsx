/**
 * Visual wordmark: C^ret — circumflex evokes the text caret / insertion point.
 */

import { BRAND_NAME } from "./constants";

type CaretWordmarkProps = {
  className?: string;
};

export const CaretWordmark = ({ className }: CaretWordmarkProps) => (
  <span
    className={
      className ? `tp-brand-wordmark ${className}` : "tp-brand-wordmark"
    }
    aria-label={BRAND_NAME}
  >
    <span className="tp-brand-wordmark-c">C</span>
    <span className="tp-brand-wordmark-accent" aria-hidden="true">
      ^
    </span>
    <span className="tp-brand-wordmark-ret">ret</span>
  </span>
);
