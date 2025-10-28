/**
 * Base hitbox class.
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
export class EntityHitbox extends Hitbox { }
