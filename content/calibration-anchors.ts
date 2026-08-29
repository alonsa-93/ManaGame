import type { CriterionKey } from "@/lib/scenario-schema";

/**
 * Anchor answers for the calibration page — one illustrative low/mid/high
 * example per criterion, so a human assessor reading a report has something
 * concrete to compare a candidate's evidence sentence against before
 * agreeing or disagreeing with the model's score.
 *
 * Deliberately domain-neutral: the fixed rubric is what makes cross-domain
 * comparison possible at all (see lib/scenario-schema.ts), so an anchor tied
 * to one scenario's specifics would defeat that. These are paraphrased
 * example statements, not quotes from any real scenario or candidate.
 *
 * Scores are illustrative points on the 0–100 scale reports use
 * (`score100`), not the raw 0–5 signal scenarios author — chosen to sit
 * clearly apart (15 / 55 / 90) so they read as anchors, not as claims about
 * exact thresholds.
 */

export interface CalibrationAnchor {
  score: number;
  example_he: string;
  rationale_he: string;
}

export interface CriterionAnchors {
  low: CalibrationAnchor;
  mid: CalibrationAnchor;
  high: CalibrationAnchor;
}

export const CALIBRATION_ANCHORS: Record<CriterionKey, CriterionAnchors> = {
  diagnosis_before_action: {
    low: {
      score: 15,
      example_he: "“בלי לבדוק מה קרה בפועל, כבר החלטתי להחליף את הגישה לגמרי.”",
      rationale_he: "פעל לפני שהבין מה בכלל קרה — אין אבחון, יש רק תגובה.",
    },
    mid: {
      score: 55,
      example_he: "“ביקשתי הסבר קצר מהצוות, ולפיו קיבלתי החלטה תוך שעה.”",
      rationale_he: "יש אבחון, אבל שטחי — מספיק כדי להחליט, לא כדי להבין את השורש.",
    },
    high: {
      score: 90,
      example_he: "“לפני שהחלטתי, ביקשתי לראות את הנתונים הגולמיים ובדקתי אם התבנית חזרה על עצמה בעבר.”",
      rationale_he: "בדק את שורש הבעיה באופן פעיל לפני שפעל, לא רק שאל מה קרה.",
    },
  },
  financial_awareness: {
    low: {
      score: 15,
      example_he: "“לא בדקתי כמה זה יעלה, פשוט אישרתי את ההוצאה.”",
      rationale_he: "אין כל שיקול כספי מודע בהחלטה.",
    },
    mid: {
      score: 55,
      example_he: "“בדקתי בערך את סדר הגודל של העלות מול התועלת, בלי לרדת לפירוט.”",
      rationale_he: "יש שיקול כספי, אבל גס ולא מבוסס על מספרים אמיתיים.",
    },
    high: {
      score: 90,
      example_he: "“חישבתי את ההשפעה על התזרים ברבעון הקרוב, כולל תרחיש שבו הפתרון לא עובד בפעם הראשונה.”",
      rationale_he: "שיקול כספי מדויק שכולל גם תרחיש כישלון, לא רק את המקרה הטוב.",
    },
  },
  realism: {
    low: {
      score: 15,
      example_he: "“הבטחתי ללקוח תאריך שידעתי שהצוות לא יעמוד בו, כדי לסגור את השיחה.”",
      rationale_he: "התחייבות שהיא ידועה כלא ריאלית מראש.",
    },
    mid: {
      score: 55,
      example_he: "“נתתי הערכת זמן זהירה, בלי לבדוק אותה מול מי שבפועל מבצע את העבודה.”",
      rationale_he: "זהירות סבירה, אך לא מעוגנת בבדיקה מול המציאות התפעולית.",
    },
    high: {
      score: 90,
      example_he: "“לפני שהתחייבתי לתאריך, בדקתי מול הצוות אם הוא ריאלי, וחזרתי ללקוח עם מספר שאני יכול לעמוד בו.”",
      rationale_he: "התחייבות מעוגנת בבדיקה אמיתית מול מי שמבצע את העבודה.",
    },
  },
  information_acquisition: {
    low: {
      score: 15,
      example_he: "“החלטתי מיד, בלי לבדוק שום נתון נוסף.”",
      rationale_he: "אין שום ניסיון לרכוש מידע לפני ההחלטה.",
    },
    mid: {
      score: 55,
      example_he: "“ביקשתי נתון מרכזי אחד לפני שהחלטתי, ולא יותר מזה.”",
      rationale_he: "רכישת מידע חלקית — צעד אחד, לא בירור מספק.",
    },
    high: {
      score: 90,
      example_he: "“רכשתי שני מקורות מידע עצמאיים לפני ההחלטה, כדי לא להסתמך על תמונה חלקית אחת.”",
      rationale_he: "בירור פעיל וממוקד ממספר מקורות לפני שקיבל החלטה.",
    },
  },
  prioritization: {
    low: {
      score: 15,
      example_he: "“ניסיתי לטפל בכל הבעיות בו־זמנית, ובסוף לא התקדמתי באף אחת מהן.”",
      rationale_he: "אין תעדוף כלל — פיזור מאמץ בלי בחירה מודעת.",
    },
    mid: {
      score: 55,
      example_he: "“בחרתי לטפל קודם בבעיה הדחופה ביותר, בלי לשקול לעומק את שאר האפשרויות.”",
      rationale_he: "תעדוף אינטואיטיבי, לא מבוסס על שקילה מפורשת.",
    },
    high: {
      score: 90,
      example_he: "“מיפיתי את האפשרויות, שקללתי דחיפות מול השפעה, ובחרתי במודע באיזו לא לטפל כרגע.”",
      rationale_he: "תעדוף מפורש שכולל גם החלטה מודעת מה להשאיר בצד.",
    },
  },
  knowing_when_to_stop: {
    low: {
      score: 15,
      example_he: "“המשכתי לפי התוכנית המקורית גם כשהיו סימנים ברורים שהיא לא עובדת.”",
      rationale_he: "התעלמות מסימנים ברורים שמצדיקים עצירה.",
    },
    mid: {
      score: 55,
      example_he: "“עצרתי לרגע לשקול, אבל בסוף המשכתי כמתוכנן כי זה היה פשוט יותר.”",
      rationale_he: "יש היסוס, אך לא פעולה בפועל לאור הסימנים.",
    },
    high: {
      score: 90,
      example_he: "“כשההנחות שעליהן בניתי את התוכנית התבררו כשגויות, עצרתי ובניתי מסלול חדש — גם שזה עלה זמן.”",
      rationale_he: "עצירה בפועל ושינוי כיוון לאור עדות שהתוכנית המקורית שגויה.",
    },
  },
  knowledge_protection: {
    low: {
      score: 15,
      example_he: "“הידע הקריטי נשאר אצל אדם אחד, ולא עשיתי כלום בנידון.”",
      rationale_he: "אין כל פעולה להפחתת סיכון הריכוזיות בידע.",
    },
    mid: {
      score: 55,
      example_he: "“ביקשתי מבעל הידע לתעד אותו “כשיהיה לו זמן”.”",
      rationale_he: "מודעות לבעיה, אבל בלי לתעדף אותה או לוודא שהיא קורית.",
    },
    high: {
      score: 90,
      example_he: "“יזמתי תיעוד מובנה של הידע הקריטי ברגע שזיהיתי שהוא מרוכז אצל אדם אחד, לפני שהיה משבר.”",
      rationale_he: "פעולה יזומה ומיידית להפחתת סיכון תלות באדם יחיד.",
    },
  },
  communication: {
    low: {
      score: 15,
      example_he: "“הצגתי רק את החלק החיובי של התמונה, כדי לא “להדאיג” את ההנהלה.”",
      rationale_he: "מסר סלקטיבי שמסתיר מידע רלוונטי.",
    },
    mid: {
      score: 55,
      example_he: "“עדכנתי את בעלי העניין המרכזיים, אבל לא באופן אחיד לכולם.”",
      rationale_he: "יש תקשורת, אך לא עקבית בין נמענים שונים.",
    },
    high: {
      score: 90,
      example_he: "“מסרתי אותו עדכון שקוף ומדויק לכל בעלי העניין הרלוונטיים, כולל מה שעדיין לא ברור.”",
      rationale_he: "מסר עקבי, שקוף, ומשתף גם באי־ודאות ולא רק בהצלחות.",
    },
  },
  workload_management: {
    low: {
      score: 15,
      example_he: "“ביקשתי מהצוות לספוג עוד עומס בלי שינוי, גם אחרי שדיווחו על תשישות.”",
      rationale_he: "התעלמות מדיווח מפורש על עומס וסיכון שחיקה.",
    },
    mid: {
      score: 55,
      example_he: "“הבטחתי לצוות שאטפל בעומס “בקרוב”, בלי לשנות שום דבר בפועל באותו רגע.”",
      rationale_he: "הכרה בבעיה בלי פעולה מיידית בפועל.",
    },
    high: {
      score: 90,
      example_he: "“כשזיהיתי סימני עומס, חילקתי מחדש את העבודה או הבאתי תגבור באותו שבוע, לפני שזה הפך למשבר.”",
      rationale_he: "פעולה מיידית וממשית ברגע שזוהה סימן עומס, לא רק הבטחה.",
    },
  },
};
