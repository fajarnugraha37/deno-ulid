import { GLOBAL } from "./const.ts";
import { crockford } from "./crockford.ts";

/**
 * Converts a ULID string to a UUID string.
 *
 * This function validates the ULID string using a pre-defined regular expression (`GLOBAL.ULID_REGEX`).
 * If invalid, it throws an `InvalidData` error. Otherwise, it decodes the ULID string using the `crockford.decode`
 * function (assumed to be an external library) and converts the resulting Uint8Array to a UUID string
 * in the standard format (e.g., "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx").
 *
 * @param {string} ulid - The ULID string to convert.
 * @returns {string} The corresponding UUID string.
 * @throws {Deno.errors.InvalidData} If the provided ULID is invalid.
 */
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

/**
 * Converts a UUID string to a ULID string.
 *
 * This function validates the UUID string using a pre-defined regular expression (`GLOBAL.UUID_REGEX`).
 * If invalid, it throws an `InvalidData` error. Otherwise, it removes hyphens from the UUID string and splits
 * it into an array of byte pairs. It then converts each byte pair back to a number using hexadecimal parsing
 * and creates a new Uint8Array. Finally, it uses the `crockford.encode` function (assumed to be an external library)
 * to encode the Uint8Array into a ULID string.
 *
 * @param {string} uuid - The UUID string to convert.
 * @returns {string} The corresponding ULID string.
 * @throws {Deno.errors.InvalidData} If the provided UUID is invalid.
 */
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
