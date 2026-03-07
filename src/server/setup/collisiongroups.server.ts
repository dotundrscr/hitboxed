// Copyright (c) 2026 dotundrscr. Licensed under BSD 3-Clause "New" or "Revised" License.
// For full terms, refer to the LICENSE file in the repository, or the SPDX License List.

// This is a setup script for hitboxed. Make sure it's in ServerScriptStorage.
// Do not modify this manually, unless you know what you are doing.

import { PhysicsService } from "@rbxts/services";

print("hitboxed: setting up collision groups...");

const startTime = os.clock();

PhysicsService.RegisterCollisionGroup("hitboxed");

const collisionGroups = PhysicsService.GetRegisteredCollisionGroups();

for (const group of collisionGroups) {
  if (group.name !== "hitboxed") {
    PhysicsService.CollisionGroupSetCollidable("hitboxed", group.name, false);
  }
}

print(`hitboxed: done setting up collision groups (took ${os.clock() - startTime})`);
