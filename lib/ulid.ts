import type { PRNG, ULID } from "@types";
import { GLOBAL } from "./const.ts";
import { incrementBase32, randomChar } from "./util.ts";
import { crockford } from "./crockford.ts";

export function encodeTime(now: number, len: number = GLOBAL.TIME_LEN): string {
    if (now > GLOBAL.TIME_MAX) {
        throw new Deno.errors.InvalidData("cannot encode time greater than " + GLOBAL.TIME_MAX);
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

export function detectPrng(): PRNG {
    return () => {
        const buffer = new Uint8Array(1);
        crypto.getRandomValues(buffer);
        return buffer[0] / 0xff;
    };
}

export function fixULIDBase32(id: string): string {
    return id.replace(/i/gi, "1")
        .replace(/l/gi, "1")
        .replace(/o/gi, "0")
        .replace(/-/g, "");
}

export function isValid(id: string): boolean {
    return (
        typeof id === "string" &&
        id.length === GLOBAL.TIME_LEN + GLOBAL.RANDOM_LEN &&
        id
            .toUpperCase()
            .split("")
            .every(char => GLOBAL.ENCODING.indexOf(char) !== -1)
    );
}

export function factory(prng: PRNG = detectPrng()): ULID {
    return function ulid(seedTime: number = Date.now()): string {
        return encodeTime(seedTime, GLOBAL.TIME_LEN) + encodeRandom(GLOBAL.RANDOM_LEN, prng);
    };
}

export function monotonicFactory(prng: PRNG = detectPrng()): ULID {
    let lastTime = 0;
    let lastRandom: string;
    return function ulid(seedTime: number = Date.now()): string {
        if (seedTime <= lastTime) {
            const incrementedRandom = (lastRandom = incrementBase32(lastRandom));
            return encodeTime(lastTime, GLOBAL.TIME_LEN) + incrementedRandom;
        }
        lastTime = seedTime;
        const newRandom = (lastRandom = encodeRandom(GLOBAL.RANDOM_LEN, prng));
        return encodeTime(seedTime, GLOBAL.TIME_LEN) + newRandom;
    };
}

export const ulid = factory();

export function ulidToUUID(ulid: string): string {
    const isValid = GLOBAL.ULID_REGEX.test(ulid);
    if (!isValid) {
        throw new Deno.errors.InvalidData("Invalid ULID");
    }

    const uint8Array = crockford.decode(ulid);
    const uuid = Array.from(uint8Array)
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");

    return (
        uuid.substring(0, 8) +
        "-" +
        uuid.substring(8, 12) +
        "-" +
        uuid.substring(12, 16) +
        "-" +
        uuid.substring(16, 20) +
        "-" +
        uuid.substring(20)
    );
}

export function uuidToULID(uuid: string): string {
    const isValid = GLOBAL.UUID_REGEX.test(uuid);
    if (!isValid) {
        throw new Deno.errors.InvalidData("Invalid UUID");
    }
    const clean = uuid.replace(/-/g, "")
        .match(/.{1,2}/g);
    if(!clean) {
        throw new Deno.errors.InvalidData("Invalid UUID");
    }
    const uint8Array = new Uint8Array(clean.map(byte => parseInt(byte, 16)));

    return crockford.encode(uint8Array);
}