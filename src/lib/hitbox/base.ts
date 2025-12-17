// Copyright (c) 2025 dotundrscr. Licensed under BSD 3-Clause "New" or "Revised" License.
// For full terms, refer to the LICENSE file in the repository, or the SPDX License List.

import { HttpService } from "@rbxts/services";

/**
 * Base hitbox class.
 *
 * @property attachTo BasePart to attach the hitbox to.
 * @property attachOffset Hitbox's offset relative to the origin of `attachTo`
 */
export abstract class Hitbox {
  protected attachmentInstance: Attachment = new Instance("Attachment");
  protected constraint: RigidConstraint = new Instance("RigidConstraint");
  protected hitboxInstance: Part = new Instance("Part");
  protected uuid: string = HttpService.GenerateGUID(false);

  attachTo: BasePart;
  attachOffset: Vector3;
  hitscanOffset: Vector3;
  owner: Model;

  constructor(attachTo: BasePart, attachOffset: Vector3, hitscanOffset: Vector3, owner: Model) {
    this.attachTo = attachTo;
    this.attachOffset = attachOffset;
    this.hitscanOffset = hitscanOffset;
    this.owner = owner;
  }

  getCFrame(): CFrame {
    return this.hitboxInstance.CFrame;
  }

  getUuid(): string {
    return this.uuid;
  }

  /**
   * Attach the Hitbox instance to `attachTo`.
   *
   * @protected DO NOT USE THIS FUNCTION DIRECTLY. This is a protected function in TypeScript, but still can be called in Luau.
   */
  protected _attach() {
    if (!this.attachTo) {
      error("hitboxed: attachTo of a Hitbox is nil");
    }

    if (!this.attachTo.IsA("BasePart")) {
      error(`hitboxed: attachTo of a Hitbox is not a BasePart (attachTo = ${this.attachTo})`);
    }

    this.hitboxInstance.Parent = this.attachTo;

    const partAttachment = new Instance("Attachment");
    partAttachment.Name = "hitboxedAttachment";
    partAttachment.Parent = this.attachTo;

    const hitboxAttachment = new Instance("Attachment");
    hitboxAttachment.Name = "hitboxedAttachment";
    hitboxAttachment.Position = this.attachOffset;
    hitboxAttachment.Parent = this.hitboxInstance;

    const constraint = new Instance("RigidConstraint");
    constraint.Name = "hitboxedConstraint";
    constraint.Attachment0 = partAttachment;
    constraint.Attachment1 = hitboxAttachment;
    constraint.Parent = this.attachTo;

    this.attachmentInstance = partAttachment;
    this.constraint = constraint;
  }
}
