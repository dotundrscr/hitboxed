// Copyright (c) 2025 dotundrscr. Licensed under BSD 3-Clause "New" or "Revised" License.
// For full terms, refer to the LICENSE file in the repository, or the SPDX License List.

import { Workspace } from "@rbxts/services";
import { EntityHitbox } from "../hitbox/entity";

export type HitCallback = (hit: string[], by: string) => void;

export class HitscanAttack {
  source: EntityHitbox;
  direction: Vector3;
  size: Vector3 | undefined;
  length: number;

  onHit: HitCallback;

  compensateLag: boolean;

  constructor(
    source: EntityHitbox,
    direction: Vector3,
    size: Vector3 | undefined,
    length: number,

    onHit: HitCallback,

    compensateLag: boolean = true,
  ) {
    this.source = source;
    this.direction = direction;
    this.size = size;
    this.length = length;

    this.onHit = onHit;

    this.compensateLag = compensateLag;
  }
  scan(): string[] {
    const finalDirection = this.direction.Unit.mul(this.length);

    const hitscanParams = new RaycastParams();
    hitscanParams.CollisionGroup = "hitboxed";
    hitscanParams.FilterType = Enum.RaycastFilterType.Exclude;

    let hitscan;

    let hitHitboxes = []; // eslint-disable-line prefer-const

    if (!this.size) {
      hitscan = Workspace.Raycast(this.source.getCFrame().Position, finalDirection, hitscanParams);
    } else {
      hitscan = Workspace.Blockcast(this.source.getCFrame(), this.size, finalDirection, hitscanParams);
    }

    if (!hitscan) return [];

    const hitboxTags = hitscan.Instance.GetTags();

    for (const tag of hitboxTags) {
      const tagSplit = tag.split(":");

      if (tagSplit[0] === "hitboxedUUID") {
        hitHitboxes.push(tagSplit[1]);
      }
    }

    task.spawn(() => {
      this.onHit(hitHitboxes, this.source.getUuid());
    });

    return hitHitboxes;
  }
}
