/**
 * Custom text / lesson editor modal.
 */

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { cn } from "@/utils";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { Input } from "@/ui/Input";
import { Textarea } from "@/ui/Textarea";

import type {
  CustomTextMode,
  CustomTextSettings,
} from "../../types/custom-text";

import {
  cleanUpCustomText,
  customTextToRaw,
} from "../../services/custom-text-utils";
import { isCloseDialogShortcut } from "../../constants/keyboard-shortcuts";
import { useConfigStore } from "../../stores/config-store";
import { useCustomTextStore } from "../../stores/custom-text-store";

type FormMode = "simple" | CustomTextMode;

type CustomTextModalProps = {
  open: boolean;
  onClose: () => void;
  onApplied?: () => void;
};

type CustomTextFormState = {
  text: string;
  formMode: FormMode;
  pipeDelimiter: boolean;
  limitWord: string;
  limitTime: string;
  limitSection: string;
};

const settingsToFormState = (
  settings: CustomTextSettings,
): CustomTextFormState => {
  const formMode: FormMode =
    settings.mode === "repeat" &&
    ((settings.limit.mode === "word" &&
      settings.limit.value === settings.text.length) ||
      (settings.limit.mode === "section" &&
        settings.limit.value === settings.text.length))
      ? "simple"
      : settings.mode;

  return {
    text: customTextToRaw({
      text: settings.text,
      pipeDelimiter: settings.pipeDelimiter,
    }),
    formMode,
    pipeDelimiter: settings.pipeDelimiter,
    limitWord:
      settings.limit.mode === "word" &&
      !(
        settings.mode === "repeat" &&
        settings.limit.value === settings.text.length
      )
        ? String(settings.limit.value)
        : "",
    limitTime:
      settings.limit.mode === "time" ? String(settings.limit.value) : "",
    limitSection:
      settings.limit.mode === "section" ? String(settings.limit.value) : "",
  };
};

const MODE_OPTIONS: { value: FormMode; label: string }[] = [
  { value: "simple", label: "Simple" },
  { value: "repeat", label: "Repeat" },
  { value: "shuffle", label: "Shuffle" },
  { value: "random", label: "Random" },
];

const SEGMENT_CLASS =
  "inline-flex items-center rounded-md border border-border-subtle bg-surface";

