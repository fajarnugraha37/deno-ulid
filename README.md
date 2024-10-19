# Deno ULID Generator

[![JSR Scope](https://jsr.io/badges/@fajar)](https://jsr.io/@fajar)
[![JSR](https://jsr.io/badges/@fajar/deno-ulid)](https://jsr.io/@fajar/deno-ulid)
[![JSR Score](https://jsr.io/badges/@fajar/deno-ulid/score)](https://jsr.io/@fajar/deno-ulid)

This package provides a fast, lightweight, zero dependencies, no slow types are
used, fully type-safe and supporting multiple runtimes for generating ULIDs
(Universally Unique Lexicographically Sortable Identifiers). ULIDs offer a
lexicographically sortable (combine timestamps with a series of random
characters in a lexicographically sortable manner), universally unique,
efficient, monotonic sort order and URL safe alternative to UUIDs.

## Import

Add Package:

```bash
$ deno add jsr:@fajar/deno-ulid
```

Import symbol:

```typescript
import * as mod from "@fajar/deno-ulid";
```

OR Import directly with a jsr specifier

```typescript
import * as mod from "jsr:@fajar/deno-ulid";
```

## Usage

To generate a ULID, simply run the function:

```typescript
import { ulid } from "jsr:@fajar/deno-ulid";

ulid();
```

### Monotonic ULIDs

To generate monotonically increasing ULIDs, create a monotonic counter:

```typescript
import { monotonicFactory } from "jsr:@fajar/deno-ulid";

const ulid = monotonicFactory();
ulid(100000);
ulid(100000);
ulid(100000);
ulid(100000);
ulid(100000);
```

### Convert UUID to ULID

```typescript
import { uuidToULID } from "jsr:@fajar/deno-ulid";

uuidToULID(crypto.randomUUID());
```

### Convert ULID to UUID

```typescript
import { ulidToUUID } from "jsr:@fajar/deno-ulid";

const uuid = crypto.randomUUID();
ulidToUUID(uuid);
```

## Performance

```bash
$ deno task benchmark
```

```bash
CPU | 11th Gen Intel(R) Core(TM) i7-1165G7 @ 2.80GHz
Runtime | Deno 2.0.0 (x86_64-pc-windows-msvc)

file:///C:/Users/fajar.nugraha/Desktop/workspace/compose/deno-ulid/test/bench.ts

benchmark      time/iter (avg)        iter/s      (min … max)           p75      p99     p995
-------------- ----------------------------- --------------------- --------------------------
encodeTime            265.1 ns     3,772,000 (173.6 ns … 430.4 ns) 288.6 ns 390.9 ns 392.3 ns
decodeTime            657.6 ns     1,521,000 (513.6 ns … 993.4 ns) 730.2 ns 993.4 ns 993.4 ns
encodeRandom            4.9 µs       205,900 (  4.0 µs …   6.0 µs)   5.2 µs   6.0 µs   6.0 µs
generate                7.4 µs       136,000 (  6.3 µs …   8.3 µs)   7.7 µs   8.3 µs   8.3 µs
ulidToUUID              3.9 µs       257,900 (  3.5 µs …   4.6 µs)   4.0 µs   4.6 µs   4.6 µs
uuidToULID              6.4 µs       157,000 (  5.9 µs …   8.0 µs)   6.5 µs   8.0 µs   8.0 µs
```

## Test

```bash
$ deno test
```

```bash
running 1 test from ./test/test.ts
ulid ...
  prng ...
    should produce a number ... ok (1ms)
    should be between 0 and 1 ... ok (1ms)
  prng ... ok (4ms)
  incremenet base32 ...
    increments correctly ... ok (0ms)
    carries correctly ... ok (0ms)
    double increments correctly ... ok (0ms)
    throws when it cannot increment ... ok (0ms)
  incremenet base32 ... ok (2ms)
  randomChar ...
    should never return undefined ... ok (0ms)
    should never return an empty string ... ok (0ms)
  randomChar ... ok (153ms)
  encodeTime ...
    should return expected encoded result ... ok (0ms)
    should change length properly ... ok (0ms)
    should truncate time if not enough length ... ok (0ms)
    should throw an error ...
      if time greater than (2 ^ 48) - 1 ... ok (0ms)
      if time is not a number ... ok (0ms)
      if time is infinity ... ok (0ms)
      if time is negative ... ok (1ms)
      if time is a float ... ok (0ms)
    should throw an error ... ok (3ms)
  encodeTime ... ok (8ms)
  encodeRandom ...
    should return correct length ... ok (0ms)
  encodeRandom ... ok (0ms)
  decodeTime ...
    should return correct timestamp ... ok (0ms)
    should accept the maximum allowed timestamp ... ok (0ms)
    should reject ...
      malformed strings of incorrect length ... ok (0ms)
      strings with timestamps that are too high ... ok (0ms)
      invalid character ... ok (0ms)
    should reject ... ok (1ms)
  decodeTime ... ok (1ms)
  ulid ...
    should return correct length ... ok (0ms)
    should return expected encoded time component result ... ok (0ms)
  ulid ... ok (0ms)
  monotonicity ...
    without seedTime ...
      first call ... ok (0ms)
      second call ... ok (0ms)
      third call ... ok (0ms)
      fourth call ... ok (0ms)
    without seedTime ... ok (1ms)
    with seedTime ...
      first call ... ok (0ms)
      second call with the same ... ok (0ms)
      third call with less than ... ok (0ms)
      fourth call with even more less than ... ok (0ms)
      fifth call with 1 greater than ... ok (0ms)
    with seedTime ... ok (2ms)
  monotonicity ... ok (5ms)
ulid ... ok (181ms)

ok | 1 passed (45 steps) | 0 failed (183ms)
```
