import type { Scenario } from "@/lib/scenario-schema";

/**
 * Domain content: semiconductors (ייצור מוליכים למחצה).
 * Follows the exact shape defined in content/scenarios/supply-chain.ts —
 * a KPI set (max 4, per Master Spec §11), 4 turns, and a canonical action
 * vocabulary per turn with keyword hints, deltas, evidence text and
 * criteria signals (from the fixed CRITERIA list in lib/scenario-schema.ts).
 */

const managerKpis: Scenario["kpis"] = [
  { key: "yield", label_he: "תשואת ייצור (Yield)", unit: "%", start: 91, min: 40, max: 100, higherIsBetter: true },
  { key: "schedule", label_he: "לוח זמנים לאספקת לקוחות", unit: "יום", start: 0, min: -15, max: 15, higherIsBetter: true },
  { key: "downtime_cost", label_he: "עלות השבתה מצטברת", unit: "₪ אלף", start: 0, min: 0, max: 600, higherIsBetter: false },
  { key: "customer_trust", label_he: "אמון לקוחות מרכזיים", unit: "%", start: 80, min: 0, max: 100, higherIsBetter: true },
];

const managerScenario: Scenario = {
  id: "semiconductors-manager-1",
  domainKey: "semiconductors",
  title_he: "ירידת תשואה בלתי צפויה בקו ייצור",
  roleLevel: "manager",
  difficulty: 3,
  summary_he:
    "מערכת הניטור בזמן אמת מזהה ירידת Yield חדה באחת מתחנות התהליך באמצע ריצת ייצור, וקיימת אי-ודאות לגבי הגורם. שלושה לקוחות ממתינים למשלוחים מחויבים השבוע.",
  estimatedMinutes: [20, 30],
  kpis: managerKpis,
  turns: [
    {
      index: 1,
      situation_he:
        "אתם מנהלים את תפעול המפעל (Fab Operations) עבור קו ייצור מתקדם. מערכת הניטור בזמן אמת מזהה מגמת ירידה בתחנת ליתוגרפיה-אכילה אחת מתוך שש: התשואה (Yield) ירדה מבסיס של 91% לכ-84% במהלך שלוש השעות האחרונות, על פני שני לוטים רצופים. שורש הבעיה אינו ברור — ייתכן סחיפת תהליך (process drift), אירוע זיהום חלקיקים, או תקלת כיול בחיישן. שלושה לקוחות ממתינים למשלוחים מחויבים השבוע, ובהם לקוח אסטרטגי עם סעיף קנס חוזי על איחור.",
      constraints_he: [
        "חלון זמן קצר לפני משלוחים מחויבים",
        "אי-ודאות לגבי שורש הבעיה (תהליך / זיהום / כיול)",
        "כל שעת השבתה עולה כסף רב",
      ],
      availableIntel: [
        { label_he: "דוח מגמת Yield בזמן אמת", cost: 1, accuracy: 90 },
        { label_he: "בדיקת מדגם במיקרוסקופ אלקטרונים (SEM)", cost: 2, accuracy: 95 },
        { label_he: "היסטוריית כיול תחנת התהליך", cost: 1, accuracy: 75 },
      ],
      decisionPrompt_he: "מה הייתם עושים עכשיו?",
      options: [
        {
          key: "halt_line_immediately",
          label_he: "עצירת הקו כולו באופן מיידי",
          keywords_he: ["לעצור את הקו", "השבתה מיידית", "לעצור ייצור עד לבירור"],
          deltas: { downtime_cost: 40, yield: 3, schedule: -2 },
          evidence_he: "עצר את הקו כולו באופן מיידי עד לבירור הגורם לירידת התשואה.",
          criteriaSignals: { diagnosis_before_action: 3, realism: 3 },
          nextEvent_he:
            "עדכון חדש\n\nצוות ההנדסה מזהה זיהום חלקיקים (particle contamination) בתחנת האכילה. הניקוי הראשוני הושלם, אך עולה חשד שגם לוט קודם, שכבר יצא לתהליך האריזה, נחשף לאותו זיהום.",
        },
        {
          key: "isolate_module_only",
          label_he: "בידוד התחנה החשודה בלבד והמשך שאר הקו",
          keywords_he: ["לבודד תחנה אחת", "לעצור רק חלק מהקו", "המשך שאר הקו"],
          deltas: { yield: 1, schedule: 1, downtime_cost: 15 },
          evidence_he: "בודד את התחנה החשודה בלבד, תוך המשך הפעלת שאר תחנות הקו.",
          criteriaSignals: { prioritization: 4, diagnosis_before_action: 2 },
        },
        {
          key: "pull_sample_for_sem",
          label_he: "שליחת מדגם לבדיקת SEM לפני החלטה",
          keywords_he: ["בדיקת SEM", "מדגם למיקרוסקופ אלקטרונים", "לבדוק לפני שמחליטים"],
          deltas: { schedule: -1 },
          evidence_he: "שלח מדגם לבדיקת SEM כדי לאבחן את הגורם לפני קבלת החלטה מחייבת.",
          criteriaSignals: { information_acquisition: 5, diagnosis_before_action: 4 },
          nextEvent_he:
            "עדכון חדש\n\nתוצאות ה-SEM מצביעות על פגמי משטח מיקרוסקופיים, אך טרם ברור אם הם משפיעים על אמינות הרכיב לטווח ארוך. נדרשת הכרעה האם לעצור את הקו לבירור נוסף.",
        },
        {
          key: "continue_monitoring",
          label_he: "המשך ייצור תוך ניטור צמוד",
          keywords_he: ["להמשיך ולנטר", "לא לעצור, לנטר מקרוב", "המשך ייצור עם מעקב"],
          deltas: { yield: -4, schedule: 2 },
          evidence_he: "בחר להמשיך בייצור תוך ניטור צמוד של מגמת התשואה, במקום לעצור מיידית.",
          criteriaSignals: { realism: 2, knowing_when_to_stop: 2, diagnosis_before_action: 2 },
        },
        {
          key: "notify_customers_proactively",
          label_he: "עדכון מיידי ויזום ללקוחות",
          keywords_he: ["לעדכן לקוחות מיד", "יידוע יזום", "להתריע ללקוח מראש"],
          deltas: { customer_trust: 2 },
          evidence_he: "עדכן את הלקוחות המרכזיים באופן יזום, עוד לפני שהתמונה הייתה מלאה.",
          criteriaSignals: { communication: 4, knowing_when_to_stop: 3 },
        },
      ],
    },
    {
      index: 2,
      situation_he:
        "בירור ראשוני מתחיל להתבהר. יש חשד ממשי לזיהום חלקיקים בתחנת האכילה, וקיימת שאלה פתוחה לגבי לוט קודם שכבר יצא לתהליך האריזה. צוות הרכש והלוגיסטיקה ממתין להכוונה לגבי המשך העבודה מול הלקוחות.",
      event_he:
        "עדכון חדש\n\nמהנדס האיכות מדווח שהניקוי הראשוני של תחנת האכילה הושלם, אך אין עדיין אישור סופי שהגורם לזיהום חוסל לחלוטין. במקביל, לקוח אסטרטגי מבקש אישור בכתב שהמשלוח הקרוב עומד בסטנדרט.",
      constraints_he: ["חלון החלטה של פחות מ-24 שעות", "אין עדיין אישור סופי לניקוי המלא"],
      availableIntel: [
        { label_he: "בדיקת SEM על דגימות מהלוט הקודם", cost: 3, accuracy: 90 },
        { label_he: "נתוני ניטור חלקיקים מתחנת האכילה בשבוע האחרון", cost: 2, accuracy: 85 },
        { label_he: "מיפוי הלקוחות שקיבלו רכיבים מאותו לוט", cost: 1, accuracy: 95 },
      ],
      decisionPrompt_he: "מה עכשיו?",
      options: [
        {
          key: "quarantine_shipped_lot",
          label_he: "הסגר מיידי ללוט שכבר יצא לאריזה",
          keywords_he: ["הסגר ללוט", "לעצור את הלוט שיצא", "quarantine ללוט"],
          deltas: { customer_trust: -1, downtime_cost: 10 },
          evidence_he: "הורה על הסגר מיידי ללוט שכבר יצא לתהליך האריזה, כדי למנוע חשיפת לקוח לרכיב פגום פוטנציאלי.",
          criteriaSignals: { realism: 4, knowing_when_to_stop: 2 },
        },
        {
          key: "request_root_cause_analysis",
          label_he: "דרישת ניתוח שורש (RCA) מלא לפני חידוש מלא",
          keywords_he: ["ניתוח שורש", "RCA מלא", "לבדוק שורש הבעיה לפני חידוש"],
          deltas: { schedule: -2, downtime_cost: 20 },
          evidence_he: "דרש ניתוח שורש מלא לפני אישור חידוש ייצור מלא בקו.",
          criteriaSignals: { diagnosis_before_action: 5, knowing_when_to_stop: 3 },
        },
        {
          key: "communicate_revised_commitments",
          label_he: "עדכון מסודר ללקוחות עם לוחות זמנים מתוקנים",
          keywords_he: ["עדכון מסודר ללקוח", "לוח זמנים מתוקן", "לתקשר את המצב החדש"],
          deltas: { customer_trust: 3 },
          evidence_he: "מסר ללקוחות עדכון מסודר הכולל לוחות זמנים מתוקנים, מבוסס על הנתונים העדכניים.",
          criteriaSignals: { communication: 5, realism: 3 },
        },
        {
          key: "resume_full_production",
          label_he: "חידוש ייצור מלא על סמך ניקוי ראשוני בלבד",
          keywords_he: ["לחדש ייצור מלא", "לחזור לעבודה כרגיל", "לא להמתין לאישור סופי"],
          deltas: { yield: -3, downtime_cost: -10 },
          evidence_he: "חידש ייצור מלא על סמך ניקוי ראשוני בלבד, בטרם אושר שהגורם לזיהום חוסל לחלוטין.",
          criteriaSignals: { knowing_when_to_stop: 2, diagnosis_before_action: 2, prioritization: 1 },
        },
      ],
    },
    {
      index: 3,
      situation_he:
        "צוות הנדסת התהליך עובד במשמרות מוארכות כבר יומיים בחקירת אירוע הזיהום. חלק מהמהנדסים המרכזיים מסמנים עייפות, ועדיין נותרו סוגיות טכניות פתוחות בתחנת האכילה.",
      event_he: "עדכון חדש\n\nראש צוות הנדסת התהליך מבקש הנחיה לגבי חלוקת המשמרות הקרובות, ומזהיר מפני טעויות הנובעות מעייפות הצוות.",
      constraints_he: ["צוות הנדסה מצומצם", "עדיין נותרו סוגיות טכניות פתוחות"],
      decisionPrompt_he: "איך תנהלו את הצוות בשלב הזה?",
      options: [
        {
          key: "redistribute_shifts",
          label_he: "חלוקה מחדש של משמרות הצוות",
          keywords_he: ["לחלק מחדש משמרות", "לאזן עומס בין מהנדסים", "משמרות חדשות"],
          deltas: { downtime_cost: -5 },
          evidence_he: "חילק מחדש את משמרות הצוות לאחר שזוהו סימני עייפות אצל מהנדסים מרכזיים.",
          criteriaSignals: { workload_management: 4, communication: 2 },
        },
        {
          key: "bring_temp_engineers",
          label_he: "הבאת מהנדסי תהליך מתגברים ממפעל אחות",
          keywords_he: ["תגבור ממפעל אחר", "מהנדסים זמניים", "כוח אדם נוסף"],
          deltas: { downtime_cost: 15 },
          evidence_he: "הביא מהנדסי תהליך מתגברים ממפעל אחות כדי להקל על הצוות הקבוע.",
          criteriaSignals: { workload_management: 3, financial_awareness: 2 },
        },
        {
          key: "document_investigation_knowledge",
          label_he: "תיעוד שיטתי של ממצאי החקירה עד כה",
          keywords_he: ["לתעד ממצאים", "תיעוד חקירה", "גיבוי ידע על התקלה"],
          deltas: {},
          evidence_he: "דאג לתעד באופן שיטתי את ממצאי החקירה, כדי שהידע לא יישאר מרוכז אצל מהנדס בודד.",
          criteriaSignals: { knowledge_protection: 5 },
        },
        {
          key: "push_through_as_is",
          label_he: "המשך לפי לוח המשמרות הקיים ללא שינוי",
          keywords_he: ["להמשיך כרגיל", "לא לשנות משמרות", "להתקדם כמתוכנן"],
          deltas: { yield: -1 },
          evidence_he: "בחר להמשיך לפי לוח המשמרות הקיים ללא התאמה לעייפות שדווחה.",
          criteriaSignals: { realism: 2, workload_management: 1 },
        },
      ],
    },
    {
      index: 4,
      situation_he:
        "אתם מתקרבים למועד המשלוחים המחויבים. רוב ההחלטות המרכזיות כבר התקבלו, ונותר שלב אחרון של סיכום האירוע מול הלקוחות וההנהלה.",
      event_he: "עדכון חדש\n\nהלקוח האסטרטגי מבקש עדכון סטטוס סופי לפני מועד המשלוח. ההנהלה הבכירה גם היא ממתינה לסיכום האירוע.",
      decisionPrompt_he: "איך תסכמו את האירוע?",
      options: [
        {
          key: "transparent_summary_to_all",
          label_he: "עדכון שקוף ללקוח ולהנהלה כאחד",
          keywords_he: ["עדכון שקוף", "לעדכן את כולם", "דיווח מלא על האירוע"],
          deltas: { customer_trust: 3 },
          evidence_he: "מסר עדכון שקוף וזהה ללקוח ולהנהלה הבכירה, כולל הסבר לגבי שורש הבעיה.",
          criteriaSignals: { communication: 5, realism: 3 },
        },
        {
          key: "positive_spin_only",
          label_he: "התמקדות בהיבטים החיוביים בלבד",
          keywords_he: ["להציג בחיוב", "לא להזכיר את התקלה", "עדכון אופטימי בלבד"],
          deltas: { customer_trust: -1 },
          evidence_he: "התמקד בהיבטים החיוביים של האירוע מול הלקוח וההנהלה, מבלי לפרט את הממצאים המלאים.",
          criteriaSignals: { communication: 1, realism: 1 },
        },
        {
          key: "document_lessons_learned",
          label_he: "תיעוד לקחים לקראת מקרה דומה בעתיד",
          keywords_he: ["תיעוד לקחים", "הפקת לקחים", "לתעד לפעם הבאה"],
          deltas: { yield: 1 },
          evidence_he: "תיעד לקחים מהאירוע לטובת תהליכי ניטור ותגובה דומים בעתיד.",
          criteriaSignals: { diagnosis_before_action: 3, knowledge_protection: 3 },
        },
      ],
    },
  ],
};