const SegBtn = ({
  active,
  disabled,
  onClick,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={cn(
      "cursor-pointer select-none px-2.5 py-2 text-sm leading-none transition-colors duration-150",
      active ? "text-accent" : "text-text-muted hover:text-text-primary",
      disabled && "pointer-events-none opacity-45",
    )}
  >
    {children}
  </button>
);

type CustomTextModalFormProps = {
  onClose: () => void;
  onApplied?: () => void;
};

const CustomTextModalForm = ({
  onClose,
  onApplied,
}: CustomTextModalFormProps) => {
  const { setConfig } = useConfigStore();
  const { settings, savedTexts, setSettings, saveText, deleteText } =
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
    if (text.trim() === "") {
      setError("Text cannot be empty");
      return;
    }

    const activeLimits = [limitWord, limitTime, limitSection].filter(
      (limit) => limit !== "",
    );
    if (activeLimits.length > 1) {
      setError("You can only specify one limit");
      return;
    }

    if (
      formMode !== "simple" &&
      limitWord === "" &&
      limitTime === "" &&
      limitSection === ""
    ) {
      setError("You need to specify a limit");
      return;
    }

    const cleaned = cleanUpCustomText({ rawText: text, pipeDelimiter });
    if (cleaned.length === 0) {
      setError("Text cannot be empty");
      return;
    }

    const nextSettings: CustomTextSettings = {
      text: cleaned,
      pipeDelimiter,
      mode: formMode === "simple" ? "repeat" : formMode,
      limit: { value: cleaned.length, mode: "word" },
    };

    if (formMode === "simple" && pipeDelimiter) {
      nextSettings.limit = { value: cleaned.length, mode: "section" };
    } else if (formMode === "simple") {
      nextSettings.limit = { value: cleaned.length, mode: "word" };
    } else if (limitWord !== "") {
      nextSettings.limit = { value: parseInt(limitWord, 10), mode: "word" };
    } else if (limitTime !== "") {
      nextSettings.limit = { value: parseInt(limitTime, 10), mode: "time" };
    } else if (limitSection !== "") {
      nextSettings.limit = {
        value: parseInt(limitSection, 10),
        mode: "section",
      };
    }

    setSettings(nextSettings);
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

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isCloseDialogShortcut(event)) {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="custom-text-title"
        >
          <Card className="flex max-h-[85vh] w-full max-w-lg flex-col gap-4 overflow-hidden p-4 md:p-5">
            <div className="flex items-center justify-between gap-3">
              <h2
                id="custom-text-title"
                className="text-base font-medium text-text-primary"
              >
                Custom Text
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="text-sm text-text-muted transition-colors hover:text-text-primary"
              >
                Esc
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
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

              <div className="flex flex-wrap items-center gap-2">
                <div className={SEGMENT_CLASS} role="group" aria-label="Mode">
                  {MODE_OPTIONS.map(({ value, label }) => (
                    <SegBtn
                      key={value}
                      active={formMode === value}
                      onClick={() => setFormMode(value)}
                    >
                      {label}
                    </SegBtn>
                  ))}
                </div>
                <div
                  className={SEGMENT_CLASS}
                  role="group"
                  aria-label="Delimiter"
                >
                  <SegBtn
                    active={!pipeDelimiter}
                    onClick={() => setPipeDelimiter(false)}
                  >
                    Space
                  </SegBtn>
                  <SegBtn
                    active={pipeDelimiter}
                    onClick={() => setPipeDelimiter(true)}
                  >
                    Pipe
                  </SegBtn>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Input
                  id="limit-word"
                  type="number"
                  min={0}
                  value={limitWord}
                  disabled={limitsDisabled || pipeDelimiter}
                  onChange={(e) => setLimitWord(e.target.value)}
                  placeholder="Words"
                  aria-label="Word limit"
                  className="h-9 min-h-9 px-3 py-2 text-sm"
                />
                <Input
                  id="limit-time"
                  type="number"
                  min={0}
                  value={limitTime}
                  disabled={limitsDisabled}
                  onChange={(e) => setLimitTime(e.target.value)}
                  placeholder="Seconds"
                  aria-label="Time limit in seconds"
                  className="h-9 min-h-9 px-3 py-2 text-sm"
                />
                <Input
                  id="limit-section"
                  type="number"
                  min={0}
                  value={limitSection}
                  disabled={limitsDisabled || !pipeDelimiter}
                  onChange={(e) => setLimitSection(e.target.value)}
                  placeholder="Sections"
                  aria-label="Section limit"
                  className="h-9 min-h-9 px-3 py-2 text-sm"
                />
              </div>

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
                    Save
                  </Button>
                  <button
                    type="button"
                    onClick={() => setShowSaved((prev) => !prev)}
                    className="shrink-0 text-sm text-text-muted transition-colors hover:text-text-primary"
                  >
                    Saved ({savedNames.length})
                  </button>
                </div>

                {showSaved && (
                  <div className="space-y-1">
                    {savedNames.length === 0 ? (
                      <p className="text-xs text-text-muted">
                        No saved lessons
                      </p>
                    ) : (
                      savedNames.map((name) => (
                        <div key={name} className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleLoadSaved(name)}
                            className="min-w-0 flex-1 truncate text-left text-sm text-text-secondary transition-colors hover:text-accent"
                          >
                            {name}
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteText(name)}
                            className="text-xs text-text-muted transition-colors hover:text-error"
                          >
                            Delete
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {error !== null && (
                <p className="text-xs text-error" role="alert">
                  {error}
                </p>
              )}
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={handleSubmit}
            >
              Start
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export const CustomTextModal = ({
  open,
  onClose,
  onApplied,
}: CustomTextModalProps) => {
  if (!open) return null;

  return <CustomTextModalForm onClose={onClose} onApplied={onApplied} />;
};
