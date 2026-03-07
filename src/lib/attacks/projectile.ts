// Copyright (c) 2026 dotundrscr. Licensed under BSD 3-Clause "New" or "Revised" License.
// For full terms, refer to the LICENSE file in the repository, or the SPDX License List.

import { CollectionService, Workspace } from "@rbxts/services";
import { EntityHitbox } from "lib/hitbox/entity";
import { ProjectileHitbox } from "lib/hitbox/projectile";

export type ProjectileCallback = (hit: string[], by: string) => void;

export class ProjectileAttack {
  source: EntityHitbox;
  projectile: ProjectileHitbox;

  projectileFinished: ProjectileCallback;

  constructor(source: EntityHitbox, projectile: ProjectileHitbox, projectileFinished: ProjectileCallback) {
    this.source = source;
    this.projectile = projectile;
    this.projectileFinished = projectileFinished;
  }
  scan(): string[] {
    const hitHitboxes: string[] = [];

    const projectileInstance = this.projectile.getProjectileInstance();

    if (this.projectile.visibleOnlyInScan) {
      projectileInstance.Transparency = 0.5;
    }

    const overlayParams = new OverlapParams();
    overlayParams.CollisionGroup = "hitboxed";
    overlayParams.FilterType = Enum.RaycastFilterType.Exclude;

    const sourceAssociatedHitboxes = CollectionService.GetTagged(`hitboxedUUID:${this.source.getUuid()}`);

    for (const hitbox of sourceAssociatedHitboxes) {
      overlayParams.AddToFilter(hitbox);
    }

    // exclude the shadow hitboxes because i don't see a reason to compensate lag in projectiles. the valve employee implementing projectiles didn't see one either.
    const shadowHitboxes = CollectionService.GetTagged(`hitboxed-shadow`);

    for (const hitbox of shadowHitboxes) {
      overlayParams.AddToFilter(hitbox);
    }

    const partsInPart = Workspace.GetPartsInPart(projectileInstance, overlayParams);

    for (const part of partsInPart) {
      const hitboxTags = part.GetTags();

      for (const tag of hitboxTags) {
        const tagSplit = tag.split(":");

        if (tagSplit[0] === "hitboxedUUID") {
          hitHitboxes.push(tagSplit[1]);
        }
      }
    }

    task.spawn(() => {
      this.projectileFinished(hitHitboxes, this.projectile.getUuid());

      if (this.projectile.selfDestructAfterScan) {
        task.cancel(this.projectile.getSelfDestructTask());
        task.spawn(() => {
          task.wait(this.projectile.lifetimeAfterScan);
          this.projectile.destroy();
        });
      }
    });

    return hitHitboxes;
  }
}
