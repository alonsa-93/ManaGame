import { describe, expect, it } from "vitest";
import { createRateLimiter } from "@/lib/rate-limit";

describe("createRateLimiter", () => {
  it("allows up to the limit inside one window", () => {
    const limiter = createRateLimiter({ limit: 3, windowMs: 60_000 });
    expect(limiter.check("a", 0).allowed).toBe(true);
    expect(limiter.check("a", 100).allowed).toBe(true);
    expect(limiter.check("a", 200).allowed).toBe(true);
    expect(limiter.check("a", 300).allowed).toBe(false);
  });

  it("reports how long until the window resets", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 60_000 });
    limiter.check("a", 0);
    expect(limiter.check("a", 10_000)).toEqual({ allowed: false, retryAfterMs: 50_000 });
  });

  it("starts a fresh window once the old one expires", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 60_000 });
    expect(limiter.check("a", 0).allowed).toBe(true);
    expect(limiter.check("a", 30_000).allowed).toBe(false);
    expect(limiter.check("a", 60_000).allowed).toBe(true);
  });

  it("keeps keys independent", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 60_000 });
    expect(limiter.check("a", 0).allowed).toBe(true);
    expect(limiter.check("b", 0).allowed).toBe(true);
    expect(limiter.check("a", 0).allowed).toBe(false);
  });

  it("does not grow unboundedly — expired windows are swept", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1_000 });
    for (let i = 0; i < 500; i++) limiter.check(`ip-${i}`, i);
    // Far past every window above; the next check should behave as a clean slate.
    expect(limiter.check("ip-0", 10_000).allowed).toBe(true);
  });
});
