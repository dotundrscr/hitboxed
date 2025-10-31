// Copyright (c) 2025 dotundrscr. Licensed under BSD 3-Clause "New" or "Revised" License.
// For full terms, refer to the LICENSE file in the repository, or the SPDX License List.

import { Hitbox } from "lib/hitbox/base";

let ActiveHitboxes = new Map<string, Hitbox>();

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
