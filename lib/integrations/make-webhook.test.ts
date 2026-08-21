import { afterEach, describe, expect, it, vi } from "vitest";
import { siteUrl } from "@/lib/integrations/make-webhook";

describe("siteUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("prefers NEXT_PUBLIC_SITE_URL when set", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://custom.example.com");
    vi.stubEnv("VERCEL_URL", "some-deployment.vercel.app");
    expect(siteUrl()).toBe("https://custom.example.com");
  });

  it("falls back to VERCEL_URL (prefixed with https://) when no explicit site URL is set", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_URL", "some-deployment.vercel.app");
    expect(siteUrl()).toBe("https://some-deployment.vercel.app");
  });

  it("falls back to the known canonical production domain when neither is set", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_URL", "");
    expect(siteUrl()).toBe("https://mana-game-amber.vercel.app");
  });
});
