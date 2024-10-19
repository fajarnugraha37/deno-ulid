import { decodeTime, encodeRandom, encodeTime } from "../lib/encode-decode.ts";
import { detectPrng, ulid, ulidToUUID, uuidToULID } from "../mod.ts";

const prng = detectPrng();
const uliddValue = ulid();

Deno.bench("encodeTime", function () {
  encodeTime(1469918176385);
});

Deno.bench("decodeTime", function () {
  decodeTime(uliddValue);
});

Deno.bench("encodeRandom", function () {
  encodeRandom(10, prng);
});

Deno.bench("generate", function () {
  ulid(1469918176385);
});

Deno.bench("ulidToUUID", function () {
  ulidToUUID(uliddValue);
});

Deno.bench("uuidToULID", function () {
  uuidToULID(crypto.randomUUID());
});
