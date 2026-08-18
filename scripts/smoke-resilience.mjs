// Verifies lib/session-cache.ts: the candidate flow must survive the
// in-process store being wiped mid-session (simulating a cold serverless
// instance), by rehydrating from the session cookie.
import { chromium } from "playwright-core";

const BASE = "http://localhost:3100";

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));

function log(msg) {
  console.log(`✓ ${msg}`);
}

await page.goto(`${BASE}/play/finance-manager-1`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "מתחילים" }).click();
await page.waitForURL(/\/consent$/);
await page.getByRole("button", { name: "אני מסכים/ה ומתחיל/ה" }).click();
await page.waitForURL(/\/turn$/);
log("Session created and consented");

// Simulate a cold serverless instance: wipe the in-process store entirely.
const clearRes = await page.request.post(`${BASE}/api/debug-clear-store`);
const clearBody = await clearRes.json();
console.log(`  server-side store cleared (had ${clearBody.clearedSessions} session[s])`);

// The page hasn't reloaded — but the NEXT server action call must resolve
// the session via the cookie, not from (now-empty) memory.
await page.locator("textarea").fill("אני בודק את הנחת התזרים לפני שאני מקפיא תקציבים, ומעדכן את סמנכ\"ל הכספים.");
await page.getByRole("button", { name: "המשך" }).click();

await page.waitForSelector("text=זה מה שהמערכת הבינה מההחלטה שלכם:", { timeout: 15000 });
log("Preview succeeded AFTER store wipe — session rehydrated from cookie");

await page.getByRole("button", { name: "מאשר/ת" }).click();
await page.waitForSelector("text=סבב", { timeout: 15000 });
log("Commit succeeded AFTER store wipe — turn advanced correctly");

// Also verify a fresh page LOAD (GET request) recovers after a wipe.
await page.request.post(`${BASE}/api/debug-clear-store`);
await page.reload({ waitUntil: "networkidle" });
const stillOnTurnPage = page.url().includes("/turn");
if (!stillOnTurnPage) throw new Error(`Expected to stay on the turn page after reload+wipe, got ${page.url()}`);
log("Page reload AFTER store wipe still resolves the session (GET-path rehydration)");

if (errors.length > 0) {
  console.error("Console/page errors detected:", errors);
  process.exitCode = 1;
} else {
  console.log("\nResilience checks passed: candidate flow survives a mid-session store wipe.");
}

await browser.close();
