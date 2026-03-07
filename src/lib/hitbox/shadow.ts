// Copyright (c) 2025 dotundrscr. Licensed under BSD 3-Clause "New" or "Revised" License.
// For full terms, refer to the LICENSE file in the repository, or the SPDX License List.

import { Workspace } from "@rbxts/services";
import { Hitbox } from "./base";
import { EntityHitbox } from "./entity";

/**
 * Shadow of an Entity Hitbox.
 * Spawned on hitscans with lag compensation enabled.
 * Inherit original hitbox's UUID. Not tracked.
 */
export class ShadowHitbox extends Hitbox {
  protected shadowPart: BasePart;

  originalHitbox: EntityHitbox;

  constructor(cFrame: CFrame, originalHitbox: EntityHitbox) {
    const shadowPart = new Instance("Part");

    shadowPart.Name = "hitboxedShadowPart";

    shadowPart.CFrame = cFrame;
    shadowPart.Size = Vector3.zero;

    shadowPart.Transparency = 1;

    shadowPart.Anchored = true;

    shadowPart.CanCollide = false;
    shadowPart.CanTouch = false;
    shadowPart.CanQuery = false;

    shadowPart.Parent = Workspace;

    super(shadowPart, Vector3.zero, Vector3.zero, originalHitbox.owner);

    this.shadowPart = shadowPart;

    this.originalHitbox = originalHitbox;

    this.hitboxInstance = this._createInstance();
    this._attach();

    task.spawn(() => {
      task.wait(1);
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

    hitboxInstance.Name = "hitboxedShadow";

    hitboxInstance.Size = this.originalHitbox.size;
    hitboxInstance.Shape = this.originalHitbox.shape;

    hitboxInstance.Material = Enum.Material.SmoothPlastic;
    hitboxInstance.Color = new Color3(0.55, 0, 1);
    hitboxInstance.Transparency = 0.5;

    hitboxInstance.CollisionGroup = "hitboxed";

    hitboxInstance.CanCollide = false;

    hitboxInstance.AddTag("hitboxed-shadow");
    hitboxInstance.AddTag(`hitboxedUUID:${this.originalHitbox.getUuid()}`);

    return hitboxInstance;
  }

  /**
   * Destroy the hitbox and it's attachment
   */
  destroy() {
    this.hitboxInstance.Destroy();
    this.attachmentInstance.Destroy();
    this.constraint.Destroy();

    this.shadowPart.Destroy();
  }
}
