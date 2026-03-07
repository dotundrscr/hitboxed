// Copyright (c) 2026 dotundrscr. Licensed under BSD 3-Clause "New" or "Revised" License.
// For full terms, refer to the LICENSE file in the repository, or the SPDX License List.

import { Hitbox } from "lib/hitbox/base";

// HOLY #### MURDER DRONES REFERENCE !!11?1!?!!1!??? -- dot
export const SaveLastNTicks = 60;

export class HitboxTickPositions {
  tick: number;
  positions: Map<string, CFrame>;

  constructor(tick: number, hitboxes: Hitbox[]) {
    this.tick = tick;
    this.positions = new Map<string, CFrame>();

    for (const hitbox of hitboxes) {
      this.positions.set(hitbox.getUuid(), hitbox.getCFrame());
    }
  }
}
