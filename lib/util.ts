import type { PRNG } from "../types/index.d.ts";
import { GLOBAL } from "./const.ts";

export function replaceCharAt(
  str: string,
  index: number,
  char: string,
): string {
  return str.substring(0, index) + char + str.substring(index + 1);
}

export function incrementBase32(str: string): string {
  let index = str.length;
  let char;
  let charIndex;
  const maxCharIndex = GLOBAL.ENCODING_LEN - 1;
  while (index-- >= 0) {
    char = str[index];
    charIndex = GLOBAL.ENCODING.indexOf(char);
    if (charIndex === -1) {
      throw new Deno.errors.InvalidData("incorrectly encoded string");
    }
    if (charIndex === maxCharIndex) {
      str = replaceCharAt(str, index, GLOBAL.ENCODING[0]);
      continue;
    }

    return replaceCharAt(str, index, GLOBAL.ENCODING[charIndex + 1]);
  }

  throw new Deno.errors.InvalidData("cannot increment this string");
}

export function randomChar(prng: PRNG): string {
  let rand = Math.floor(prng() * GLOBAL.ENCODING_LEN);
  if (rand === GLOBAL.ENCODING_LEN) {
    rand = GLOBAL.ENCODING_LEN - 1;
  }

  return GLOBAL.ENCODING.charAt(rand);
}
