import type { Scenario } from "@/lib/scenario-schema";

/**
 * Domain content for "sales" (מכירות והכנסות). Follows the exact shape of
 * content/scenarios/supply-chain.ts: a KPI set (max 4, per Master Spec §11),
 * ~4 turns, and a canonical action vocabulary per turn with keyword hints,
 * deltas, evidence text and criteria signals (from the fixed CRITERIA list
 * in lib/scenario-schema.ts).
 */

const kpis: Scenario["kpis"] = [
  { key: "pipeline_coverage", label_he: "כיסוי צנרת מכירות", unit: "%", start: 260, min: 0, max: 400, higherIsBetter: true },
  { key: "discount_given", label_he: "היקף הנחה שניתנה", unit: "%", start: 0, min: 0, max: 40, higherIsBetter: false },
  { key: "customer_relationship", label_he: "חוזק קשר הלקוח", unit: "%", start: 74, min: 0, max: 100, higherIsBetter: true },
  { key: "quota_attainment", label_he: "עמידה ביעד רבעוני", unit: "%", start: 88, min: 0, max: 150, higherIsBetter: true },
];

const managerScenario: Scenario = {
  id: "sales-manager-1",
  domainKey: "sales",
  title_he: "לחץ סוף רבעון מול לקוח מרכזי",
  roleLevel: "manager",
  difficulty: 2,
  summary_he:
    "שבועיים לפני סגירת הרבעון, לקוח מרכזי מאיים לעזוב אלא אם יקבל הנחה חדה, ובמקביל יש עסקה מבטיחה בצנרת שטרם עברה הליך הכשרה (qualification).",
  estimatedMinutes: [20, 30],
  kpis,
  turns: [
    {
      index: 1,
      situation_he:
        "אתם מנהלים צוות מכירות אזורי. שבועיים לפני סגירת הרבעון, נציג הרכש של הלקוח המרכזי שלכם — כ-18% מההכנסה השנתית של הצוות — מודיע שהוא בוחן הצעה מתחרה זולה ב-25% וימתין לתשובה עד סוף השבוע. במקביל, נציג מכירות בצוות מדווח על עסקה חדשה ומבטיחה בהיקף גדול, אך הליד עדיין לא עבר הליך הכשרה (qualification) מסודר ואין תקציב מאושר אצל הלקוח הפוטנציאלי.",
      constraints_he: ["חלון זמן קצר עד סוף השבוע", "מכסת הנחה מוגבלת ללא אישור סמנכ\"ל", "עסקה חדשה לא מוכשרת"],
      availableIntel: [
        { label_he: "היסטוריית רכישות והרחבות של הלקוח", cost: 1, accuracy: 90 },
        { label_he: "ניתוח תחרותי על ההצעה המתחרה", cost: 2, accuracy: 70 },
        { label_he: "בדיקת תקציב ומוכנות של הליד החדש", cost: 2, accuracy: 80 },
      ],
      decisionPrompt_he: "מה היית עושה עכשיו?",
      options: [
        {
          key: "review_customer_history_first",
          label_he: "בדיקת היסטוריית הלקוח לפני מתן תשובה",
          keywords_he: ["לבדוק היסטוריה", "לבחון את הלקוח לעומק", "לאסוף נתונים על הלקוח לפני תגובה"],
          deltas: { customer_relationship: 2 },
          evidence_he: "בדק את היסטוריית הרכישות של הלקוח לפני שגיבש עמדה במשא ומתן.",
          criteriaSignals: { information_acquisition: 4, diagnosis_before_action: 3 },
          nextEvent_he:
            "עדכון חדש\n\nהבדיקה העלתה שהלקוח מרחיב שימוש בהדרגה כבר שנתיים, אך מעולם לא ביקש הנחה כזו. במקביל, ההצעה המתחרה כוללת רמת שירות נמוכה יותר — מידע שיכול לשמש במשא ומתן.",
        },
        {
          key: "offer_steep_discount_immediately",
          label_he: "הצעת ההנחה המבוקשת באופן מיידי",
          keywords_he: ["לתת הנחה מיד", "לאשר את ההנחה שביקשו", "להסכים להנחה גבוהה"],
          deltas: { discount_given: 20, quota_attainment: 5, customer_relationship: 1 },
          evidence_he: "אישר הנחה חדה מייד עם קבלת האיום, ללא בדיקה או משא ומתן מקדים.",
          criteriaSignals: { realism: 1, financial_awareness: 1, diagnosis_before_action: 1 },
        },
        {
          key: "qualify_new_deal_before_forecasting",
          label_he: "הכשרת העסקה החדשה לפני שילובה בתחזית",
          keywords_he: ["להכשיר את הליד", "qualification לעסקה החדשה", "לבדוק תקציב לפני תחזית"],
          deltas: { pipeline_coverage: -10 },
          evidence_he: "דרש הליך הכשרה מסודר לעסקה החדשה לפני שהוסיף אותה לתחזית הרבעון.",
          criteriaSignals: { diagnosis_before_action: 4, financial_awareness: 2 },
        },
        {
          key: "escalate_discount_to_vp",
          label_he: "העלאת בקשת ההנחה לאישור סמנכ\"ל המכירות",
          keywords_he: ["לעדכן את הסמנכ\"ל", "לבקש אישור להנחה", "להסלים את הבקשה למעלה"],
          deltas: {},
          evidence_he: "העלה את בקשת ההנחה החריגה לאישור סמנכ\"ל המכירות לפני מתן מענה ללקוח.",
          criteriaSignals: { communication: 4, financial_awareness: 3 },
        },
        {
          key: "count_new_deal_in_forecast_as_is",
          label_he: "שילוב העסקה החדשה בתחזית כפי שהיא",
          keywords_he: ["להכניס לתחזית כבר עכשיו", "לספור את העסקה ביעד", "לדווח על העסקה כסגורה כמעט"],
          deltas: { pipeline_coverage: 15, quota_attainment: 4 },
          evidence_he: "שילב את העסקה החדשה בתחזית הרבעון למרות שלא עברה הליך הכשרה.",
          criteriaSignals: { financial_awareness: 1, realism: 1, diagnosis_before_action: 2 },
        },
      ],
    },
    {
      index: 2,
      situation_he:
        "הלקוח עדיין ממתין לתשובה סופית, ונציג המכירות שאחראי על העסקה החדשה מבקש הכוונה לגבי איך להתקדם מולה.",
      event_he:
        "עדכון חדש\n\nהלקוח המרכזי הודיע שהוא מוכן לחתום להארכה, אך רק אם ההנחה תחול גם על החידוש הבא בעוד שנה. במקביל, התברר שלליד החדש אין עדיין תקציב מאושר, אבל יש תמיכה חזקה מצד משתמש בכיר אצל הלקוח הפוטנציאלי.",
      constraints_he: ["בקשה להנחה רב-שנתית", "אין עדיין תקציב מאושר לעסקה החדשה"],
      availableIntel: [
        { label_he: "בדיקת רווחיות בפועל של הלקוח לאורך שלוש שנים", cost: 2, accuracy: 90 },
        { label_he: "מודיעין תחרותי על ההצעה שהלקוח קיבל", cost: 3, accuracy: 60 },
        { label_he: "סקירת שלב ההכשרה האמיתי של העסקה החדשה", cost: 1, accuracy: 85 },
      ],
      decisionPrompt_he: "מה עכשיו?",
      options: [
        {
          key: "negotiate_scope_instead_of_price",
          label_he: "משא ומתן על היקף ההתקשרות במקום על המחיר",
          keywords_he: ["להציע הרחבת היקף", "לשנות את התנאים ולא רק מחיר", "משא ומתן על היקף"],
          deltas: { customer_relationship: 3, discount_given: 5 },
          evidence_he: "הוביל משא ומתן על היקף ההתקשרות במקום להיכנע ישירות לדרישת המחיר.",
          criteriaSignals: { realism: 4, communication: 3 },
          nextEvent_he:
            "עדכון חדש\n\nהלקוח הסכים להרחיב את היקף השימוש בתמורה להנחה מתונה יותר, ולא דרש הנחה רב-שנתית. הצוות יכול כעת להתמקד בליד החדש.",
        },
        {
          key: "accept_multi_year_discount",
          label_he: "אישור ההנחה הרב-שנתית כפי שהתבקשה",
          keywords_he: ["לאשר הנחה רב שנתית", "להסכים לתנאי הלקוח", "לחתום על ההארכה כמבוקש"],
          deltas: { discount_given: 15, quota_attainment: 6, customer_relationship: 2 },
          evidence_he: "אישר הנחה רב-שנתית כפי שהלקוח דרש, ללא בחינת חלופות.",
          criteriaSignals: { financial_awareness: 1, prioritization: 1, realism: 2 },
        },
        {
          key: "identify_economic_buyer_new_deal",
          label_he: "איתור בעל התקציב אצל הליד החדש",
          keywords_he: ["למצוא את בעל התקציב", "לזהות מקבל החלטה כספית", "לבדוק מי מאשר תקציב"],
          deltas: { pipeline_coverage: 10 },
          evidence_he: "פעל לזהות את בעל התקציב אצל הליד החדש לפני קידום נוסף של העסקה.",
          criteriaSignals: { diagnosis_before_action: 4, information_acquisition: 3 },
        },
        {
          key: "walk_away_from_discount_demand",
          label_he: "סירוב לדרישת ההנחה הרב-שנתית",
          keywords_he: ["לסרב להנחה", "לא להיכנע לדרישה", "לעמוד על המחיר"],
          deltas: { customer_relationship: -4, quota_attainment: -3 },
          evidence_he: "סירב לחלוטין לדרישת ההנחה הרב-שנתית מבלי להציע חלופה.",
          criteriaSignals: { knowing_when_to_stop: 2, prioritization: 2, financial_awareness: 3 },
        },
      ],
    },
    {
      index: 3,
      situation_he:
        "הצוות עובד בעומס גבוה לקראת סגירת הרבעון. נציג מכירות ותיק, שמנהל את מרבית קשרי הלקוחות המרכזיים, מדווח על עייפות, ובמקביל יש עוד עסקאות פתוחות שדורשות תשומת לב.",
      event_he: "עדכון חדש\n\nהנציג הוותיק מבקש מכם לחלק מחדש חלק מתיק הלקוחות שלו, ומזהיר שהוא היחיד שמכיר את ההיסטוריה המלאה של כמה מהחשבונות הגדולים.",
      constraints_he: ["צוות מצומצם בשיא העומס", "ידע קריטי מרוכז אצל נציג בודד"],
      decisionPrompt_he: "איך תנהלו את הצוות בשלב הזה?",
      options: [
        {
          key: "redistribute_account_load",
          label_he: "חלוקה מחדש של תיק הלקוחות בצוות",
          keywords_he: ["לחלק מחדש לקוחות", "לפזר תיק לקוחות", "לאזן עומס בין נציגים"],
          deltas: { customer_relationship: 1 },
          evidence_he: "חילק מחדש חלק מתיק הלקוחות בצוות לאחר שזוהו סימני עומס יתר.",
          criteriaSignals: { workload_management: 4, communication: 2 },
        },
        {
          key: "document_key_account_knowledge",
          label_he: "תיעוד ידע קריטי על החשבונות הגדולים",
          keywords_he: ["לתעד ידע על לקוחות", "תיעוד היסטוריית חשבון", "גיבוי ידע על לקוח מרכזי"],
          deltas: {},
          evidence_he: "דאג לתעד את ההיסטוריה הקריטית של החשבונות הגדולים שהייתה מרוכזת אצל נציג בודד.",
          criteriaSignals: { knowledge_protection: 5 },
        },
        {
          key: "bring_temp_sales_support",
          label_he: "הבאת תגבור זמני לצוות המכירות",
          keywords_he: ["תגבור זמני לצוות", "נציג נוסף זמני", "עזרה חיצונית זמנית"],
          deltas: { discount_given: 2 },
          evidence_he: "הביא תגבור זמני לצוות כדי להקל על העומס לקראת סוף הרבעון.",
          criteriaSignals: { workload_management: 3, financial_awareness: 1 },
        },
        {
          key: "push_through_as_is_sales",
          label_he: "המשך לפי החלוקה הקיימת ללא שינוי",
          keywords_he: ["להמשיך כרגיל", "לא לשנות חלוקת עבודה", "להתקדם כמתוכנן"],
          deltas: { customer_relationship: -2 },
          evidence_he: "בחר להמשיך לפי חלוקת העבודה הקיימת ללא התאמה לעומס שדווח.",
          criteriaSignals: { realism: 2, workload_management: 1 },
        },
      ],
    },
    {
      index: 4,
      situation_he:
        "אתם מתקרבים לסגירת הרבעון. רוב ההחלטות המרכזיות כבר התקבלו, ונותר שלב אחרון לפני סיכום התוצאות.",
      event_he: "עדכון חדש\n\nסמנכ\"ל המכירות מבקש עדכון סטטוס סופי על הלקוח המרכזי ועל התחזית לרבעון, לפני ישיבת ההנהלה.",
      decisionPrompt_he: "איך תסכמו את הרבעון?",
      options: [
        {
          key: "transparent_forecast_summary",
          label_he: "עדכון שקוף על התחזית והסיכונים שנותרו",
          keywords_he: ["עדכון שקוף", "לדווח על סיכונים בתחזית", "דיווח מלא לסמנכ\"ל"],
          deltas: { customer_relationship: 1 },
          evidence_he: "מסר עדכון שקוף שכלל גם את הסיכונים הנותרים בתחזית, לא רק את ההצלחות.",
          criteriaSignals: { communication: 5, realism: 3 },
        },
        {
          key: "inflate_forecast_optimistically",
          label_he: "הצגת תחזית אופטימית מעבר לנתונים",
          keywords_he: ["להציג תחזית מנופחת", "לדווח באופטימיות יתר", "להסתיר סיכונים בתחזית"],
          deltas: { quota_attainment: 3 },
          evidence_he: "הציג תחזית אופטימית מעבר למה שהנתונים תמכו בו.",
          criteriaSignals: { communication: 1, realism: 1 },
        },
        {
          key: "document_quarter_lessons",
          label_he: "תיעוד לקחים לקראת הרבעון הבא",
          keywords_he: ["תיעוד לקחים", "הפקת לקחים לרבעון הבא", "לתעד לפעם הבאה"],
          deltas: {},
          evidence_he: "תיעד לקחים מהרבעון לטובת תהליכי מכירה דומים בעתיד.",
          criteriaSignals: { diagnosis_before_action: 3, knowledge_protection: 3 },
        },
      ],
    },
  ],
};

