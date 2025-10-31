import { Hitbox } from "lib/hitbox/base";

let ActiveHitboxes = new Map<string, Hitbox>();

export function StoreHitbox(hitbox: Hitbox) {
  ActiveHitboxes.set(hitbox.getUuid(), hitbox);
}

export function GetHitboxes(): Map<string, Hitbox> {
  return ActiveHitboxes;
}
