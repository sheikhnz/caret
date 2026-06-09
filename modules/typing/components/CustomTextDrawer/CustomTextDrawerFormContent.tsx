/**
 * Custom text drawer body — remounted when opened so form state matches persisted settings.
 */

"use client";

import { useCallback, useMemo, useState } from "react";

import { Button, Flex, Space, Typography } from "antd";

import { Button as UiButton, Drawer, Input, Label, Textarea } from "@/ui";

import { getKeyboardShortcut } from "@/modules/typing/constants/keyboard-shortcuts";
import type { CustomTextDrawerShortcutAction } from "@/modules/typing/constants/keyboard-shortcuts";
import { ShortcutKeys } from "@/modules/typing/components/ShortcutKeys";
import { useCustomTextDrawerShortcuts } from "@/modules/typing/hooks/keyboard-shortcuts";
import { SettingsSection } from "@/modules/typing/components/SettingsDrawer/SettingsSection";

import {
  buildSettingsFromForm,
  settingsToFormState,
} from "@/modules/typing/custom-text/form-state";
import { CUSTOM_TEXT_DRAWER_TITLE_ID } from "@/modules/typing/custom-text/constants";
import { cleanUpCustomText } from "@/modules/typing/custom-text/utils";
import { useConfigStore } from "@/modules/typing/stores/config-store";
import { useCustomTextStore } from "@/modules/typing/stores";
import type { CustomTextSettings } from "@/modules/typing/types/custom-text";

import { CustomTextTestOptions } from "./CustomTextTestOptions";
import { SavedLessonSelect } from "./SavedLessonSelect";

type CustomTextDrawerFormContentProps = {
  open: boolean;
  settings: CustomTextSettings;
  onClose: () => void;
  onApplied?: () => void;
};

export const CustomTextDrawerFormContent = ({
  open,
  settings,
  onClose,
  onApplied,
}: CustomTextDrawerFormContentProps) => {
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
  const [loadSelection, setLoadSelection] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);

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

  const handlePipeDelimiterChange = useCallback((nextPipeDelimiter: boolean) => {
    setPipeDelimiter(nextPipeDelimiter);
    if (nextPipeDelimiter) {
      setLimitWord("");
    } else {
      setLimitSection("");
    }
  }, []);

  const handleLoadSavedSelect = useCallback(
    (name: string) => {
      setLoadSelection(undefined);
      handleLoadSaved(name);
    },
    [handleLoadSaved],
  );

  const handleDeleteSaved = useCallback(
    (name: string) => {
      deleteText(name);
      setLoadSelection(undefined);
      setError(null);
    },
    [deleteText],
  );

  const handleDrawerShortcut = useCallback(
    (action: CustomTextDrawerShortcutAction) => {
      if (action.type === "start") handleSubmit();
    },
    [handleSubmit],
  );

  useCustomTextDrawerShortcuts({ open, onAction: handleDrawerShortcut });

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Custom Text"
      titleId={CUSTOM_TEXT_DRAWER_TITLE_ID}
      width={448}
      footer={
        <UiButton variant="primary" size="md" block onClick={handleSubmit}>
          <Space size={8} align="center">
            Start
            <ShortcutKeys shortcut={getKeyboardShortcut("customTextStart")} />
          </Space>
        </UiButton>
      }
    >
      <Flex vertical gap={24}>
        <SettingsSection 
        title="Text" 
        >
          <Textarea
            id="custom-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type custom text"
            rows={5}
          />
          <Typography.Text type="secondary" className="tp-section-note">
            {parsedPreview.length} {pipeDelimiter ? "sections" : "words"} in
            text
          </Typography.Text>
        </SettingsSection>

        <CustomTextTestOptions
          formMode={formMode}
          pipeDelimiter={pipeDelimiter}
          limitWord={limitWord}
          limitTime={limitTime}
          limitSection={limitSection}
          onFormModeChange={setFormMode}
          onPipeDelimiterChange={handlePipeDelimiterChange}
          onLimitWordChange={setLimitWord}
          onLimitTimeChange={setLimitTime}
          onLimitSectionChange={setLimitSection}
        />

        <SettingsSection
          title="Saved lessons"
          description="Store and reload custom text for later."
        >
          <Flex vertical gap={6}>
            <Label htmlFor="save-name">Save as</Label>
            <Typography.Text type="secondary">
              Name the current text and save it to your library.
            </Typography.Text>
            <Space.Compact block className="tp-save-compact">
              <Input
                id="save-name"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="Save as…"
                aria-label="Save lesson as"
              />
              <Button onClick={handleSave}>Save</Button>
            </Space.Compact>
          </Flex>

          {savedNames.length > 0 ? (
            <SavedLessonSelect
              savedNames={savedNames}
              value={loadSelection}
              onLoad={handleLoadSavedSelect}
              onDelete={handleDeleteSaved}
            />
          ) : (
            <Typography.Text type="secondary">No saved lessons yet</Typography.Text>
          )}
        </SettingsSection>

        {error !== null ? (
          <Typography.Text type="danger" role="alert">
            {error}
          </Typography.Text>
        ) : null}
      </Flex>
    </Drawer>
  );
};
