// One-off script: derive brand raster assets from the supplied logo PNG.
// Source is a horizontal lockup (mark + wordmark + tagline) on transparent bg.
import sharp from "sharp";
import path from "node:path";
import fs from "node:fs";

const src = path.resolve("public/brand/logo-source.png");
const outDir = path.resolve("public/brand");

const meta = await sharp(src).metadata();
console.log("source size", meta.width, meta.height);

// Primary logo (full lockup), trimmed of excess transparent padding.
const trimmedBuf = await sharp(src).trim().png().toBuffer();
await sharp(trimmedBuf).toFile(path.join(outDir, "logo.png"));
const trimmedMeta = await sharp(trimmedBuf).metadata();

// The mark occupies roughly the left ~30% of the trimmed horizontal lockup.
const markWidth = Math.round(trimmedMeta.width * 0.34);
await sharp(trimmedBuf)
  .extract({ left: 0, top: 0, width: markWidth, height: trimmedMeta.height })
  .png()
  .toFile(path.join(outDir, "mark.png"));

// PNG exports at required sizes (full lockup, transparent bg).
for (const size of [512, 1024, 2048]) {
  await sharp(trimmedBuf)
    .resize({ width: size, fit: "inside" })
    .png()
    .toFile(path.join(outDir, `logo-${size}.png`));
}

// Mark-only favicon source at multiple sizes.
const markMeta = await sharp(path.join(outDir, "mark.png")).metadata();
for (const size of [32, 180, 512]) {
  await sharp(path.join(outDir, "mark.png"))
    .resize({ width: size, height: size, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(outDir, `favicon-${size}.png`));
}

fs.copyFileSync(path.join(outDir, "favicon-32.png"), path.resolve("public/favicon.png"));

console.log("done. mark size:", markMeta.width, markMeta.height);
