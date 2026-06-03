/**
 * Custom text modal body — remounted when opened so form state matches persisted settings.
 */

"use client";

import { useCallback, useMemo, useState } from "react";

import { Button, Input, Modal, Textarea } from "@/ui";

import { getKeyboardShortcut } from "@/modules/typing/constants/keyboard-shortcuts";
import type { CustomTextModalShortcutAction } from "@/modules/typing/constants/keyboard-shortcuts";
import { ShortcutKeys } from "@/modules/typing/components/ShortcutKeys";
import { useCustomTextModalShortcuts } from "@/modules/typing/hooks/use-custom-text-modal-shortcuts";

import {
  buildSettingsFromForm,
  settingsToFormState,
} from "@/modules/typing/custom-text/form-state";
import { CUSTOM_TEXT_MODAL_TITLE_ID } from "@/modules/typing/custom-text/constants";
import { cleanUpCustomText } from "@/modules/typing/custom-text/utils";
import { useConfigStore } from "@/modules/typing/stores/config-store";
import { useCustomTextStore } from "@/modules/typing/stores/custom-text-store";
import type { CustomTextSettings } from "@/modules/typing/types/custom-text";

import { LimitFields } from "./LimitFields";
import { ModeDelimiterFields } from "./ModeDelimiterFields";
import { SavedTextsPanel } from "./SavedTextsPanel";

type CustomTextModalFormContentProps = {
  settings: CustomTextSettings;
  onClose: () => void;
  onApplied?: () => void;
};

export const CustomTextModalFormContent = ({
  settings,
  onClose,
  onApplied,
}: CustomTextModalFormContentProps) => {
  const { setConfig } = useConfigStore();
  const { savedTexts, setSettings, saveText, deleteText } =
    useCustomTextStore();

  const initialFormState = settingsToFormState(settings);

  const [text, setText] = useState(initialFormState.text);
  const [formMode, setFormMode] = useState(initialFormState.formMode);
  const [pipeDelimiter, setPipeDelimiter] = useState(
    initialFormState.pipeDelimiter,
  );
  const [limitWord, setLimitWord] = useState(initialFormState.limitWord);
  const [limitTime, setLimitTime] = useState(initialFormState.limitTime);
  const [limitSection, setLimitSection] = useState(
    initialFormState.limitSection,
  );
  const [saveName, setSaveName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showSaved, setShowSaved] = useState(false);

  const savedNames = useMemo(
    () => Object.keys(savedTexts).sort(),
    [savedTexts],
  );

  const parsedPreview = useMemo(
    () => cleanUpCustomText({ rawText: text, pipeDelimiter }),
    [text, pipeDelimiter],
  );

  const handleLoadSaved = useCallback(
    (name: string) => {
      const saved = savedTexts[name];
      if (saved === undefined) return;
      setText(saved);
      setShowSaved(false);
    },
    [savedTexts],
  );

  const handleSave = useCallback(() => {
    const trimmed = saveName.trim();
    if (trimmed === "") {
      setError("Enter a name to save this lesson");
      return;
    }
    if (text.trim() === "") {
      setError("Text cannot be empty");
      return;
    }
    saveText({ name: trimmed, text });
    setSaveName("");
    setError(null);
  }, [saveName, saveText, text]);

  const handleSubmit = useCallback(() => {
    const result = buildSettingsFromForm({
      text,
      formMode,
      pipeDelimiter,
      limitWord,
      limitTime,
      limitSection,
    });

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setSettings(result.settings);
    setConfig("mode", "custom");
    setError(null);
    onApplied?.();
    onClose();
  }, [
    formMode,
    limitSection,
    limitTime,
    limitWord,
    onApplied,
    onClose,
    pipeDelimiter,
    setConfig,
    setSettings,
    text,
  ]);

  const limitsDisabled = formMode === "simple";

  const handleModalShortcut = useCallback(
    (action: CustomTextModalShortcutAction) => {
      switch (action.type) {
        case "start":
          handleSubmit();
          break;
        case "save":
          handleSave();
          break;
        case "toggleSavedPanel":
          setShowSaved((prev) => !prev);
          break;
        case "setFormMode":
          setFormMode(action.mode);
          break;
        case "setPipeDelimiter":
          setPipeDelimiter(action.pipeDelimiter);
          break;
      }
    },
    [handleSave, handleSubmit],
  );

  useCustomTextModalShortcuts({ open: true, onAction: handleModalShortcut });

  return (
    <Modal
      open
      onClose={onClose}
      title="Custom Text"
      titleId={CUSTOM_TEXT_MODAL_TITLE_ID}
      footer={
        <Button
          variant="primary"
          size="md"
          className="w-full"
          onClick={handleSubmit}
        >
          <span className="inline-flex items-center justify-center gap-2">
            Start
            <ShortcutKeys shortcut={getKeyboardShortcut("customTextStart")} />
          </span>
        </Button>
      }
    >
      <div className="space-y-1.5">
        <Textarea
          id="custom-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type custom text"
          className="min-h-28 px-3 py-3 text-sm"
        />
        <p className="text-xs text-text-muted">
          {parsedPreview.length} {pipeDelimiter ? "Sections" : "Words"}
        </p>
      </div>

      <ModeDelimiterFields
        formMode={formMode}
        pipeDelimiter={pipeDelimiter}
        onFormModeChange={setFormMode}
        onPipeDelimiterChange={setPipeDelimiter}
      />

      <LimitFields
        limitWord={limitWord}
        limitTime={limitTime}
        limitSection={limitSection}
        limitsDisabled={limitsDisabled}
        pipeDelimiter={pipeDelimiter}
        onLimitWordChange={setLimitWord}
        onLimitTimeChange={setLimitTime}
        onLimitSectionChange={setLimitSection}
      />

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Input
            id="save-name"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            placeholder="Save as…"
            aria-label="Save lesson as"
            className="h-9 min-h-9 flex-1 px-3 py-2 text-sm"
          />
          <Button variant="secondary" size="sm" onClick={handleSave}>
            <span className="inline-flex items-center gap-1.5">
              Save
              <ShortcutKeys shortcut={getKeyboardShortcut("customTextSave")} />
            </span>
          </Button>
          <button
            type="button"
            onClick={() => setShowSaved((prev) => !prev)}
            className="inline-flex shrink-0 items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text-primary"
          >
            Saved ({savedNames.length})
            <ShortcutKeys
              shortcut={getKeyboardShortcut("customTextSavedPanel")}
            />
          </button>
        </div>

        <SavedTextsPanel
          savedNames={savedNames}
          showSaved={showSaved}
          onLoad={handleLoadSaved}
          onDelete={deleteText}
        />
      </div>

      {error !== null && (
        <p className="text-xs text-error" role="alert">
          {error}
        </p>
      )}
    </Modal>
  );
};
