/**
 * Reorders a Hebrew line from logical order into visual order.
 *
 * ONLY for Satori, the renderer behind `next/og`. Satori has no bidi engine:
 * it paints characters strictly left-to-right in the order it receives them,
 * so a Hebrew string comes out mirrored ("החלטות" → "תוטלחה"). Feeding it the
 * reversed string cancels that out.
 *
 * Never use this anywhere else. The browser has a real bidi implementation and
 * `dir="rtl"` does the right thing; running text through here first would
 * double-reverse it and corrupt the page — and it would also corrupt anything
 * copied out of it, since the underlying characters really are in the wrong
 * order. This is a rendering workaround, not a text transformation.
 *
 * Scope: single lines of Hebrew with spaces, digits and punctuation. Mixed
 * Hebrew/Latin runs need actual bidi (UAX #9) and are deliberately not handled
 * — see `containsLatin` below, which refuses rather than silently mangling.
 */

const HEBREW = /[֐-׿]/;
const LATIN = /[A-Za-z]/;

/**
 * Characters whose glyph must be swapped for its mirror when the run flips.
 * A "(" at the start of a logical Hebrew phrase has to stay an opening bracket
 * visually, which means becoming ")" once the order reverses.
 */
const MIRRORED: Record<string, string> = {
  "(": ")",
  ")": "(",
  "[": "]",
  "]": "[",
  "{": "}",
  "}": "{",
  "<": ">",
  ">": "<",
};

export function toVisualRtl(line: string): string {
  if (!HEBREW.test(line)) return line;
  if (LATIN.test(line)) {
    throw new Error(
      `toVisualRtl: mixed Hebrew/Latin needs real bidi, refusing to mangle: ${JSON.stringify(line)}`
    );
  }

  return [...line].reverse().map((ch) => MIRRORED[ch] ?? ch).join("");
}
