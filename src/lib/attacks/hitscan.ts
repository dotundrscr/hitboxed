// Copyright (c) 2025 dotundrscr. Licensed under BSD 3-Clause "New" or "Revised" License.
// For full terms, refer to the LICENSE file in the repository, or the SPDX License List.

import { CollectionService, Players, Workspace } from "@rbxts/services";
import { EntityHitbox } from "lib/hitbox/entity";
import { ShadowHitbox } from "lib/hitbox/shadow";
import { FindHitbox, GetPositionsNTicksBehind } from "lib/storage";

export type HitscanCallback = (hit: string[], by: string) => void;

export class HitscanAttack {
  source: EntityHitbox;
  direction: Vector3;
  size: Vector3 | undefined;
  length: number;

  hitscanFinished: HitscanCallback;

  compensateLag: boolean;

  constructor(
    source: EntityHitbox,
    direction: Vector3,
    size: Vector3 | undefined,
    length: number,

    hitscanFinished: HitscanCallback,

    compensateLag: boolean = true,
  ) {
    this.source = source;
    this.direction = direction;
    this.size = size;
    this.length = length;

    this.hitscanFinished = hitscanFinished;

    this.compensateLag = compensateLag;
  }
  scan(): string[] {
    let offsetTicks = 0;
    let tickProgress = 0;

    if (this.compensateLag) {
      const hitboxOwner = Players.GetPlayerFromCharacter(this.source.owner);

      if (hitboxOwner) {
        const networkPing = hitboxOwner.GetNetworkPing();

        if (networkPing > 0.015) {
          offsetTicks = math.floor(networkPing / (1 / 60));

          const remainder = networkPing % (1 / 60);
          tickProgress = remainder / (1 / 60);
        }
      }
    }

    const offsetPositions = GetPositionsNTicksBehind(math.clamp(59 - offsetTicks, 0, 59));
    const offsetPlusOnePositions = GetPositionsNTicksBehind(math.clamp(59 - offsetTicks + 1, 0, 59));

    if (offsetPositions && offsetPlusOnePositions) {
      for (const hitbox of offsetPositions) {
        const plusOnePosition = offsetPlusOnePositions.get(hitbox[0]);

        if (!plusOnePosition) {
          warn(`hitboxed: ${hitbox[0]} has invalid offset position`);
          continue;
        }

        const resultPosition = hitbox[1].Lerp(plusOnePosition, tickProgress);

        const hitboxInstance = FindHitbox(hitbox[0]);

        if (!hitboxInstance) {
          warn(`hitboxed: ${hitbox[0]} is invalid`);
          continue;
        }

        new ShadowHitbox(resultPosition, hitboxInstance as EntityHitbox);
      }
    } else {
      if (!offsetPlusOnePositions) {
        warn(
          "hitboxed: tried running a hitscan with lag compensation but no ticks were recorded. (wait for at least 2 ticks to be recorded before running scans)",
        );
      } else {
        warn(
          "hitboxed: tried running a hitscan with lag compensation but not enough ticks were recorded. (wait for at least 2 ticks to be recorded before running scans)",
        );
      }
    }

    const finalDirection = this.direction.Unit.mul(this.length);

    const hitscanParams = new RaycastParams();
    hitscanParams.CollisionGroup = "hitboxed";
    hitscanParams.FilterType = Enum.RaycastFilterType.Exclude;

    const sourceAssociatedHitboxes = CollectionService.GetTagged(`hitboxedUUID:${this.source.getUuid()}`);

    for (const hitbox of sourceAssociatedHitboxes) {
      hitscanParams.AddToFilter(hitbox);
    }

    let hitscan;

    let hitHitboxes = []; // eslint-disable-line prefer-const

    if (!this.size) {
      hitscan = Workspace.Raycast(this.source.getCFrame().Position, finalDirection, hitscanParams);

      while (hitscan) {
        if (!hitscan) break;

        const hitboxTags = hitscan.Instance.GetTags();

        for (const tag of hitboxTags) {
          const tagSplit = tag.split(":");

          if (tagSplit[0] === "hitboxedUUID") {
            hitHitboxes.push(tagSplit[1]);

            const associatedHitboxes = CollectionService.GetTagged(`hitboxedUUID:${tagSplit[1]}`);

            for (const hitbox of associatedHitboxes) {
              hitscanParams.AddToFilter(hitbox);
            }
          }
        }

        hitscan = Workspace.Raycast(this.source.getCFrame().Position, finalDirection, hitscanParams);
      }
    } else {
      hitscan = Workspace.Blockcast(this.source.getCFrame(), this.size, finalDirection, hitscanParams);

      while (hitscan) {
        if (!hitscan) break;

        const hitboxTags = hitscan.Instance.GetTags();

        for (const tag of hitboxTags) {
          const tagSplit = tag.split(":");

          if (tagSplit[0] === "hitboxedUUID") {
            hitHitboxes.push(tagSplit[1]);

            const associatedHitboxes = CollectionService.GetTagged(`hitboxedUUID:${tagSplit[1]}`);

            for (const hitbox of associatedHitboxes) {
              hitscanParams.AddToFilter(hitbox);
            }
          }
        }

        hitscan = Workspace.Blockcast(this.source.getCFrame(), this.size, finalDirection, hitscanParams);
      }
    }

    task.spawn(() => {
      this.hitscanFinished(hitHitboxes, this.source.getUuid());
    });

    return hitHitboxes;
  }
}
