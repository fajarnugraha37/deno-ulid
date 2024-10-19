/**
 * Utilities for generating and working with Universally Unique Lexicographically Sortable Identifiers (ULIDs).
 *
 * To generate a ULID use the {@linkcode ulid} function. This will generate a
 * ULID based on the current time.
 *
 * ```ts no-assert
 * import { ulid } from "@fajar/deno-ulid";
 *
 * ulid();
 * ```
 *
 * {@linkcode ulid} does not guarantee that the ULIDs will be strictly
 * increasing for the same current time. If you need to guarantee that the ULIDs
 * will be strictly increasing, even for the same current time, use the
 * {@linkcode monotonicUlid} function.
 *
 * ```ts no-assert
 * import { monotonicUlid } from "@fajar/deno-ulid";
 *
 * monotonicUlid(); // 01HYFKHG5F8RHM2PM3D7NSTDAS
 * monotonicUlid(); // 01HYFKHG5F8RHM2PM3D7NSTDAT
 * ```
 *
 * Because each ULID encodes the time it was generated, you can extract the
 * timestamp from a ULID using the {@linkcode decodeTime} function.
 *
 * ```ts
 * import { decodeTime, ulid } from "@fajar/deno-ulid";
 * import { assertEquals } from "@std/assert";
 *
 * const timestamp = 150_000;
 * const ulidString = ulid(timestamp);
 *
 * assertEquals(decodeTime(ulidString), timestamp);
 * ```
 *
 * @module
 */
export * from "./lib/index.ts";
export type * from "./types/index.d.ts";
