import { beforeEach, describe, expect, it } from "vitest";

import { usePlaygroundPresenceStore } from "@/modules/typing/stores/playground-presence-store";

beforeEach(() => {
  usePlaygroundPresenceStore.setState({
    mountCount: 0,
    isPresent: false,
  });
});

describe("usePlaygroundPresenceStore", () => {
  it("marks the playground present while mounted", () => {
    const { register, unregister } = usePlaygroundPresenceStore.getState();

    register();
    expect(usePlaygroundPresenceStore.getState().isPresent).toBe(true);

    unregister();
    expect(usePlaygroundPresenceStore.getState().isPresent).toBe(false);
  });

  it("supports nested register/unregister pairs", () => {
    const { register, unregister } = usePlaygroundPresenceStore.getState();

    register();
    register();
    unregister();

    expect(usePlaygroundPresenceStore.getState().isPresent).toBe(true);

    unregister();
    expect(usePlaygroundPresenceStore.getState().isPresent).toBe(false);
  });
});
