import { chromium } from "playwright-core";

const BASE = "http://localhost:3100";
const PAGES = [
  "/",
  "/technology",
  "/experience",
  "/contact",
  "/legal/privacy",
  "/legal/terms",
  "/legal/accessibility",
  "/assessor/sessions",
  "/assessor/comparison",
  "/assessor/calibration",
  "/assessor/settings",
  "/admin/scenarios",
  "/admin/events",
  "/admin/rubric",
  "/admin/system",
];

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
let failed = false;

for (const path of PAGES) {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("response", (res) => {
    if (res.url().startsWith(BASE) && res.status() >= 400) errors.push(`HTTP ${res.status()} on ${res.url()}`);
  });

  try {
    await page.goto(`${BASE}${path}`, { waitUntil: "networkidle", timeout: 20000 });
    await page.waitForTimeout(300);
  } catch (e) {
    errors.push(String(e));
  }

  if (errors.length > 0) {
    failed = true;
    console.log(`✗ ${path}`);
    for (const e of errors) console.log(`    ${e}`);
  } else {
    console.log(`✓ ${path}`);
  }
  await page.close();
}

await browser.close();
if (failed) process.exitCode = 1;
