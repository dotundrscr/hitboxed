// Copyright (c) 2026 dotundrscr. Licensed under BSD 3-Clause "New" or "Revised" License.
// For full terms, refer to the LICENSE file in the repository, or the SPDX License List.

import { Hitbox } from "./base";

/**
 * Projectile Hitbox.
 * Used by the projectile attack type.
 * Destroyed automatically in 10 second *without a scan* by default.
 * Destroyed automatically in 1 second *after a scan* by default.
 */
export class ProjectileHitbox extends Hitbox {
  protected selfDestructTask: thread;

  size: Vector3;
  shape: Enum.PartType;

  visibleOnlyInScan: boolean;
  selfDestructAfterScan: boolean;
  lifetimeAfterScan: number;

  constructor(
    attachTo: BasePart,
    attachOffset: Vector3,
    hitscanOffset: Vector3,
    owner: Model,
    size: Vector3,
    shape: Enum.PartType,
    lifetime: number = 10,
    visibleOnlyInScan: boolean = true,
    selfDestructAfterScan: boolean = true,
    lifetimeAfterScan: number = 1,
  ) {
    super(attachTo, attachOffset, hitscanOffset, owner);

    this.size = size;
    this.shape = shape;

    this.visibleOnlyInScan = visibleOnlyInScan;
    this.selfDestructAfterScan = selfDestructAfterScan;
    this.lifetimeAfterScan = lifetimeAfterScan;

    this.hitboxInstance = this._createInstance();

    this.hitboxInstance.Parent = this.attachTo;
    this.hitboxInstance.CFrame = this.attachTo.CFrame;

    this.selfDestructTask = task.spawn(() => {
      task.wait(lifetime);

      this.destroy();
    });
  }

  /**
   * Create a new instance of the hitbox.
   *
   * @protected DO NOT USE THIS FUNCTION DIRECTLY. This is a protected function in TypeScript, but still can be called in Luau.
   */
  protected _createInstance(): Part {
    const hitboxInstance = new Instance("Part");

    hitboxInstance.Name = "hitboxedProjectile";

    hitboxInstance.Anchored = true;

    hitboxInstance.Size = this.size;
    hitboxInstance.Shape = this.shape;

    hitboxInstance.Material = Enum.Material.SmoothPlastic;
    hitboxInstance.Color = new Color3(0.55, 0.65, 1);
    hitboxInstance.Transparency = this.visibleOnlyInScan ? 1 : 0.5;
    hitboxInstance.LocalTransparencyModifier = 0;

    hitboxInstance.CollisionGroup = "hitboxed";

    hitboxInstance.CanCollide = false;

    hitboxInstance.AddTag("hitboxed-projectile");
    hitboxInstance.AddTag(`hitboxedUUID:${this.getUuid()}`);

    return hitboxInstance;
  }

  getProjectileInstance(): Part {
    return this.hitboxInstance;
  }

  getSelfDestructTask(): thread {
    return this.selfDestructTask;
  }

  /**
   * Destroy the hitbox and it's attachment
   */
  destroy() {
    this.hitboxInstance.Destroy();
    this.attachmentInstance.Destroy();
    this.constraint.Destroy();
  }
}
