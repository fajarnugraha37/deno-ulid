import { GLOBAL } from "./const.ts";
import { crockford } from "./crockford.ts";

export function ulidToUUID(ulid: string): string {
  const isValid = GLOBAL.ULID_REGEX.test(ulid);
  if (!isValid) {
    throw new Deno.errors.InvalidData("Invalid ULID");
  }

  const uint8Array = crockford.decode(ulid);
  const uuid = Array.from(uint8Array)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return (
    uuid.substring(0, 8) +
    "-" +
    uuid.substring(8, 12) +
    "-" +
    uuid.substring(12, 16) +
    "-" +
    uuid.substring(16, 20) +
    "-" +
    uuid.substring(20)
  );
}

export function uuidToULID(uuid: string): string {
  const isValid = GLOBAL.UUID_REGEX.test(uuid);
  if (!isValid) {
    throw new Deno.errors.InvalidData("Invalid UUID");
  }
  const clean = uuid.replace(/-/g, "")
    .match(/.{1,2}/g);
  if (!clean) {
    throw new Deno.errors.InvalidData("Invalid UUID");
  }
  const uint8Array = new Uint8Array(clean.map((byte) => parseInt(byte, 16)));

  return crockford.encode(uint8Array);
}
