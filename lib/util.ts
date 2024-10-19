import type { PRNG } from "../types/index.d.ts";
import { GLOBAL } from "./const.ts";

/**
 * Function to replace characters in certain positions
 *
 * @param str The string you want to replace
 * @param index The start index of the character is replaced
 * @param char new character to be embedded
 * @returns String that has been replaced with new value
 */
export function replaceCharAt(
  str: string,
  index: number,
  char: string,
): string {
  return str.substring(0, index) + char + str.substring(index + 1);
}

/**
 * Increments a base32 encoded string.
 *
 * This function iterates through the string from the end, incrementing characters based on the defined encoding.
 *
 * @param {string} str The base32 encoded string to increment.
 * @returns {string} The incremented string.
 * @throws {Deno.errors.InvalidData} If the string is not correctly encoded or cannot be incremented.
 */
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

/**
 * Generates a random character from the defined encoding.
 *
 * This function uses the provided PRNG (Pseudorandom Number Generator) to generate a random integer
 * within the range of the encoding length. It then uses that index to retrieve the character from the encoding string.
 *
 * @param {PRNG} prng - The PRNG to use for generating the random number.
 * @returns {string} A random character from the encoding.
 */
export function randomChar(prng: PRNG): string {
  let rand = Math.floor(prng() * GLOBAL.ENCODING_LEN);
  if (rand === GLOBAL.ENCODING_LEN) {
    rand = GLOBAL.ENCODING_LEN - 1;
  }

  return GLOBAL.ENCODING.charAt(rand);
}

/**
 * Detects a cryptographically secure random number generator (PRNG).
 *
 * This function utilizes the `crypto.getRandomValues` function to generate a random byte array.
 * It then returns a function that generates a random number between 0 and 1 by dividing
 * the first byte of the array by 255 (0xff).
 *
 * @returns {PRNG} A function that generates a random number between 0 and 1.
 */
export function detectPrng(): PRNG {
  return () => {
    const buffer = new Uint8Array(1);
    crypto.getRandomValues(buffer);
    return buffer[0] / 0xff;
  };
}
