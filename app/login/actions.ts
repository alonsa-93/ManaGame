"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, ADMIN_SESSION_TTL_MS, createSessionValue, passwordMatches } from "@/lib/auth/admin-session";
import { safeNextPath } from "@/lib/auth/safe-next-path";
import { createRateLimiter } from "@/lib/rate-limit";

/**
 * Ten attempts per IP per fifteen minutes. An operator who fat-fingers their
 * passphrase a few times is unaffected; an online guessing run is throttled to
 * a rate that makes even a weak passphrase impractical to brute-force.
 * lib/rate-limit.ts documents why this is per warm instance for now.
 */
const attempts = createRateLimiter({ limit: 10, windowMs: 15 * 60 * 1000 });

export type LoginResult = { error: string };

export async function loginAction(_prev: LoginResult | null, formData: FormData): Promise<LoginResult> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? "unknown";

  if (!attempts.check(ip).allowed) {
    return { error: "יותר מדי ניסיונות. נסו שוב בעוד רבע שעה." };
  }

  const password = String(formData.get("password") ?? "");
  if (!passwordMatches(password)) {
    // One message for every failure. Distinguishing "wrong passphrase" from
    // "no passphrase configured" would tell an attacker which one they hit.
    return { error: "סיסמה שגויה." };
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE, await createSessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(ADMIN_SESSION_TTL_MS / 1000),
  });

  redirect(safeNextPath(String(formData.get("next") ?? "")));
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/login");
}
