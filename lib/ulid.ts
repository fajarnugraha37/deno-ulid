import type { PRNG, ULID } from "../types/index.d.ts";
import { GLOBAL } from "./const.ts";
import { encodeRandom, encodeTime } from "./encode-decode.ts";
import { detectPrng } from "./util.ts";

/**
 * Fixes a base32 ULID string by replacing invalid characters with their correct counterparts.
 *
 * This function replaces the following characters:
 * - 'i' -> '1'
 * - 'l' -> '1'
 * - 'o' -> '0'
 * - '-' (hyphen) -> '' (empty string)
 *
 * @param {string} id The ULID string to fix.
 * @returns {string} The fixed ULID string.
 * @throws {TypeError} If the provided id is not a string.
 */
export function fixULIDBase32(id: string): string {
  return id.replace(/i/gi, "1")
    .replace(/l/gi, "1")
    .replace(/o/gi, "0")
    .replace(/-/g, "");
}

/**
 * Validates a ULID string based on its format and character set.
 *
 * This function checks if the provided string:
 * - is a string type
 * - has the correct length (TIME_LEN + RANDOM_LEN)
 * - contains only characters from the defined encoding (all characters are uppercase)
 *
 * @param {string} id The ULID string to validate.
 * @returns {boolean} True if the string is a valid ULID, false otherwise.
 */
export function isValid(id: string): boolean {
  return (
    typeof id === "string" &&
    id.length === GLOBAL.TIME_LEN + GLOBAL.RANDOM_LEN &&
    id
      .toUpperCase()
      .split("")
      .every((char) => GLOBAL.ENCODING.indexOf(char) !== -1)
  );
}

/**
 * Creates a ULID generation factory function.
 *
 * This factory function takes an optional PRNG (Pseudorandom Number Generator) and returns a function for generating ULIDs.
 *
 * The default PRNG is chosen by the `detectPrng` function.
 *
 * @param {PRNG} [prng=detectPrng()] - The PRNG to use for generating random parts of the ULID.
 * @returns {ULID} A function that generates ULIDs.
 */
export function factory(prng: PRNG = detectPrng()): ULID {
  return function ulid(seedTime: number = Date.now()): string {
    return encodeTime(seedTime, GLOBAL.TIME_LEN) +
      encodeRandom(GLOBAL.RANDOM_LEN, prng);
  };
}

/**
 * Generate a ULID, optionally based on a given timestamp. If the timestamp is
 * not passed, it will default to `Date.now()`.
 *
 * Multiple calls to this function with the same seed time will not guarantee
 * that the ULIDs will be strictly increasing, even if the seed time is the
 * same. For that, use the {@linkcode monotonicUlid} function.
 *
 * @example Generate a ULID
 * ```ts no-assert
 * import { ulid } from "@std/ulid";
 *
 * ulid(); // 01HYFKMDF3HVJ4J3JZW8KXPVTY
 * ```
 *
 * @example Generate a ULID with a seed time
 * ```ts no-assert
 * import { ulid } from "@std/ulid";
 *
 * ulid(150000); // 0000004JFG3EKDRE04TVVDJW7K
 * ```
 *
 * @param seedTime The time to base the ULID on, in milliseconds since the Unix epoch. Defaults to `Date.now()`.
 * @returns A ULID.
 */
export const ulid: ULID = factory();
