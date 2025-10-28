// Copyright (c) 2025 dotundrscr. Licensed under BSD 3-Clause "New" or "Revised" License.
// For full terms, refer to the LICENSE file in the repository, or the SPDX License List.

/**
 * Base hitbox class.
 *
 * @param attachTo BasePart to attach the hitbox to.
 * @param attachOffset Hitbox's offset relative to the origin of `attachTo`
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
  constructor(attachTo: BasePart, attachOffset: Vector3) {
    super(attachTo, attachOffset);
  }
}
