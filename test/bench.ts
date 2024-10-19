import * as ulid from "../mod.ts";

const prng = ulid.detectPrng();
const uliddValue = ulid.ulid();

Deno.bench("encodeTime", function () {
  ulid.encodeTime(1469918176385);
});

Deno.bench("decodeTime", function () {
  ulid.decodeTime(uliddValue);
});

Deno.bench("encodeRandom", function () {
  ulid.encodeRandom(10, prng);
});

Deno.bench("generate", function () {
  ulid.ulid(1469918176385);
});

Deno.bench("ulidToUUID", function () {
  ulid.ulidToUUID(uliddValue);
});

Deno.bench("uuidToULID", function () {
  ulid.uuidToULID(crypto.randomUUID());
});
