# Deno-ULID

[![JSR Scope](https://jsr.io/badges/@fajar)](https://jsr.io/@fajar)
[![JSR](https://jsr.io/badges/@fajar/deno-ulid)](https://jsr.io/@fajar/deno-ulid)
[![JSR Score](https://jsr.io/badges/@fajar/deno-ulid/score)](https://jsr.io/@fajar/deno-ulid)

ULID generator for Deno. ULID is an alternative to UUID but lexicographically
sortable, monotonic sort order and URL safe.

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
