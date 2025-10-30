// Copyright (c) 2025 dotundrscr. Licensed under BSD 3-Clause "New" or "Revised" License.
// For full terms, refer to the LICENSE file in the repository, or the SPDX License List.

import { PhysicsService } from "@rbxts/services";

function setupCollisionGroups() {
	print("hitboxed: setting up collision groups...");

	const startTime = os.clock();

	PhysicsService.RegisterCollisionGroup("hitboxed");

	const collisionGroups = PhysicsService.GetRegisteredCollisionGroups();

	for (const group of collisionGroups) {
		if (group.name !== "hitboxed") {
			PhysicsService.CollisionGroupSetCollidable("hitboxed", group.name, false);
		}
	}

	print(
		`hitboxed: done setting up collisiong roups (${os.clock() - startTime})`,
	);
}
