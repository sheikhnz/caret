export type AutoSleepConfig = {
  enabled: boolean;
  idleSeconds: number;
};

export type AutoSleepCallbacks = {
  onSleep: () => void;
  onWake: () => void;
};
