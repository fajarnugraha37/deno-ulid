import type { PRNG, ULID } from "../types/index.d.ts";
import { GLOBAL } from "./const.ts";
import { encodeRandom, encodeTime } from "./encode-decode.ts";
import { detectPrng } from "./util.ts";

export function fixULIDBase32(id: string): string {
  return id.replace(/i/gi, "1")
    .replace(/l/gi, "1")
    .replace(/o/gi, "0")
    .replace(/-/g, "");
}

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
