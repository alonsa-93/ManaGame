import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { toVisualRtl } from "@/lib/rtl-visual";

export const alt = "ManaGame — החלטות שמנהלות מציאות";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Assistant is the brand's Hebrew face (app/layout.tsx loads it for the site
 * itself). It has to be shipped as a real file here rather than pulled from
 * next/font, because this image is rendered by Satori at build time — it has
 * no stylesheet and no default font with Hebrew coverage, so without this the
 * Hebrew lines would come out as empty boxes.
 */
const assistantBold = await readFile(join(process.cwd(), "assets/Assistant-Bold.ttf"));

/**
 * Every Hebrew line is wrapped in toVisualRtl and every line break is authored
 * by hand. Both are forced by the same limitation: Satori paints characters
 * left-to-right with no bidi, and it would also wrap a long reversed string at
 * the wrong points — leaving the end of the sentence on the visually first
 * line. Choosing the breaks here keeps the reading order correct.
 */
const HEADLINE = "החלטות שמנהלות מציאות";
const SUBTITLE_LINES = ["לא שואלים מנהלים מה הם היו עושים.", "נותנים להם להתמודד עם מה שקורה באמת."];

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-end",
          // Lab mode — the spec's dark storytelling layer. A share card sits in
          // someone else's feed, so it gets the high-contrast treatment.
          backgroundColor: "#202624",
          padding: "68px 80px",
          fontFamily: "Assistant",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ fontSize: 34, color: "#f8f9f7", letterSpacing: -0.5 }}>ManaGame</div>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 18,
              backgroundImage: "linear-gradient(135deg, #19c4b1, #9bd64a)",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 26 }}>
          <div style={{ display: "flex", fontSize: 88, lineHeight: 1.2, color: "#f8f9f7" }}>
            {toVisualRtl(HEADLINE)}
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
            {SUBTITLE_LINES.map((line) => (
              <div key={line} style={{ display: "flex", fontSize: 34, lineHeight: 1.45, color: "#96a29e" }}>
                {toVisualRtl(line)}
              </div>
            ))}
          </div>
        </div>

        <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 25, color: "#66716e" }}>Decision Simulation Infrastructure</div>
          <div
            style={{
              width: 200,
              height: 6,
              borderRadius: 6,
              backgroundImage: "linear-gradient(90deg, #9bd64a, #19c4b1)",
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Assistant", data: assistantBold, style: "normal", weight: 700 }],
    }
  );
}
