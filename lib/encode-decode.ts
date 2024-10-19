import type { PRNG } from "../types/index.d.ts";
import { GLOBAL } from "./const.ts";
import { randomChar } from "./util.ts";

export function encodeTime(now: number, len: number = GLOBAL.TIME_LEN): string {
  if (now > GLOBAL.TIME_MAX) {
    throw new Deno.errors.InvalidData(
      "cannot encode time greater than " + GLOBAL.TIME_MAX,
    );
  }
  if (now < 0) {
    throw new Deno.errors.InvalidData("time must be positive");
  }
  if (Number.isInteger(now) === false) {
    throw new Deno.errors.InvalidData("time must be an integer");
  }
  let str = "";
  for (; len > 0; len--) {
    const mod = now % GLOBAL.ENCODING_LEN;
    str = GLOBAL.ENCODING[mod] + str;
    now = (now - mod) / GLOBAL.ENCODING_LEN;
  }

  return str;
}

/**
 * Extracts the number of milliseconds since the Unix epoch that had passed when
 * the ULID was generated. If the ULID is malformed, an error will be thrown.
 *
 * @example Decode the time from a ULID
 * ```ts
 * import { decodeTime, ulid } from "@std/ulid";
 * import { assertEquals } from "@std/assert";
 *
 * const timestamp = 150_000;
 * const ulidString = ulid(timestamp);
 *
 * assertEquals(decodeTime(ulidString), timestamp);
 * ```
 *
 * @param ulid The ULID to extract the timestamp from.
 * @returns The number of milliseconds since the Unix epoch that had passed when the ULID was generated.
 */
export function decodeTime(id: string): number {
  if (id.length !== GLOBAL.TIME_LEN + GLOBAL.RANDOM_LEN) {
    throw new Deno.errors.InvalidData("malformed ulid");
  }
  const time = id
    .substring(0, GLOBAL.TIME_LEN)
    .split("")
    .reverse()
    .reduce((carry, char, index) => {
      const encodingIndex = GLOBAL.ENCODING.indexOf(char);
      if (encodingIndex === -1) {
        throw new Deno.errors.InvalidData("invalid character found: " + char);
      }
      return (carry += encodingIndex * Math.pow(GLOBAL.ENCODING_LEN, index));
    }, 0);
  if (time > GLOBAL.TIME_MAX) {
    throw new Deno.errors.InvalidData("malformed ulid, timestamp too large");
  }

  return time;
}

export function encodeRandom(len: number, prng: PRNG): string {
  let str = "";
  for (; len > 0; len--) {
    str = randomChar(prng) + str;
  }
  return str;
}
