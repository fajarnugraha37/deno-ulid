/**
 * A pseudorandom number generator (PRNG) function.
 *
 * A PRNG is a function that returns a random number between 0 and 1.
 *
 * @returns {number} A random number between 0 and 1.
 */
export interface PRNG {
  (): number;
}

/**
 * A function that generates a Universally Unique Lexicographically Sortable Identifier (ULID).
 *
 * A ULID is a 128-bit unique identifier with a time-based component, designed to be sortable.
 *
 * @param {number} [seedTime] - An optional timestamp to use as the basis for the ULID.
 *   If not provided, the current timestamp will be used.
 * @returns {string} A generated ULID.
 */
export interface ULID {
  (seedTime?: number): string;
}
