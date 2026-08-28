import { describe, expect, it, afterEach } from "vitest";
import { canonicalSiteUrl, deploymentUrl } from "@/lib/site-url";

const KEYS = ["NEXT_PUBLIC_SITE_URL", "VERCEL_URL", "VERCEL_PROJECT_PRODUCTION_URL"] as const;

afterEach(() => {
  for (const k of KEYS) delete process.env[k];
});

describe("canonicalSiteUrl", () => {
  it("prefers an explicit override", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://managame.co.il";
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "ignored.vercel.app";
    expect(canonicalSiteUrl()).toBe("https://managame.co.il");
  });

  it("falls back to the project's stable production domain", () => {
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "mana-game-amber.vercel.app";
    expect(canonicalSiteUrl()).toBe("https://mana-game-amber.vercel.app");
  });

  it("never uses the per-deployment URL — that would rotate the canonical origin on every push", () => {
    process.env.VERCEL_URL = "mana-game-9f2ab1x-alonsa.vercel.app";
    expect(canonicalSiteUrl()).toBe("https://mana-game-amber.vercel.app");
  });

  it("adds a protocol to Vercel's bare-host values and strips trailing slashes", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "managame.co.il/";
    expect(canonicalSiteUrl()).toBe("https://managame.co.il");
  });
});

describe("deploymentUrl", () => {
  it("does use the per-deployment URL, so a notification links to the deploy that produced it", () => {
    process.env.VERCEL_URL = "mana-game-9f2ab1x-alonsa.vercel.app";
    expect(deploymentUrl()).toBe("https://mana-game-9f2ab1x-alonsa.vercel.app");
  });

  it("still honours an explicit override first", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://managame.co.il";
    process.env.VERCEL_URL = "ignored.vercel.app";
    expect(deploymentUrl()).toBe("https://managame.co.il");
  });

  it("falls back to the production alias", () => {
    expect(deploymentUrl()).toBe("https://mana-game-amber.vercel.app");
  });
});
