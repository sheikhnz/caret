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

  const modeLabel =
    config.mode === "time"
      ? `${config.time}s`
      : config.mode === "words"
        ? `${config.words} words`
        : config.mode;

  const timeLabel = `${roundTo2(result.testDuration)}s`;
  const afkLabel =
    result.afkDuration > 0 ? `-${result.afkDuration}s afk` : undefined;

  const configTags = [
    config.language,
    modeLabel,
    config.punctuation ? "punctuation" : null,
    config.numbers ? "numbers" : null,
    config.difficulty !== "normal" ? config.difficulty : null,
  ].filter(Boolean) as string[];

  return (
    <div className="flex w-full max-w-[870px] flex-col gap-4">
      <Card elevated className="p-5 md:p-6">
        <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-center md:[grid-template-areas:'stats_chart''morestats_morestats']">
          <div className="grid gap-4 md:pr-8 md:[grid-area:stats] md:[grid-template-areas:'wpm''acc']">
            <StatCard
              label="wpm"
              value={result.wpm}
              sub={result.rawWpm !== undefined ? `${result.rawWpm}` : undefined}
              subLabel="raw"
              large
              className="wpm"
            />
            <StatCard
              label="acc"
              value={`${result.acc}%`}
              large
              className="acc"
            />
          </div>

          <div className="md:[grid-area:chart]">
            {result.chartData !== "toolong" ? (
              <WpmChart data={result.chartData} />
            ) : (
              <div className="flex h-[200px] items-center justify-center text-sm text-text-muted">
                test too long to display chart
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:auto-cols-fr md:grid-flow-col md:gap-8 md:[grid-area:morestats]">
            <StatCard label="raw" value={result.rawWpm} />
            <StatCard label="consistency" value={`${result.consistency}%`} />
            <StatCard label="time" value={timeLabel} sub={afkLabel} />
            <StatCard
              label="chars"
              value={`${correct}/${incorrect}/${extra}/${missed}`}
            />
            <StatCard label="test type" value={modeLabel} />
          </div>
        </div>
      </Card>

      {(testInvalid || result.bailedOut) && (
        <div className="flex flex-wrap gap-2">
          {testInvalid && <Badge tone="error">invalid — too short</Badge>}
          {result.bailedOut && <Badge tone="neutral">bailed out</Badge>}
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
          next test
        </Button>
        <Button variant="secondary" size="md" onClick={onRepeat}>
          repeat
        </Button>
      </div>
    </div>
  );
};
