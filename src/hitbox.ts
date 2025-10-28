// Copyright (c) 2025 dotundrscr. Licensed under BSD 3-Clause "New" or "Revised" License.
// For full terms, refer to the LICENSE file in the repository, or the SPDX License List.

/**
 * Base hitbox class.
 *
 * @property attachTo BasePart to attach the hitbox to.
 * @property attachOffset Hitbox's offset relative to the origin of `attachTo`
 */
export abstract class Hitbox {
  attachTo: BasePart;
  attachOffset: Vector3;

  constructor(attachTo: BasePart, attachOffset: Vector3) {
    this.attachTo = attachTo;
    this.attachOffset = attachOffset;
  }
}

/**
 * Entity Hitbox.
 * Should be used for Humanoids or parts that are supposed to take damage.
 */
export class EntityHitbox extends Hitbox {
  protected hitboxInstance: Part = new Instance("Part");
  protected position: Vector3 = new Vector3(0, 0, 0);

  size: Vector3;
  shape: Enum.PartType;

  constructor(
    attachTo: BasePart,
    attachOffset: Vector3,
    size: Vector3,
    shape: Enum.PartType,
  ) {
    super(attachTo, attachOffset);
    this.size = size;
    this.shape = shape;
  }
}
