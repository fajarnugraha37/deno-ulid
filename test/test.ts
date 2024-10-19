import { FakeTime } from "@std/testing/time";
import {
  assert,
  assertEquals,
  assertStrictEquals,
  assertThrows,
} from "@std/assert";
import { ulid, incrementBase32, detectPrng, randomChar, monotonicFactory } from "../mod.ts";
import { encodeTime, encodeRandom, decodeTime } from "../lib/encode-decode.ts";

Deno.test("ulid", async (t) => {
  await t.step("prng", async (t) => {
    const prng = detectPrng();

    await t.step("should produce a number", () => {
      assertEquals(false, isNaN(prng()));
    });

    await t.step("should be between 0 and 1", () => {
      const num = prng();
      assert(num >= 0 && num <= 1);
    });
  });

  await t.step("incremenet base32", async (t) => {
    await t.step("increments correctly", () => {
      assertEquals("A109D", incrementBase32("A109C"));
    });

    await t.step("carries correctly", () => {
      assertEquals("A1Z00", incrementBase32("A1YZZ"));
    });

    await t.step("double increments correctly", () => {
      assertEquals(
        "A1Z01",
        incrementBase32(incrementBase32("A1YZZ")),
      );
    });

    await t.step("throws when it cannot increment", () => {
      assertThrows(() => {
        incrementBase32("ZZZ");
      });
    });
  });

  await t.step("randomChar", async (t) => {
    const sample: Record<string, number> = {};
    const prng = detectPrng();

    for (let x = 0; x < 320000; x++) {
      const char = String(randomChar(prng)); // for if it were to ever return undefined
      if (sample[char] === undefined) {
        sample[char] = 0;
      }
      sample[char] += 1;
    }

    await t.step("should never return undefined", () => {
      assertEquals(undefined, sample["undefined"]);
    });

    await t.step("should never return an empty string", () => {
      assertEquals(undefined, sample[""]);
    });
  });

  await t.step("encodeTime", async (t) => {
    await t.step("should return expected encoded result", () => {
      assertEquals("01ARYZ6S41", encodeTime(1469918176385, 10));
    });

    await t.step("should change length properly", () => {
      assertEquals("0001AS99AA60", encodeTime(1470264322240, 12));
    });

    await t.step("should truncate time if not enough length", () => {
      assertEquals("AS4Y1E11", encodeTime(1470118279201, 8));
    });

    await t.step("should throw an error", async (t) => {
      await t.step("if time greater than (2 ^ 48) - 1", () => {
        assertThrows(() => {
          encodeTime(Math.pow(2, 48), 8);
        }, Error);
      });

      await t.step("if time is not a number", () => {
        assertThrows(() => {
          // deno-lint-ignore no-explicit-any
          encodeTime("test" as any, 3);
        }, Error);
      });

      await t.step("if time is infinity", () => {
        assertThrows(() => {
          encodeTime(Infinity);
        }, Error);
      });

      await t.step("if time is negative", () => {
        assertThrows(() => {
          encodeTime(-1);
        }, Error);
      });

      await t.step("if time is a float", () => {
        assertThrows(() => {
          encodeTime(100.1);
        }, Error);
      });
    });
  });

  await t.step("encodeRandom", async (t) => {
    const prng = detectPrng();

    await t.step("should return correct length", () => {
      assertEquals(12, encodeRandom(12, prng).length);
    });
  });

  await t.step("decodeTime", async (t) => {
    await t.step("should return correct timestamp", () => {
      const timestamp = Date.now();
      const id = ulid(timestamp);
      assertEquals(timestamp, decodeTime(id));
    });

    await t.step("should accept the maximum allowed timestamp", () => {
      assertEquals(
        281474976710655,
        decodeTime("7ZZZZZZZZZZZZZZZZZZZZZZZZZ"),
      );
    });

    await t.step("should reject", async (t) => {
      await t.step("malformed strings of incorrect length", () => {
        assertThrows(() => {
          decodeTime("FFFF");
        }, Error);
      });

      await t.step("strings with timestamps that are too high", () => {
        assertThrows(() => {
          decodeTime("80000000000000000000000000");
        }, Error);
      });

      await t.step("invalid character", () => {
        assertThrows(() => {
          decodeTime("&1ARZ3NDEKTSV4RRFFQ69G5FAV");
        }, Error);
      });
    });
  });

  await t.step("ulid", async (t) => {
    await t.step("should return correct length", () => {
      assertEquals(26, ulid().length);
    });

    await t.step(
      "should return expected encoded time component result",
      () => {
        assertEquals("01ARYZ6S41", ulid(1469918176385).substring(0, 10));
      },
    );
  });

  await t.step("monotonicity", async (t) => {
    function stubbedPrng() {
      return 0.96;
    }

    await t.step("without seedTime", async (t) => {
      const stubbedUlid = monotonicFactory(stubbedPrng);

      const time = new FakeTime(1469918176385);

      await t.step("first call", () => {
        assertEquals("01ARYZ6S41YYYYYYYYYYYYYYYY", stubbedUlid());
      });

      await t.step("second call", () => {
        assertEquals("01ARYZ6S41YYYYYYYYYYYYYYYZ", stubbedUlid());
      });

      await t.step("third call", () => {
        assertEquals("01ARYZ6S41YYYYYYYYYYYYYYZ0", stubbedUlid());
      });

      await t.step("fourth call", () => {
        assertEquals("01ARYZ6S41YYYYYYYYYYYYYYZ1", stubbedUlid());
      });

      time.restore();
    });

    await t.step("with seedTime", async (t) => {
      const stubbedUlid = monotonicFactory(stubbedPrng);

      await t.step("first call", () => {
        assertEquals("01ARYZ6S41YYYYYYYYYYYYYYYY", stubbedUlid(1469918176385));
      });

      await t.step("second call with the same", () => {
        assertStrictEquals(
          "01ARYZ6S41YYYYYYYYYYYYYYYZ",
          stubbedUlid(1469918176385),
        );
      });

      await t.step("third call with less than", () => {
        assertEquals("01ARYZ6S41YYYYYYYYYYYYYYZ0", stubbedUlid(100000000));
      });

      await t.step("fourth call with even more less than", () => {
        assertEquals("01ARYZ6S41YYYYYYYYYYYYYYZ1", stubbedUlid(10000));
      });

      await t.step("fifth call with 1 greater than", () => {
        assertEquals("01ARYZ6S42YYYYYYYYYYYYYYYY", stubbedUlid(1469918176386));
      });
    });
  });
});
