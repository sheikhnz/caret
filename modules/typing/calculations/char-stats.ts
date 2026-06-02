/**
 * Character and word-level stats counting.
 * Source: frontend/src/ts/test/test-stats.ts → countChars, calculateFinalStats
 *
 * Counts correct, incorrect, extra, and missed characters across all typed words.
 * Used for WPM calculation and the final stats display.
 */

export type CharCount = {
  spaces: number;
  correctWordChars: number;
  allCorrectChars: number;
  incorrectChars: number;
  extraChars: number;
  missedChars: number;
  correctSpaces: number;
};

/**
 * Counts character statistics across typed words vs target words.
 *
 * @param inputWords  array of typed strings (history + optional current)
 * @param targetWords array of target strings (word list)
 * @param isTimedTest  true for time/custom-time modes (affects partial-last-word handling)
 * @param isFinal      true when called after test end
 * @param isZenMode    true in zen mode (no target, accuracy from keypress counters)
 * @param zenAccIncorrect  zen mode incorrect count (from accuracy.incorrect)
 */
export const countChars = (
  inputWords: string[],
  targetWords: string[],
  isTimedTest: boolean,
  isFinal = false,
  isZenMode = false,
  zenAccIncorrect = 0,
): CharCount => {
  if (isZenMode) {
    let correctWordChars = 0;
    let spaces = 0;
    let correctspaces = 0;

    for (let i = 0; i < inputWords.length; i++) {
      correctWordChars += (inputWords[i] ?? "").length;
      if (i < inputWords.length - 1) {
        spaces++;
        correctspaces++;
      }
    }

    return {
      spaces,
      correctWordChars,
      allCorrectChars: correctWordChars,
      incorrectChars: zenAccIncorrect,
      extraChars: 0,
      missedChars: 0,
      correctSpaces: correctspaces,
    };
  }

  let correctWordChars = 0;
  let correctChars = 0;
  let incorrectChars = 0;
  let extraChars = 0;
  let missedChars = 0;
  let spaces = 0;
  let correctspaces = 0;

  for (let i = 0; i < inputWords.length; i++) {
    const inputWord = inputWords[i] ?? "";
    const targetWord = targetWords[i] ?? "";

    if (inputWord === targetWord) {
      correctWordChars += targetWord.length;
      correctChars += targetWord.length;
      const lastChar = inputWord[inputWord.length - 1];
      if (i < inputWords.length - 1 && lastChar !== "\n") {
        correctspaces++;
      }
    } else if (inputWord.length >= targetWord.length) {
      for (let c = 0; c < inputWord.length; c++) {
        if (c < targetWord.length) {
          if (inputWord[c] === targetWord[c]) {
            correctChars++;
          } else {
            incorrectChars++;
          }
        } else {
          extraChars++;
        }
      }
    } else {
      const toAdd = { correct: 0, incorrect: 0, missed: 0 };
      for (let c = 0; c < targetWord.length; c++) {
        if (c < inputWord.length) {
          if (inputWord[c] === targetWord[c]) {
            toAdd.correct++;
          } else {
            toAdd.incorrect++;
          }
        } else {
          toAdd.missed++;
        }
      }
      correctChars += toAdd.correct;
      incorrectChars += toAdd.incorrect;

      const shouldCountPartialLastWord = !isFinal || (isFinal && isTimedTest);
      if (i === inputWords.length - 1 && shouldCountPartialLastWord) {
        if (toAdd.incorrect === 0) correctWordChars += toAdd.correct;
      } else {
        missedChars += toAdd.missed;
      }
    }

    if (i < inputWords.length - 1) {
      spaces++;
    }
  }

  return {
    spaces,
    correctWordChars,
    allCorrectChars: correctChars,
    incorrectChars: isZenMode ? zenAccIncorrect : incorrectChars,
    extraChars,
    missedChars,
    correctSpaces: correctspaces,
  };
};
