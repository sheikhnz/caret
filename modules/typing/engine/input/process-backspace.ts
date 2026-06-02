import type { TypingConfig } from "../../types/config";
import * as TestInput from "./test-input";
import * as TestState from "../runtime/test-state";

export const processBackspace = (
  config: TypingConfig,
  wordIndex: number,
): "charRemoved" | "wordBack" | "blocked" => {
  if (TestInput.currentInput.length > 0) {
    TestInput.setCurrentInput(TestInput.currentInput.slice(0, -1));
    return "charRemoved";
  }

  if (config.stopOnError === "word") return "blocked";
  if (wordIndex === 0) return "blocked";

  const prevInput = TestInput.popInputHistory();
  TestInput.setCurrentInput(prevInput);
  TestInput.popCorrectedHistory();
  TestState.setActiveWordIndex(wordIndex - 1);
  return "wordBack";
};
