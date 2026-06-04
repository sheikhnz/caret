/**
 * Root document head — composes head fragments without coupling them.
 * To add a fragment: create `app-head/<name>/`, export from its index, append here.
 */

import { composeHead } from "./compose-head";
import { ThemeStyle } from "./theme";

/** First in document order when sequence matters. */
const APP_HEAD_CHAIN = [ThemeStyle] as const;

const ComposedAppHead = composeHead(...APP_HEAD_CHAIN);

export const AppHead = ComposedAppHead;
