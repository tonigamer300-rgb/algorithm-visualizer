/**
 * Deterministic pseudo-random number generator (mulberry32). Using a seeded PRNG
 * means a given (size, seed) pair always produces the same data set, which keeps
 * the "step back" / "reset" controls perfectly reproducible.
 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Build an array of `size` values in [min, max] from a seed. */
export function randomArray(size: number, seed: number, min = 5, max = 100): number[] {
  const rand = mulberry32(seed);
  return Array.from({ length: size }, () => Math.floor(rand() * (max - min + 1)) + min);
}

/** Build a sorted array (used by searching algorithms that require order). */
export function sortedArray(size: number, seed: number, min = 5, max = 100): number[] {
  return randomArray(size, seed, min, max).sort((a, b) => a - b);
}
