/**
 * Custom text parsing and cleanup.
 * Source: frontend/src/ts/components/modals/CustomTextModal.tsx
 */

export const cleanUpCustomText = ({
  rawText,
  pipeDelimiter,
}: {
  rawText: string;
  pipeDelimiter: boolean;
}): string[] => {
  if (rawText === "") return [];

  let text = rawText.normalize();
  text = text.replace(/[\u2000-\u200A\u202F\u205F\u00A0]/g, " ");
  text = text.replace(/ +/gm, " ");
  text = text.replace(/( *(\r\n|\r|\n) *)/g, "\n ");

  return text
    .split(pipeDelimiter ? "|" : " ")
    .map((word) => word.trim())
    .filter((word) => word !== "");
};

export const customTextToRaw = ({
  text,
  pipeDelimiter,
}: {
  text: string[];
  pipeDelimiter: boolean;
}): string => {
  return text.join(pipeDelimiter ? "|" : " ");
};
