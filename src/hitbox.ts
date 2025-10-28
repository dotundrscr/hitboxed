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