const vpScenario: Scenario = {
  id: "sales-vp-1",
  domainKey: "sales",
  title_he: "משבר לקוח אסטרטגי לפני דיון דירקטוריון",
  roleLevel: "vp",
  difficulty: 4,
  summary_he:
    "הלקוח הגדול ביותר של החברה מאותת על אפשרות מעבר למתחרה ימים ספורים לפני ישיבת דירקטוריון, בעוד ארגון המכירות באמצע מעבר למודל תמחור חדש שמערער את השטח.",
  estimatedMinutes: [25, 35],
  kpis: [
    { key: "pipeline_coverage", label_he: "כיסוי צנרת מכירות", unit: "%", start: 240, min: 0, max: 400, higherIsBetter: true },
    { key: "discount_given", label_he: "היקף הנחה אסטרטגית", unit: "%", start: 0, min: 0, max: 40, higherIsBetter: false },
    { key: "customer_relationship", label_he: "חוזק קשר לקוחות מרכזיים", unit: "%", start: 80, min: 0, max: 100, higherIsBetter: true },
    { key: "quota_attainment", label_he: "עמידה ביעד השנתי", unit: "%", start: 91, min: 0, max: 150, higherIsBetter: true },
  ],
  turns: [
    {
      index: 1,
      situation_he:
        "אתם סמנכ\"ל המכירות. שלושה ימים לפני ישיבת דירקטוריון רבעונית, מנכ\"ל הלקוח האסטרטגי הגדול ביותר שלכם — כ-22% מההכנסה השנתית — מבקש שיחה דחופה ורומז שהוא בוחן הצעה מתחרה. במקביל, ארגון המכירות נמצא באמצע מעבר למודל תמחור חדש, ונציגי שטח כבר מדווחים על בלבול ואי-ודאות מול לקוחות קיימים.",
      constraints_he: ["חשיפת הכנסה גבוהה ללקוח יחיד", "מעבר תמחור באמצע יישום", "לוח זמנים קצר לפני הדירקטוריון"],
      availableIntel: [
        { label_he: "ניתוח שימוש ומגמת מעורבות של הלקוח", cost: 2, accuracy: 85 },
        { label_he: "משוב שטח על מודל התמחור החדש", cost: 2, accuracy: 75 },
        { label_he: "בדיקת מיצוב ותמחור מתחרים מובילים", cost: 4, accuracy: 80 },
      ],
      decisionPrompt_he: "מה הייתם עושים עכשיו?",
      options: [
        {
          key: "commission_usage_trend_analysis",
          label_he: "הזמנת ניתוח מיידי של מגמת השימוש והמעורבות של הלקוח",
          keywords_he: ["ניתוח מגמת שימוש", "לבדוק מעורבות לקוח", "לבחון סימני נטישה"],
          deltas: {},
          evidence_he: "הזמין ניתוח מיידי של מגמת השימוש והמעורבות של הלקוח לפני קביעת עמדה.",
          criteriaSignals: { diagnosis_before_action: 5, information_acquisition: 4 },
          nextEvent_he:
            "עדכון חדש\n\nהניתוח מגלה ירידה הדרגתית בשימוש בשלושת החודשים האחרונים אצל אחת מיחידות הלקוח, אך צמיחה ביחידה אחרת. התמונה מורכבת יותר מאיום נטישה גורף.",
        },
        {
          key: "offer_preemptive_retention_discount",
          label_he: "הצעת הנחת שימור מקדימה לפני השיחה",
          keywords_he: ["הנחת שימור מקדימה", "להציע הנחה לפני שמבקשים", "לפתות לפני השיחה"],
          deltas: { discount_given: 18, customer_relationship: 2 },
          evidence_he: "הציע הנחת שימור משמעותית עוד לפני שהתקיימה שיחה עם הלקוח לבירור הסיבה האמיתית.",
          criteriaSignals: { diagnosis_before_action: 1, information_acquisition: 1, financial_awareness: 1 },
        },
        {
          key: "brief_board_early_sales",
          label_he: "תדרוך מוקדם ושקוף לדירקטוריון על הסיכון",
          keywords_he: ["לעדכן דירקטוריון מראש", "תדרוך מוקדם על סיכון לקוח", "שקיפות כלפי הדירקטוריון"],
          deltas: { customer_relationship: 1 },
          evidence_he: "בחר לתדרך את הדירקטוריון מוקדם ובאופן שקוף על סיכון האובדן, לפני שהתמונה הייתה מלאה.",
          criteriaSignals: { communication: 5, knowing_when_to_stop: 3 },
        },
        {
          key: "delay_pricing_rollout",
          label_he: "עצירה זמנית של השקת מודל התמחור החדש",
          keywords_he: ["לעצור את מעבר התמחור", "להקפיא את השינוי", "לדחות את ההשקה"],
          deltas: { pipeline_coverage: -5 },
          evidence_he: "עצר זמנית את השקת מודל התמחור החדש עד להבנת השפעתו על השטח.",
          criteriaSignals: { knowing_when_to_stop: 3, realism: 2 },
        },
      ],
    },
    {
      index: 2,
      situation_he:
        "התמונה מתבהרת חלקית. הלקוח האסטרטגי מבקש פגישה אישית עם המנכ\"ל שלכם, ובמקביל כמה מנציגי המכירות הבכירים מאיימים לעכב עסקאות בגלל אי-הבהירות במודל התמחור החדש.",
      event_he:
        "עדכון חדש\n\nהלקוח מבהיר שהוא אכן קיבל הצעת מחיר ממתחרה, נמוכה ב-15%, ומבקש תגובה תוך שבוע. במקביל, שלושה נציגי מכירות בכירים מבקשים הבהרה דחופה על מודל התמחור לפני שהם ממשיכים לסגור עסקאות.",
      constraints_he: ["לחץ להתחייבות מחיר מול לקוח אסטרטגי", "אי-ודאות בשטח סביב תמחור"],
      availableIntel: [
        { label_he: "בדיקת סיבת העזיבה האמיתית מול אנשי קשר בלקוח", cost: 3, accuracy: 70 },
        { label_he: "ניתוח השפעת מודל התמחור החדש על צנרת המכירות", cost: 2, accuracy: 85 },
        { label_he: "הערכת סיכון עזיבה של נציגי המכירות הבכירים", cost: 2, accuracy: 65 },
      ],
      decisionPrompt_he: "מה הייתם עושים עכשיו?",
      options: [
        {
          key: "conditional_value_based_response",
          label_he: "תגובה מותנית המבוססת על ערך ולא רק מחיר",
          keywords_he: ["לתקשר ערך ולא רק מחיר", "תגובה מותנית ללקוח", "להציג ערך מוסף"],
          deltas: { customer_relationship: 3, discount_given: 6 },
          evidence_he: "הגיב ללקוח בהתמקדות בערך המוסף ובתנאים מותנים, במקום להיכנע מיידית למחיר המתחרה.",
          criteriaSignals: { communication: 4, realism: 4 },
        },
        {
          key: "match_competitor_price_unconditionally",
          label_he: "התאמת מחיר המתחרה באופן מלא וללא תנאי",
          keywords_he: ["להשוות מחיר מתחרה", "לתת הנחה זהה למתחרה", "להתחייב למחיר ללא תנאי"],
          deltas: { discount_given: 15, quota_attainment: -2 },
          evidence_he: "התאים את מחיר המתחרה באופן מלא וללא תנאי, ללא בחינת חלופות.",
          criteriaSignals: { realism: 1, communication: 2, diagnosis_before_action: 1 },
        },
        {
          key: "clarify_pricing_model_to_field",
          label_he: "מסירת הבהרה מיידית ומובנית לנציגי השטח",
          keywords_he: ["להבהיר מודל תמחור לצוות", "תדרוך שטח דחוף", "לענות לנציגים על התמחור"],
          deltas: { pipeline_coverage: 8 },
          evidence_he: "מסר הבהרה מיידית ומובנית לנציגי השטח לגבי מודל התמחור החדש, לפני שהעסקאות התעכבו נוסף.",
          criteriaSignals: { communication: 4, workload_management: 2 },
        },
        {
          key: "escalate_to_ceo_meeting_unprepared",
          label_he: "העברת הפגישה למנכ\"ל ללא הכנה משותפת",
          keywords_he: ["להעביר למנכ\"ל בלי הכנה", "לתת למנכ\"ל להוביל לבד", "פגישה ללא תיאום מראש"],
          deltas: { customer_relationship: -3 },
          evidence_he: "העביר את הפגישה עם הלקוח למנכ\"ל מבלי לתאם עמו מראש עמדה ונתונים.",
          criteriaSignals: { communication: 1, prioritization: 2, diagnosis_before_action: 2 },
        },
      ],
    },
    {
      index: 3,
      situation_he:
        "צוות המכירות הבכיר עובד תחת לחץ ממושך בין משבר הלקוח לבין מעבר התמחור. אחד ממנהלי האזורים המובילים מתריע כי חלק מההחלטות מגיעות ללא הקשר מספק, והצוות מתקשה לתעדף בין הלקוח האסטרטגי לשאר הצנרת.",
      event_he: "עדכון חדש\n\nמנהל אזור בכיר מבקש שיחה דחופה על אופן העברת ההחלטות וההקשר הנלווה אליהן, ומזהיר מפני שחיקה בצוות.",
      constraints_he: ["ריבוי בעלי עניין בכירים", "לחץ זמן מתמשך", "עומס גבוה על מנהלי אזורים"],
      decisionPrompt_he: "איך תתמודדו עם הפער בתקשורת ובעומס?",
      options: [
        {
          key: "structured_context_briefing_sales",
          label_he: "מסירת תדרוך מובנה עם הקשר מלא למנהלי האזורים",
          keywords_he: ["תדרוך מובנה לצוות", "להסביר את ההקשר המלא", "לשתף רקע להחלטות"],
          deltas: { customer_relationship: 1 },
          evidence_he: "מסר תדרוך מובנה שכלל את ההקשר המלא מאחורי ההחלטות, לא רק את ההוראות עצמן.",
          criteriaSignals: { communication: 5, workload_management: 2 },
        },
        {
          key: "delegate_regional_pricing_authority",
          label_he: "האצלת סמכות החלטה מקומית במסגרת מודל התמחור",
          keywords_he: ["להאציל סמכות לאזור", "לתת אוטונומיה למנהל אזור", "האצלה בתחום מוגדר"],
          deltas: { pipeline_coverage: 6 },
          evidence_he: "האציל סמכות החלטה מקומית למנהלי האזורים בתחומים מוגדרים במסגרת מודל התמחור החדש.",
          criteriaSignals: { workload_management: 4, prioritization: 2 },
        },
        {
          key: "keep_all_pricing_decisions_centralized",
          label_he: "שמירת כל החלטות התמחור במרכז ללא האצלה",
          keywords_he: ["לרכז החלטות תמחור", "לא להאציל סמכות", "כל ההחלטות דרכי"],
          deltas: { customer_relationship: -1 },
          evidence_he: "בחר לשמור את כל החלטות התמחור במרכז, ללא האצלה למנהלי האזורים.",
          criteriaSignals: { workload_management: 1, knowledge_protection: 1, communication: 2 },
        },
        {
          key: "document_decision_rationale_sales",
          label_he: "תיעוד שיטתי של הרציונל מאחורי החלטות המפתח",
          keywords_he: ["לתעד רציונל החלטות", "תיעוד החלטות תמחור", "לשמור הקשר בכתב"],
          deltas: {},
          evidence_he: "התחיל בתיעוד שיטתי של הרציונל מאחורי החלטות המפתח בתקופת המעבר.",
          criteriaSignals: { knowledge_protection: 4, communication: 2 },
        },
      ],
    },
    {
      index: 4,
      situation_he:
        "המשבר מתקרב לסיומו. הלקוח האסטרטגי טרם החליט סופית, ומודל התמחור החדש מיושם בהצלחה חלקית. הדירקטוריון ממתין לסיכום לפני קבלת ההחלטות הבאות.",
      event_he: "עדכון חדש\n\nיו\"ר הדירקטוריון מבקש מכם לסכם את מצב הלקוח האסטרטגי ואת השלכות מעבר התמחור לרבעון הבא בפגישה אחת.",
      decisionPrompt_he: "איך תבנו את הסיכום לדירקטוריון?",
      options: [
        {
          key: "full_transparency_with_forward_plan_sales",
          label_he: "סיכום שקוף הכולל תוכנית קדימה מוגדרת",
          keywords_he: ["סיכום שקוף", "תוכנית קדימה", "מה נלמד ומה הצעד הבא"],
          deltas: { customer_relationship: 2 },
          evidence_he: "בנה סיכום שקוף לדירקטוריון שכלל גם תוכנית פעולה קדימה, לא רק דיווח על מה שקרה.",
          criteriaSignals: { communication: 5, realism: 4 },
        },
        {
          key: "minimize_visible_risk_sales",
          label_he: "הצגת הסיכון בלקוח כמינימלי ככל האפשר",
          keywords_he: ["להציג כקטן", "למזער את הדיווח", "לא להדגיש את הסיכון"],
          deltas: { customer_relationship: -2 },
          evidence_he: "בחר להציג את הסיכון באובדן הלקוח כמינימלי מול הדירקטוריון, מעבר למה שהנתונים תמכו בו.",
          criteriaSignals: { communication: 1, realism: 1 },
        },
        {
          key: "propose_strategic_account_program",
          label_he: "הצעת תוכנית מובנית לניהול לקוחות אסטרטגיים",
          keywords_he: ["תוכנית לקוחות אסטרטגיים", "לשנות מדיניות ניהול חשבונות מפתח", "מבנה חדש ללקוחות גדולים"],
          deltas: { discount_given: -2, pipeline_coverage: 5 },
          evidence_he: "הציע תוכנית מובנית לניהול לקוחות אסטרטגיים כדי להפחית חשיפה עתידית לתלות בלקוח יחיד.",
          criteriaSignals: { diagnosis_before_action: 4, realism: 3 },
        },
      ],
    },
  ],
};

const scenarios: Scenario[] = [managerScenario, vpScenario];
export default scenarios;
