export const getSoundOptions = (nativeEvent: KeyboardEvent) => ({
  codeOverride: nativeEvent.code,
  shifted:
    nativeEvent.getModifierState("Shift") ||
    nativeEvent.getModifierState("CapsLock"),
});
