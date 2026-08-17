/**
 * Lightweight adversarial-input screen for candidate free text.
 * Not a security boundary by itself — it flags content for the
 * "requires human review" path and prevents obviously adversarial
 * text from being forwarded to the judge as if it were a genuine
 * business decision. See Master Spec §58-59.
 */

const INJECTION_PATTERNS: RegExp[] = [
  /ignore (all|previous|prior|the) instructions?/i,
  /disregard (all|previous|prior|the) instructions?/i,
  /system prompt/i,
  /you are now/i,
  /act as (a|an)/i,
  /give me (100|full|maximum|a perfect) (points|score)/i,
  /reveal (the|your) (rubric|prompt|criteria|score)/i,
  /תתעלם מ(ה)?הוראות/,
  /התעלם מכל ההוראות/,
  /תן לי ציון (מלא|100|מושלם)/,
  /גלה לי את (הרובריקה|הקריטריונים|הציון)/,
  /אתה עכשיו/,
  /<\|.*?\|>/,
  /```system/i,
];

export interface SecurityScanResult {
  flagged: boolean;
  reason?: string;
}

export function scanForInjection(text: string): SecurityScanResult {
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(text)) {
      return { flagged: true, reason: "adversarial_pattern" };
    }
  }
  return { flagged: false };
}
