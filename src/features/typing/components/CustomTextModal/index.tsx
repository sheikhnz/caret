/**
 * Custom text / lesson editor modal.
 * Source: frontend/src/ts/components/modals/CustomTextModal.tsx
 */

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { cn } from "@/src/lib/utils";

import type {
  CustomTextMode,
  CustomTextSettings,
} from "../../types/custom-text";

import {
  cleanUpCustomText,
  customTextToRaw,
} from "../../services/custom-text-utils";
import { useConfigStore } from "../../stores/config-store";
import { useCustomTextStore } from "../../stores/custom-text-store";

type FormMode = "simple" | CustomTextMode;

type CustomTextModalProps = {
  open: boolean;
  onClose: () => void;
  onApplied?: () => void;
};

const MODE_OPTIONS: { value: FormMode; label: string }[] = [
  { value: "simple", label: "simple" },
  { value: "repeat", label: "repeat" },
  { value: "shuffle", label: "shuffle" },
  { value: "random", label: "random" },
];

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-sub text-sm">{children}</span>
);

const OptionBtn = ({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "rounded px-3 py-1.5 text-sm transition-colors",
      active ? "bg-accent text-bg" : "bg-sub-alt text-sub hover:text-main",
    )}
  >
    {children}
  </button>
);

export const CustomTextModal = ({
  open,
  onClose,
  onApplied,
}: CustomTextModalProps) => {
  const { setConfig } = useConfigStore();
  const { settings, savedTexts, setSettings, saveText, deleteText } =
    useCustomTextStore();

  const [text, setText] = useState("");
  const [formMode, setFormMode] = useState<FormMode>("simple");
  const [pipeDelimiter, setPipeDelimiter] = useState(false);
  const [limitWord, setLimitWord] = useState("");
  const [limitTime, setLimitTime] = useState("");
  const [limitSection, setLimitSection] = useState("");
  const [saveName, setSaveName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showSaved, setShowSaved] = useState(false);

  const savedNames = useMemo(
    () => Object.keys(savedTexts).sort(),
    [savedTexts],
  );

  useEffect(() => {
    if (!open) return;
    setText(
      customTextToRaw({
        text: settings.text,
        pipeDelimiter: settings.pipeDelimiter,
      }),
    );
    setFormMode(
      settings.mode === "repeat" &&
        ((settings.limit.mode === "word" &&
          settings.limit.value === settings.text.length) ||
          (settings.limit.mode === "section" &&
            settings.limit.value === settings.text.length))
        ? "simple"
        : settings.mode,
    );
    setPipeDelimiter(settings.pipeDelimiter);
    setLimitWord(
      settings.limit.mode === "word" &&
        !(
          settings.mode === "repeat" &&
          settings.limit.value === settings.text.length
        )
        ? String(settings.limit.value)
        : "",
    );
    setLimitTime(
      settings.limit.mode === "time" ? String(settings.limit.value) : "",
    );
    setLimitSection(
      settings.limit.mode === "section" ? String(settings.limit.value) : "",
    );
    setError(null);
    setShowSaved(false);
    setSaveName("");
  }, [open, settings]);

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

  if (!open) return null;

  const limitsDisabled = formMode === "simple";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-bg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-sub-alt px-6 py-4">
          <h2 className="text-lg text-main">Custom text</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-sub transition-colors hover:text-main"
          >
            close
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
          <div className="space-y-2">
            <FieldLabel>Text</FieldLabel>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter custom text or paste a lesson"
              className="min-h-40 w-full resize-y rounded bg-sub-alt px-3 py-2 text-main outline-none focus:ring-1 focus:ring-accent"
            />
            <p className="text-xs text-sub">
              {parsedPreview.length} {pipeDelimiter ? "sections" : "words"}
            </p>
          </div>

          <div className="space-y-2">
            <FieldLabel>Mode</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {MODE_OPTIONS.map(({ value, label }) => (
                <OptionBtn
                  key={value}
                  active={formMode === value}
                  onClick={() => setFormMode(value)}
                >
                  {label}
                </OptionBtn>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <FieldLabel>Delimiter</FieldLabel>
            <div className="flex gap-2">
              <OptionBtn
                active={!pipeDelimiter}
                onClick={() => setPipeDelimiter(false)}
              >
                space
              </OptionBtn>
              <OptionBtn
                active={pipeDelimiter}
                onClick={() => setPipeDelimiter(true)}
              >
                pipe
              </OptionBtn>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <label className="space-y-1">
              <FieldLabel>Word limit</FieldLabel>
              <input
                type="number"
                min={0}
                value={limitWord}
                disabled={limitsDisabled || pipeDelimiter}
                onChange={(e) => setLimitWord(e.target.value)}
                className="w-full rounded bg-sub-alt px-3 py-2 text-main outline-none disabled:opacity-40"
              />
            </label>
            <label className="space-y-1">
              <FieldLabel>Time limit (seconds)</FieldLabel>
              <input
                type="number"
                min={0}
                value={limitTime}
                disabled={limitsDisabled}
                onChange={(e) => setLimitTime(e.target.value)}
                className="w-full rounded bg-sub-alt px-3 py-2 text-main outline-none disabled:opacity-40"
              />
            </label>
            <label className="space-y-1">
              <FieldLabel>Section limit</FieldLabel>
              <input
                type="number"
                min={0}
                value={limitSection}
                disabled={limitsDisabled || !pipeDelimiter}
                onChange={(e) => setLimitSection(e.target.value)}
                className="w-full rounded bg-sub-alt px-3 py-2 text-main outline-none disabled:opacity-40"
              />
            </label>
          </div>

          <div className="space-y-2 rounded bg-sub-alt p-3">
            <div className="flex flex-wrap items-end gap-2">
              <label className="min-w-0 flex-1 space-y-1">
                <FieldLabel>Save lesson as</FieldLabel>
                <input
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="lesson name"
                  className="w-full rounded bg-bg px-3 py-2 text-main outline-none"
                />
              </label>
              <button
                type="button"
                onClick={handleSave}
                className="rounded bg-main px-3 py-2 text-sm text-bg"
              >
                save
              </button>
              <button
                type="button"
                onClick={() => setShowSaved((prev) => !prev)}
                className="rounded px-3 py-2 text-sm text-sub hover:text-main"
              >
                saved ({savedNames.length})
              </button>
            </div>

            {showSaved && (
              <div className="space-y-2 pt-2">
                {savedNames.length === 0 ? (
                  <p className="text-sm text-sub">No saved lessons yet</p>
                ) : (
                  savedNames.map((name) => (
                    <div key={name} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleLoadSaved(name)}
                        className="flex-1 rounded bg-bg px-3 py-2 text-left text-sm text-main hover:text-accent"
                      >
                        {name}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteText(name)}
                        className="rounded px-3 py-2 text-sm text-error hover:underline"
                      >
                        delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {error !== null && <p className="text-sm text-error">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 border-t border-sub-alt px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded px-4 py-2 text-sub hover:text-main"
          >
            cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded bg-accent px-4 py-2 text-bg"
          >
            start custom test
          </button>
        </div>
      </div>
    </div>
  );
};
