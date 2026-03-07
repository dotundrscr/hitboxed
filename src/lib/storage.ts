// Copyright (c) 2025 dotundrscr. Licensed under BSD 3-Clause "New" or "Revised" License.
// For full terms, refer to the LICENSE file in the repository, or the SPDX License List.

import { RunService } from "@rbxts/services";
import { Hitbox } from "lib/hitbox/base";
import { SaveLastNTicks } from "lib/lag/positions";

export const ActiveHitboxes = new Map<string, Hitbox>();
export const LastNPositions: Map<string, CFrame>[] = [];

export function StoreHitbox(hitbox: Hitbox) {
  ActiveHitboxes.set(hitbox.getUuid(), hitbox);
}

export function DeleteHitbox(uuid: string) {
  ActiveHitboxes.delete(uuid);
}

export function GetHitboxes(): Map<string, Hitbox> {
  return ActiveHitboxes;
}

export function FindHitbox(uuid: string): Hitbox | undefined {
  return ActiveHitboxes.get(uuid);
}

export function SavePositions() {
  if (LastNPositions.size() >= SaveLastNTicks) {
    LastNPositions.shift();
  }

  const positions = new Map<string, CFrame>();

  for (const hitbox of GetHitboxes()) {
    positions.set(hitbox[0], hitbox[1].getCFrame());
  }

  LastNPositions.push(positions);
}

export function GetPositionsNTicksBehind(ticksBehind: number): Map<string, CFrame> | undefined {
  try {
    return LastNPositions[ticksBehind];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    try {
      return LastNPositions[LastNPositions.size() - 1];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      return undefined;
    }
  }
}

export function StartSaving() {
  SaveTask = RunService.Heartbeat.Connect(SavePositions);
}

export function StopSaving() {
  SaveTask.Disconnect();
  LastNPositions.clear();
}

export let SaveTask: RBXScriptConnection;
