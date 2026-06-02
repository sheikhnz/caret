/**
 * Post-test results screen.
 */

"use client";

import { Badge } from "@/ui/Badge";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { Separator } from "@/ui/Separator";

import { roundTo2 } from "../../calculations/numbers";
import { useConfigStore } from "../../stores/config-store";
import { useTestStore } from "../../stores/test-store";
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
    <div className="flex w-full max-w-[870px] flex-col gap-4">
      <Card elevated className="p-5 md:p-6">
        <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-start md:[grid-template-areas:'stats_chart''morestats_morestats']">
          <div className="grid gap-4 md:pr-8 md:[grid-area:stats] md:[grid-template-areas:'wpm''acc']">
            <StatCard
              label="WPM"
              value={result.wpm}
              sub={result.rawWpm !== undefined ? `${result.rawWpm}` : undefined}
              subLabel="Raw"
              size="hero"
              className="md:[grid-area:wpm]"
            />
            <StatCard
              label="Acc"
              value={`${result.acc}%`}
              size="hero"
              className="md:[grid-area:acc]"
            />
          </div>

          <div className="min-w-0 md:[grid-area:chart]">
            {result.chartData !== "toolong" ? (
              <WpmChart data={result.chartData} />
            ) : (
              <div className="flex h-[200px] items-center justify-center text-sm text-text-muted">
                Test too long to display chart
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-4 md:[grid-area:morestats] md:justify-between">
            <StatCard label="Raw" value={result.rawWpm} />
            <StatCard label="Consistency" value={`${result.consistency}%`} />
            <StatCard label="Time" value={timeLabel} sub={afkLabel} />
            <StatCard
              label="Chars"
              value={`${correct}/${incorrect}/${extra}/${missed}`}
            />
            <StatCard label="Test Type" value={modeLabel} size="compact" />
          </div>
        </div>
      </Card>

      {(testInvalid || result.bailedOut) && (
        <div className="flex flex-wrap gap-2">
          {testInvalid && <Badge tone="error">Invalid — too short</Badge>}
          {result.bailedOut && <Badge tone="neutral">Bailed out</Badge>}
        </div>
      )}

      {configTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {configTags.map((tag) => (
            <Badge key={tag} tone="neutral">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <Separator />

      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="primary" size="md" onClick={onRestart}>
          Next test
        </Button>
        <Button variant="secondary" size="md" onClick={onRepeat}>
          Repeat
        </Button>
      </div>
    </div>
  );
};
