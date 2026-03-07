// Copyright (c) 2026 dotundrscr. Licensed under BSD 3-Clause "New" or "Revised" License.
// For full terms, refer to the LICENSE file in the repository, or the SPDX License List.

import { Hitbox } from "./base";

/**
 * Entity Hitbox.
 * Should be used for Humanoids or parts that are supposed to take damage.
 */
export class EntityHitbox extends Hitbox {
  canCollide: boolean;
  size: Vector3;
  shape: Enum.PartType;

  constructor(
    attachTo: BasePart,
    attachOffset: Vector3,
    hitscanOffset: Vector3,
    owner: Model,
    size: Vector3,
    shape: Enum.PartType,
    canCollide: boolean = false,
  ) {
    super(attachTo, attachOffset, hitscanOffset, owner);
    this.canCollide = canCollide;
    this.size = size;
    this.shape = shape;

    this.hitboxInstance = this._createInstance();
    this._attach();
  }

  /**
   * Create a new instance of the hitbox.
   *
   * @protected DO NOT USE THIS FUNCTION DIRECTLY. This is a protected function in TypeScript, but still can be called in Luau.
   */
  protected _createInstance(): Part {
    const hitboxInstance = new Instance("Part");

    hitboxInstance.Name = "hitboxedEntity";

    hitboxInstance.Size = this.size;
    hitboxInstance.Shape = this.shape;

    hitboxInstance.Material = Enum.Material.SmoothPlastic;
    hitboxInstance.Color = new Color3(1, 0.69, 0);
    hitboxInstance.Transparency = 0.5;

    hitboxInstance.CollisionGroup = "hitboxed";

    hitboxInstance.CanCollide = this.canCollide;

    hitboxInstance.AddTag("hitboxed-entity");
    hitboxInstance.AddTag(`hitboxedUUID:${this.getUuid()}`);

    return hitboxInstance;
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
