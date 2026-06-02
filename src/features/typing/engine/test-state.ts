/**
 * Mutable test-phase and flag state for the typing engine.
 * Source: frontend/src/ts/test/test-state.ts
 *
 * Uses module-level mutable variables (same pattern as the original).
 * All setters/getters are exported so stores/hooks can read and dispatch updates.
 */

import type { TestPhase } from "../types/engine";

let _phase: TestPhase = "idle";
let _activeWordIndex = 0;
let _resultCalculating = false;
let _testRestarting = false;
let _bailedOut = false;
let _isRepeated = false;
let _isLanguageRightToLeft = false;
let _koreanStatus = false;

export const getPhase = (): TestPhase => _phase;
export const isActive = (): boolean => _phase === "active";
export const isFinished = (): boolean => _phase === "finished";

export const setPhase = (phase: TestPhase): void => {
  _phase = phase;
};

export const getActiveWordIndex = (): number => _activeWordIndex;
export const setActiveWordIndex = (i: number): void => {
  _activeWordIndex = i;
};
export const incrementActiveWordIndex = (): void => {
  _activeWordIndex++;
};

export const isResultCalculating = (): boolean => _resultCalculating;
export const setResultCalculating = (v: boolean): void => {
  _resultCalculating = v;
};

export const isTestRestarting = (): boolean => _testRestarting;
export const setTestRestarting = (v: boolean): void => {
  _testRestarting = v;
};

export const isBailedOut = (): boolean => _bailedOut;
export const setBailedOut = (v: boolean): void => {
  _bailedOut = v;
};

export const isRepeated = (): boolean => _isRepeated;
export const setRepeated = (v: boolean): void => {
  _isRepeated = v;
};

export const isRightToLeft = (): boolean => _isLanguageRightToLeft;
export const setRightToLeft = (v: boolean): void => {
  _isLanguageRightToLeft = v;
};

export const isKorean = (): boolean => _koreanStatus;
export const setKorean = (v: boolean): void => {
  _koreanStatus = v;
};

export const resetState = (): void => {
  _phase = "idle";
  _activeWordIndex = 0;
  _resultCalculating = false;
  _testRestarting = false;
  _bailedOut = false;
  _isRepeated = false;
  _isLanguageRightToLeft = false;
  _koreanStatus = false;
};
