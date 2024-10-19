export interface PRNG {
  (): number;
}

export interface ULID {
  (seedTime?: number): string;
}
