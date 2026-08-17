import { chromium } from "playwright-core";

const BASE = "http://localhost:3100";

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});

function log(msg) {
  console.log(`✓ ${msg}`);
}

await page.goto(`${BASE}/play/supply-chain-manager-1`, { waitUntil: "networkidle" });
log("Welcome page loaded");
await page.getByRole("button", { name: "מתחילים" }).click();
await page.waitForURL(/\/consent$/);
log("Redirected to consent page");

await page.getByRole("button", { name: "אני מסכים/ה ומתחיל/ה" }).click();
await page.waitForURL(/\/turn$/);
log("Redirected to turn page");

await page.waitForSelector("text=סבב 1 מתוך 4");
log("Turn 1 rendered");

const textarea = page.locator("textarea");
await textarea.fill("אני בודק ספק חלופי לפני שאני מקצה עובדים, ומעדכן את מנהל הכספים על הסיכון התקציבי.");
await page.getByRole("button", { name: "המשך" }).click();

await page.waitForSelector("text=זה מה שהמערכת הבינה מההחלטה שלכם:", { timeout: 15000 });
log("Parse confirmation shown");

const matched = await page.locator("li").allTextContents();
console.log("  matched options:", matched);
if (matched.length === 0) throw new Error("Expected at least one matched option for a clear decision");

await page.getByRole("button", { name: "מאשר/ת" }).click();

await page.waitForSelector("text=סבב 2 מתוך 4", { timeout: 15000 });
log("Advanced to turn 2 with updated KPI state");

const eventText = await page.locator("text=עדכון חדש").count();
if (eventText === 0) throw new Error("Expected an event card on turn 2");
log("Event card ('עדכון חדש') shown on turn 2 — branching engine works");

// Fast-forward through remaining turns with generic decisions.
for (let i = 0; i < 3; i++) {
  const stillPlaying = await page.locator("textarea").count();
  if (stillPlaying === 0) break;
  await page.locator("textarea").fill("אני מתקשר עם הצוות ומעדכן את בעלי העניין לפני שאני מקבל החלטה סופית.");
  await page.getByRole("button", { name: "המשך" }).click();
  await page.waitForSelector("text=מאשר/ת", { timeout: 15000 });
  await page.getByRole("button", { name: "מאשר/ת" }).click();
  await page.waitForTimeout(800);
}

await page.waitForURL(/\/complete$/, { timeout: 15000 });
log("Reached completion page");
await page.waitForSelector("text=סיימתם את הסימולציה");
log("Completion copy rendered");

if (errors.length > 0) {
  console.error("Console/page errors detected:", errors);
  process.exitCode = 1;
} else {
  console.log("\nAll candidate-flow smoke checks passed with zero console errors.");
}

await browser.close();