const vpKpis: Scenario["kpis"] = [
  { key: "yield_rate", label_he: "תשואת ייצור גלובלית (Yield)", unit: "%", start: 88, min: 30, max: 100, higherIsBetter: true },
  { key: "line_downtime_days", label_he: "ימי השבתת קו מצטברים", unit: "יום", start: 0, min: 0, max: 60, higherIsBetter: false },
  { key: "revenue_exposure", label_he: "חשיפה כספית מצטברת", unit: "$ מיליון", start: 0, min: 0, max: 300, higherIsBetter: false },
  { key: "customer_trust", label_he: "אמון לקוחות אסטרטגיים גלובליים", unit: "%", start: 78, min: 0, max: 100, higherIsBetter: true },
];

const vpScenario: Scenario = {
  id: "semiconductors-vp-1",
  domainKey: "semiconductors",
  title_he: "השבתת קו רב-שבועית מול סיכון פגם מערכתי",
  roleLevel: "vp",
  difficulty: 5,
  summary_he:
    "נתוני אמינות מצביעים על סחיפה איטית בפרמטר חשמלי קריטי שעשויה להעיד על פגם מערכתי בתהליך ייצור המשמש מספר קווי מוצר, כולל רכיבים שכבר נשלחו ללקוחות. הנתונים אינם חד-משמעיים, וההחלטה נוגעת לחשיפה כספית עצומה, לקוחות אסטרטגיים ודירקטוריון לוחץ.",
  estimatedMinutes: [25, 35],
  kpis: vpKpis,
  turns: [
    {
      index: 1,
      situation_he:
        "אתם סמנכ\"ל התפעול, אחראים על רשת המפעלים הגלובלית. במהלך עשרת הימים האחרונים מזהה צוות האיכות סחיפה איטית בפרמטר אמינות חשמלי קריטי (Gate Oxide Reliability), במגמה שעדיין בגבולות הסביבה הסטטיסטית אך חורגת מהדפוס ההיסטורי. אם הסחיפה תתאשר כפגם מערכתי, היא עלולה להשפיע על תהליך ייצור (Process of Record) המשותף למספר קווי מוצר, כולל רכיבים שכבר נשלחו ללקוחות בששת השבועות האחרונים. השבתת הקו לבירור מלא מוערכת בעשרות מיליוני דולרים ליום, ולקוח אסטרטגי בתעשיית הרכב, עם דרישת Zero-Defect חוזית, ממתין לאישור משלוח. הדירקטוריון מודע לסוגיה, אך הנתונים טרם חד-משמעיים.",
      constraints_he: [
        "נתונים לא חד-משמעיים לגבי שורש הבעיה",
        "חשיפה כספית של עשרות מיליוני דולרים ליום השבתה",
        "לקוח אסטרטגי עם דרישת Zero-Defect חוזית",
        "לחץ דירקטוריון להחלטה מהירה",
      ],
      availableIntel: [
        { label_he: "ניתוח מגמת פרמטר אמינות (Reliability Trend)", cost: 2, accuracy: 80 },
        { label_he: "בדיקת מדגם מואצת (Accelerated Life Test) — תוצאות בעוד כ-5 ימים", cost: 4, accuracy: 95 },
        { label_he: "סקירת יומני שינויי תהליך של ששת השבועות האחרונים", cost: 3, accuracy: 70 },
      ],
      decisionPrompt_he: "מה הייתם עושים עכשיו?",
      options: [
        {
          key: "halt_entire_line_pending_investigation",
          label_he: "השבתת הקו כולו עד לסיום החקירה",
          keywords_he: ["להשבית את כל הקו", "עצירה מלאה עד לבירור", "לעצור הכל עד לוודאות"],
          deltas: { line_downtime_days: 10, revenue_exposure: 80, customer_trust: 1 },
          evidence_he: "בחר להשבית את הקו כולו עד לסיום החקירה, חרף החשיפה הכספית הגבוהה.",
          criteriaSignals: { realism: 3, knowing_when_to_stop: 2 },
          nextEvent_he:
            "עדכון חדש\n\nבדיקת האמינות המואצת הראשונית, שהוזמנה במקביל להשבתה, מצביעה על פגם ממשי בתת-אצווה מוגבלת בלבד — אך התוצאות המלאות והמוסמכות יתקבלו רק בעוד כארבעה ימים. הלקוח האסטרטגי בתעשיית הרכב דורש תשובה תוך 48 שעות.",
        },
        {
          key: "commission_accelerated_life_test_first",
          label_he: "הזמנת בדיקת אמינות מואצת לפני החלטה על השבתה",
          keywords_he: ["בדיקת אמינות מואצת", "accelerated life test", "לבדוק לפני שמחליטים על השבתה"],
          deltas: { revenue_exposure: 10 },
          evidence_he: "הזמין בדיקת אמינות מואצת ממוקדת לפני קבלת החלטה בלתי הפיכה על השבתת הקו.",
          criteriaSignals: { information_acquisition: 5, diagnosis_before_action: 5 },
        },
        {
          key: "partial_line_isolation",
          label_he: "בידוד תת-קבוצת התהליכים החשודה בלבד",
          keywords_he: ["בידוד חלקי של הקו", "לעצור רק תת-תהליך", "תת-קבוצה חשודה בלבד"],
          deltas: { line_downtime_days: 3, revenue_exposure: 25, yield_rate: 1 },
          evidence_he: "בודד רק את תת-קבוצת התהליכים החשודה, תוך המשך הפעלת שאר הקו.",
          criteriaSignals: { prioritization: 4, diagnosis_before_action: 3 },
        },
        {
          key: "brief_board_immediately",
          label_he: "תדרוך מיידי ושקוף לדירקטוריון על אי-הוודאות",
          keywords_he: ["לעדכן דירקטוריון מיד", "שקיפות מול הדירקטוריון", "תדרוך דחוף להנהלה"],
          deltas: { customer_trust: 1 },
          evidence_he: "תדרך את הדירקטוריון מיידית ובאופן שקוף על אי-הוודאות, לפני קבלת ההחלטה הסופית.",
          criteriaSignals: { communication: 5, knowing_when_to_stop: 3 },
        },
        {
          key: "continue_full_production_pending_data",
          label_he: "המשך ייצור מלא עד לקבלת תוצאות סופיות",
          keywords_he: ["להמשיך ייצור מלא", "לא לעצור עד שיש ודאות", "המשך כרגיל עד לנתונים"],
          deltas: { revenue_exposure: -5, yield_rate: -2 },
          evidence_he: "בחר להמשיך בייצור מלא עד לקבלת תוצאות סופיות, חרף אינדיקציות ראשוניות לסיכון.",
          criteriaSignals: { diagnosis_before_action: 1, realism: 1, knowing_when_to_stop: 1 },
        },
      ],
    },
    {
      index: 2,
      situation_he:
        "התמונה מתבהרת חלקית. נתוני הביניים מצביעים על סיכון ממשי אך מוגבל בהיקפו, וטרם ברור אם רכיבים שכבר נשלחו ללקוחות נחשפו לפגם. הלקוח האסטרטגי בתעשיית הרכב ממתין לתשובה מחייבת.",
      event_he:
        "עדכון חדש\n\nצוות האמינות מדווח שהפגם ככל הנראה מוגבל לתת-אצווה שיוצרה בחלון זמן מוגדר, אך אינו יכול לשלול לחלוטין חשיפה רחבה יותר ללא בדיקה נוספת. במקביל, צוות המשפט מזכיר שקיימות דרישות דיווח רגולטוריות במדינות מסוימות.",
      constraints_he: ["לחץ להתחייבות כתובה מול לקוח אסטרטגי", "היקף החשיפה בקרב רכיבים שכבר נשלחו טרם ברור"],
      availableIntel: [
        { label_he: "בדיקה מואצת של רכיבים שכבר נשלחו ללקוחות", cost: 3, accuracy: 85 },
        { label_he: "חוות דעת אמינות עצמאית על חומרת הפגם", cost: 3, accuracy: 75 },
        { label_he: "סקירת חובות הדיווח החוזיות ללקוח הרכב", cost: 1, accuracy: 95 },
      ],
      decisionPrompt_he: "מה הייתם עושים עכשיו?",
      options: [
        {
          key: "initiate_targeted_recall",
          label_he: "יזום נסיגת מוצרים ממוקדת ללוטים החשודים",
          keywords_he: ["נסיגת מוצרים ממוקדת", "recall ממוקד", "להחזיר רק את הלוטים החשודים"],
          deltas: { revenue_exposure: 30, customer_trust: 2 },
          evidence_he: "יזם נסיגת מוצרים ממוקדת ללוטים החשודים בלבד, בטרם התקבלה דרישה חיצונית לכך.",
          criteriaSignals: { realism: 5, diagnosis_before_action: 3 },
          nextEvent_he:
            "עדכון חדש\n\nהנסיגה הממוקדת אושרה בדירקטוריון, אך צוות המשפט מתריע כי היקפה עשוי לחייב דיווח רגולטורי פומבי במדינות מסוימות בתוך 72 שעות.",
        },
        {
          key: "issue_precautionary_customer_notice",
          label_he: "הודעה מקדימה ללקוחות אסטרטגיים על הסיכון הפוטנציאלי",
          keywords_he: ["הודעה מקדימה ללקוח", "יידוע מוקדם על סיכון", "עדכון זהיר ללקוח אסטרטגי"],
          deltas: { customer_trust: 3 },
          evidence_he: "מסר ללקוחות האסטרטגיים הודעה מקדימה על הסיכון הפוטנציאלי, לפני שהתמונה הייתה סופית.",
          criteriaSignals: { communication: 5, realism: 4 },
        },
        {
          key: "expand_investigation_scope",
          label_he: "הרחבת היקף החקירה לכל קווי הייצור הדומים",
          keywords_he: ["להרחיב את החקירה", "לבדוק קווים דומים", "חקירה רחבה יותר"],
          deltas: { revenue_exposure: 15, line_downtime_days: 2 },
          evidence_he: "הרחיב את היקף החקירה לכל קווי הייצור הדומים, במקום להסתפק בתת-האצווה שזוהתה.",
          criteriaSignals: { diagnosis_before_action: 4, information_acquisition: 3 },
        },
        {
          key: "wait_for_full_data_before_notifying",
          label_he: "המתנה לנתונים מלאים לפני יידוע הלקוחות",
          keywords_he: ["להמתין לנתונים מלאים", "לא לעדכן עדיין", "לחכות לתמונה סופית"],
          deltas: { customer_trust: -2 },
          evidence_he: "בחר להמתין לנתונים מלאים לפני יידוע הלקוחות, חרף הלחץ לתשובה מיידית.",
          criteriaSignals: { knowing_when_to_stop: 2, information_acquisition: 3 },
        },
      ],
    },
    {
      index: 3,
      situation_he:
        "המשבר נמשך כבר שבועיים. צוותי ההנדסה והאיכות בשני האתרים המעורבים עובדים שעות ארוכות, ומנהלת האתר הראשי מדווחת על עומס גובר. מהנדס התהליך הבכיר, בעל הידע המעמיק ביותר על היסטוריית התהליך, מהווה נקודת כשל יחידה מבחינת ידע.",
      event_he:
        "עדכון חדש\n\nמנהלת האתר הראשי מתריעה כי מהנדס התהליך הבכיר, שמחזיק בידע הקריטי ביותר על היסטוריית התהליך והחקירה, שוקל לצאת לחופשת מחלה בשל עומס — ללא תיעוד מסודר של הממצאים עד כה.",
      constraints_he: ["ריבוי בעלי עניין בין האתרים", "תלות בידע לא מתועד של איש מפתח יחיד"],
      decisionPrompt_he: "איך תתמודדו עם הפער בעומס ובידע הקריטי?",
      options: [
        {
          key: "mandate_knowledge_documentation",
          label_he: "חיוב תיעוד מיידי ומובנה של כלל הממצאים וההחלטות",
          keywords_he: ["לתעד מיד את הממצאים", "תיעוד מובנה של החקירה", "לגבות את הידע של המהנדס"],
          deltas: {},
          evidence_he: "חייב תיעוד מיידי ומובנה של כלל הממצאים וההחלטות, כדי שהידע לא יישאר תלוי באדם יחיד.",
          criteriaSignals: { knowledge_protection: 5 },
        },
        {
          key: "bring_in_external_reliability_experts",
          label_he: "הבאת מומחי אמינות חיצוניים לתגבור הצוות",
          keywords_he: ["מומחים חיצוניים", "תגבור צוות אמינות", "יועצי אמינות מבחוץ"],
          deltas: { revenue_exposure: 5 },
          evidence_he: "הביא מומחי אמינות חיצוניים כדי לתגבר את הצוות הפנימי העמוס.",
          criteriaSignals: { workload_management: 4, financial_awareness: 2 },
        },
        {
          key: "redistribute_leadership_across_sites",
          label_he: "חלוקה מחדש של אחריות ההובלה בין האתרים",
          keywords_he: ["לחלק אחריות בין אתרים", "לפזר הובלה", "לא להישען על אתר אחד בלבד"],
          deltas: {},
          evidence_he: "חילק מחדש את אחריות ההובלה בין האתרים, כדי לא להישען על צוות אחד בלבד תחת עומס מתמשך.",
          criteriaSignals: { workload_management: 4, communication: 2 },
        },
        {
          key: "push_key_engineer_to_continue",
          label_he: "בקשה מהמהנדס הבכיר להמשיך למרות העומס",
          keywords_he: ["לבקש מהמהנדס להמשיך", "לא לשחרר אותו כרגע", "להישאר תלויים במהנדס אחד"],
          deltas: { line_downtime_days: -1 },
          evidence_he: "ביקש מהמהנדס הבכיר להמשיך ולהוביל את החקירה למרות סימני העומס שדווחו.",
          criteriaSignals: { workload_management: 0, knowledge_protection: 1, realism: 2 },
        },
      ],
    },
    {
      index: 4,
      situation_he:
        "החקירה מתקרבת לסיומה. שורש הבעיה זוהה חלקית: חלק מקווי המוצר אושרו כנקיים, ואילו לגבי אחרים נותרה אי-ודאות שיורית. הדירקטוריון והלקוחות האסטרטגיים ממתינים להחלטה סופית על חזרה לייצור מלא ועל אופן התקשורת עם השוק.",
      event_he: "עדכון חדש\n\nיו\"ר הדירקטוריון קבע ישיבה דחופה לאישור סופי של תוכנית החזרה לייצור מלא ושל התקשורת עם הלקוחות והשוק.",
      decisionPrompt_he: "איך תבנו את ההחלטה הסופית והתקשורת סביבה?",
      options: [
        {
          key: "full_transparent_disclosure_with_plan",
          label_he: "גילוי שקוף ומלא הכולל תוכנית פעולה קדימה",
          keywords_he: ["גילוי שקוף מלא", "תוכנית קדימה מפורטת", "לדווח הכול כולל תוכנית"],
          deltas: { customer_trust: 3 },
          evidence_he: "בנה גילוי שקוף ומלא לדירקטוריון וללקוחות, שכלל גם תוכנית פעולה קדימה ולא רק דיווח על מה שקרה.",
          criteriaSignals: { communication: 5, realism: 4 },
        },
        {
          key: "phased_resumption_plan",
          label_he: "תוכנית חזרה הדרגתית לייצור מלא לפי רמת סיכון",
          keywords_he: ["חזרה הדרגתית", "לפי רמת סיכון", "לא לחזור לכולם בבת אחת"],
          deltas: { yield_rate: 2, line_downtime_days: -3 },
          evidence_he: "בנה תוכנית חזרה הדרגתית לייצור מלא, המבוססת על רמת הסיכון שנותרה בכל קו מוצר.",
          criteriaSignals: { diagnosis_before_action: 4, realism: 3 },
        },
        {
          key: "propose_process_control_overhaul",
          label_he: "הצעת שדרוג מערך בקרת התהליך למניעת הישנות",
          keywords_he: ["שדרוג בקרת תהליך", "מניעת הישנות", "שינוי מערך ניטור"],
          deltas: { revenue_exposure: 10 },
          evidence_he: "הציע שדרוג מערך בקרת התהליך והניטור, כדי להפחית סיכון להישנות אירוע דומה.",
          criteriaSignals: { diagnosis_before_action: 3, knowledge_protection: 2 },
        },
        {
          key: "minimize_disclosure_scope",
          label_he: "צמצום היקף הגילוי כלפי הדירקטוריון והלקוחות",
          keywords_he: ["לצמצם את הדיווח", "להציג כקטן ככל האפשר", "לא לפרט את מלוא ההיקף"],
          deltas: { customer_trust: -3 },
          evidence_he: "בחר לצמצם את היקף הגילוי כלפי הדירקטוריון והלקוחות, מעבר למה שהנתונים תמכו בו.",
          criteriaSignals: { communication: 1, realism: 1 },
        },
      ],
    },
  ],
};

const scenarios: Scenario[] = [managerScenario, vpScenario];
export default scenarios;
