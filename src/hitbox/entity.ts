// Copyright (c) 2025 dotundrscr. Licensed under BSD 3-Clause "New" or "Revised" License.
// For full terms, refer to the LICENSE file in the repository, or the SPDX License List.

import { Hitbox } from "./base";

/**
 * Entity Hitbox.
 * Should be used for Humanoids or parts that are supposed to take damage.
 */
export class EntityHitbox extends Hitbox {
	protected attachmentInstance: Attachment = new Instance("Attachment");
	protected constraint: RigidConstraint = new Instance("RigidConstraint");

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

		this._attach();
	}

	/**
	 * Attach the Hitbox instance to `attachTo`.
	 *
	 * @protected DO NOT USE THIS FUNCTION DIRECTLY. This is a protected function in TypeScript, but still can be called in Luau.
	 */
	protected _attach() {
		const hitboxInstance = this._createInstance();

		if (!this.attachTo) {
			error("hitboxed: attachTo of a Hitbox is nil");
		}

		if (!this.attachTo.IsA("BasePart")) {
			error(
				`hitboxed: attachTo of a Hitbox is not a BasePart (attachTo = ${this.attachTo})`,
			);
		}

		hitboxInstance.Parent = this.attachTo;

		const partAttachment = new Instance("Attachment");
		partAttachment.Name = "hitboxedAttachment";
		partAttachment.Parent = this.attachTo;

		const hitboxAttachment = new Instance("Attachment");
		hitboxAttachment.Name = "hitboxedAttachment";
		hitboxAttachment.Position = this.attachOffset;
		hitboxAttachment.Parent = hitboxInstance;

		const constraint = new Instance("RigidConstraint");
		constraint.Name = "hitboxedConstraint";
		constraint.Attachment0 = partAttachment;
		constraint.Attachment1 = hitboxAttachment;
		constraint.Parent = this.attachTo;

		this.hitboxInstance = hitboxInstance;
		this.attachmentInstance = partAttachment;
		this.constraint = constraint;
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
		hitboxInstance.LocalTransparencyModifier = 1;

		hitboxInstance.CollisionGroup = "hitboxed";

		hitboxInstance.AddTag("hitboxed-entity");

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
