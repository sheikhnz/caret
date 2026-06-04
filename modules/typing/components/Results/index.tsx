/**
 * Post-test results screen.
 */

"use client";

import { Flex, Space, Typography } from "antd";

import { Badge, Button, Card, Separator } from "@/ui";

import { ShortcutKeys } from "@/modules/typing/components/ShortcutKeys";
import { KEYBOARD_SHORTCUTS } from "@/modules/typing/constants/keyboard-shortcuts";
import { roundTo2 } from "@/modules/typing/calculations/numbers";
import { useConfigStore } from "@/modules/typing/stores/config-store";
import { useTestStore } from "@/modules/typing/stores/test-store";
import { CharStatsBreakdown } from "./CharStatsBreakdown";
import { StatCard } from "./StatCard";
import { getModeLabel } from "./mode-label";
import { WpmChart } from "./WpmChart";

const MIN_DURATION_S = 1;

export const Results = ({
  onRestart = () => undefined,
  onRepeat = () => undefined,
}: {
  onRestart?: () => void;
  onRepeat?: () => void;
} = {}) => {
  const { result } = useTestStore();
  const { config } = useConfigStore();

  if (!result) return null;

  const [correct, incorrect, extra, missed] = result.charStats;
  const testInvalid = result.testDuration < MIN_DURATION_S;

  const isZenMode = config.mode === "zen";

  const modeLabel = getModeLabel(config.mode, config.time, config.words);
  const timeLabel = `${roundTo2(result.testDuration)}s`;
  const afkLabel =
    result.afkDuration > 0 ? `-${result.afkDuration}s AFK` : undefined;

  const configTags = [
    config.language,
    modeLabel,
    config.punctuation ? "Punctuation" : null,
    config.numbers ? "Numbers" : null,
    config.difficulty !== "normal"
      ? config.difficulty.charAt(0).toUpperCase() + config.difficulty.slice(1)
      : null,
  ].filter(Boolean) as string[];

  return (
    <Flex vertical gap={16} className="tp-content-column">
      <Card elevated className="tp-results-card">
        <Flex vertical gap={24} className="tp-results-card-inner">
          <Flex
            className="tp-results-top"
            gap={24}
            align="flex-start"
            wrap="wrap"
          >
            <Flex vertical gap={16} className="tp-results-hero-col">
              <StatCard
                label="WPM"
                value={result.wpm}
                sub={
                  result.rawWpm !== undefined ? `${result.rawWpm}` : undefined
                }
                subLabel="Raw"
                size="hero"
              />
              <StatCard label="Acc" value={`${result.acc}%`} size="hero" />
            </Flex>

            <div className="tp-results-chart-col">
              {result.chartData !== "toolong" ? (
                <WpmChart data={result.chartData} />
              ) : (
                <Flex
                  align="center"
                  justify="center"
                  className="tp-chart-fallback tp-results-chart"
                >
                  <Typography.Text type="secondary">
                    Test too long to display chart
                  </Typography.Text>
                </Flex>
              )}
            </div>
          </Flex>

          <div className="tp-results-stats-row">
            <Flex wrap gap="32px 16px" justify="space-between">
              <StatCard label="Raw" value={result.rawWpm} />
              <StatCard label="Consistency" value={`${result.consistency}%`} />
              <StatCard label="Time" value={timeLabel} sub={afkLabel} />
              <CharStatsBreakdown stats={[correct, incorrect, extra, missed]} />
              <StatCard label="Test Type" value={modeLabel} size="compact" />
            </Flex>
          </div>
        </Flex>
      </Card>

      {(testInvalid || result.bailedOut) && (
        <Space size={8} wrap>
          {testInvalid && <Badge tone="error">Invalid: too short</Badge>}
          {result.bailedOut && <Badge tone="neutral">Bailed out</Badge>}
        </Space>
      )}

      {configTags.length > 0 && (
        <Space size={8} wrap>
          {configTags.map((tag) => (
            <Badge key={tag} tone="neutral">
              {tag}
            </Badge>
          ))}
        </Space>
      )}

      <Separator />

      <Flex justify="center" wrap gap={12}>
        <Button variant="primary" size="md" onClick={onRestart}>
          <Space size={4}>
            <span>Next test</span>
            <ShortcutKeys shortcut={KEYBOARD_SHORTCUTS.nextTest} />
          </Space>
        </Button>
        <Button
          variant="secondary"
          size="md"
          onClick={onRepeat}
          disabled={isZenMode}
          aria-label={
            isZenMode ? "Repeat (not available in Zen mode)" : "Repeat test"
          }
        >
          <Space size={4}>
            <span>Repeat</span>
            {!isZenMode ? (
              <ShortcutKeys shortcut={KEYBOARD_SHORTCUTS.repeatTest} />
            ) : null}
          </Space>
        </Button>
      </Flex>
    </Flex>
  );
};
