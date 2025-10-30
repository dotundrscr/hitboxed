// Copyright (c) 2025 dotundrscr. Licensed under BSD 3-Clause "New" or "Revised" License.
// For full terms, refer to the LICENSE file in the repository, or the SPDX License List.

/**
 * Base hitbox class.
 *
 * @property attachTo BasePart to attach the hitbox to.
 * @property attachOffset Hitbox's offset relative to the origin of `attachTo`
 */
export abstract class Hitbox {
	protected hitboxInstance: Part = new Instance("Part");

	attachTo: BasePart;
	attachOffset: Vector3;

	constructor(attachTo: BasePart, attachOffset: Vector3) {
		this.attachTo = attachTo;
		this.attachOffset = attachOffset;
	}

	getPosition(): Vector3 {
		return this.hitboxInstance.Position;
	}
}
