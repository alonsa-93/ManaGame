import type { Scenario } from "@/lib/scenario-schema";

/**
 * Reference implementation for scenario content authoring. Every other
 * domain file (content/scenarios/<domain>.ts) follows this exact shape:
 * a KPI set (max 4, per Master Spec §11), 4 turns, and a canonical action
 * vocabulary per turn with keyword hints, deltas, evidence text and
 * criteria signals (from the fixed CRITERIA list in lib/scenario-schema.ts).
 */

const kpis: Scenario["kpis"] = [
  { key: "schedule", label_he: "לוח זמנים", unit: "יום", start: 0, min: -12, max: 12, higherIsBetter: true },
  { key: "cash", label_he: "תקציב חירום", unit: "₪ אלף", start: 40, min: 0, max: 80, higherIsBetter: true },
  { key: "quality", label_he: "איכות אספקה", unit: "%", start: 92, min: 40, max: 100, higherIsBetter: true },
  { key: "reputation", label_he: "אמון הלקוח", unit: "%", start: 78, min: 0, max: 100, higherIsBetter: true },
];

const managerScenario: Scenario = {
  id: "supply-chain-manager-1",
  domainKey: "supply-chain",
  title_he: "עיכוב אספקה מול לקוח מרכזי",
  roleLevel: "manager",
  difficulty: 2,
  summary_he: "לקוח מרכזי מבקש להקדים משלוח בעוד ספק מרכזי מדווח על עיכוב. תקציב חירום ומעט כוח אדם זמינים.",
  estimatedMinutes: [20, 30],
  kpis,
  turns: [
    {
      index: 1,
      situation_he:
        "אתם מנהלים יחידה עסקית הנדרשת לעמוד ביעד אספקה משמעותי. במהלך השבוע האחרון עלו מספר סימני אזהרה: זמני האספקה התארכו, העלות התפעולית עלתה והלקוח המרכזי ביקש להקדים את מועד המסירה. לרשותכם תקציב חירום מוגבל, מספר עובדים שניתן להקצות מחדש ומידע חלקי לגבי הספקים החלופיים.",
      constraints_he: ["תקציב חירום מוגבל", "מידע חלקי על ספקים חלופיים", "לוח הזמנים לחוץ"],
      availableIntel: [
        { label_he: "דוח ספק חלופי", cost: 1, accuracy: 85 },
        { label_he: "תחזית ביקוש", cost: 2, accuracy: 70 },
        { label_he: "בדיקת סיכון ספק", cost: 3, accuracy: 95 },
      ],
      decisionPrompt_he: "מה היית עושה עכשיו?",
      options: [
        {
          key: "check_alt_supplier",
          label_he: "בדיקת ספק חלופי",
          keywords_he: ["ספק חלופי", "לבדוק ספק אחר", "לבחון ספק נוסף"],
          deltas: { schedule: 1, cash: -2 },
          evidence_he: "בחן אפשרות לספק חלופי לפני שהתחייב סופית למהלך.",
          criteriaSignals: { information_acquisition: 4, diagnosis_before_action: 3 },
          nextEvent_he:
            "עדכון חדש\n\nהספק החלופי שבדקתם הודיע שהוא יכול לספק רק 60% מהכמות. במקביל, הלקוח מוכן לשלם יותר — אבל דורש התחייבות בתוך 24 שעות.",
        },
        {
          key: "reallocate_staff",
          label_he: "הקצאת עובדים לטיפול בבעיה",
          keywords_he: ["הקצאת עובדים", "להעביר עובדים", "הקצאה מחדש של כוח אדם"],
          deltas: { schedule: 2, quality: -2 },
          evidence_he: "הקצה מחדש כוח אדם כדי לצמצם את הפיגור בלוח הזמנים.",
          criteriaSignals: { prioritization: 3, workload_management: 3 },
        },
        {
          key: "defer_secondary_initiative",
          label_he: "דחיית יוזמה משנית",
          keywords_he: ["דחיית יוזמה", "להקפיא פרויקט", "לעצור פרויקט משני"],
          deltas: { cash: 2, schedule: 1 },
          evidence_he: "בחר להקפיא יוזמה משנית כדי לפנות משאבים למשימה הדחופה.",
          criteriaSignals: { prioritization: 4, knowing_when_to_stop: 3 },
        },
        {
          key: "notify_cfo",
          label_he: "עדכון מנהל הכספים",
          keywords_he: ["עדכון מנהל הכספים", "ליידע את סמנכ\"ל הכספים", "דיווח על חריגת תקציב"],
          deltas: {},
          evidence_he: "עדכן את מנהל הכספים לפני שהתחייב לשינוי בתקציב.",
          criteriaSignals: { communication: 4, financial_awareness: 3 },
        },
        {
          key: "expedite_shipping",
          label_he: "הזמנת שינוע מהיר בעלות גבוהה",
          keywords_he: ["שינוע מהיר", "משלוח אקספרס", "לשלם על הובלה מהירה"],
          deltas: { schedule: 3, cash: -4 },
          evidence_he: "בחר לשלם עבור שינוע מהיר כדי לעמוד בלוח הזמנים.",
          criteriaSignals: { realism: 3, financial_awareness: 2 },
        },
      ],
    },
    {
      index: 2,
      situation_he:
        "ההחלטה שלכם השפיעה על המצב. הלקוח עדיין ממתין לאישור סופי, וצוות הרכש זקוק להכוונה לגבי הצעד הבא.",
      event_he:
        "עדכון חדש\n\nספק מרכזי נוסף מדווח על עיכוב בלתי צפוי, וצוות הרכש מבקש הכוונה דחופה לגבי איך להמשיך.",
      constraints_he: ["חלון החלטה של 24 שעות", "מידע חלקי על יכולת הספק החלופי"],
      availableIntel: [
        { label_he: "אישור בכתב מהספק על מועד המשלוח הבא", cost: 2, accuracy: 85 },
        { label_he: "בדיקת מלאי חלופי אצל מפיץ משני", cost: 1, accuracy: 70 },
        { label_he: "הערכת עלות פיצוי ללקוח במקרה של איחור", cost: 2, accuracy: 80 },
      ],
      decisionPrompt_he: "מה עכשיו?",
      options: [
        {
          key: "accept_partial_shipment",
          label_he: "קבלת אספקה חלקית והתחייבות ללקוח",
          keywords_he: ["אספקה חלקית", "60 אחוז", "לקבל חלק מהכמות"],
          deltas: { schedule: 2, reputation: 2, quality: -3 },
          evidence_he: "בחר לקבל אספקה חלקית ולהתחייב ללקוח בתנאים החדשים.",
          criteriaSignals: { realism: 4, communication: 3 },
        },
        {
          key: "negotiate_customer_terms",
          label_he: "משא ומתן מול הלקוח על תנאים חדשים",
          keywords_he: ["משא ומתן עם הלקוח", "לעדכן את הלקוח", "לשנות תנאים מול הלקוח"],
          deltas: { reputation: 3, cash: 1 },
          evidence_he: "פתח משא ומתן מול הלקוח במקום להתחייב מיידית לתנאים המקוריים.",
          criteriaSignals: { communication: 4, realism: 3 },
        },
        {
          key: "split_order_multiple_suppliers",
          label_he: "פיצול ההזמנה בין מספר ספקים",
          keywords_he: ["פיצול הזמנה", "כמה ספקים", "לפזר את ההזמנה"],
          deltas: { schedule: 1, cash: -3, quality: 1 },
          evidence_he: "פיצל את ההזמנה בין מספר ספקים כדי להקטין את התלות באחד מהם.",
          criteriaSignals: { diagnosis_before_action: 4, prioritization: 3 },
        },
        {
          key: "escalate_to_leadership",
          label_he: "העלאת הנושא להנהלה הבכירה",
          keywords_he: ["להעלות להנהלה", "לעדכן הנהלה בכירה", "לבקש החלטה מלמעלה"],
          deltas: { reputation: 1 },
          evidence_he: "העלה את הסוגיה להנהלה הבכירה לפני קבלת החלטה בלתי הפיכה.",
          criteriaSignals: { communication: 3, knowing_when_to_stop: 3 },
        },
      ],
    },
    {
      index: 3,
      situation_he:
        "הצוות שלכם עובד בעומס גבוה כבר מספר ימים. חלק מהעובדים המרכזיים מסמנים עייפות, ובמקביל יש עדיין נושאים תפעוליים פתוחים.",
      event_he: "עדכון חדש\n\nראש צוות הרכש מבקש ממכם לחלק מחדש את העומס ומזהיר מפני שחיקה של אנשי מפתח.",
      constraints_he: ["צוות מצומצם", "לוח זמנים עדיין לחוץ"],
      decisionPrompt_he: "איך תנהלו את הצוות בשלב הזה?",
      options: [
        {
          key: "redistribute_workload",
          label_he: "חלוקה מחדש של העומס בצוות",
          keywords_he: ["לחלק מחדש עומס", "לפזר משימות", "לאזן עומס בצוות"],
          deltas: { quality: 2 },
          evidence_he: "חילק מחדש את העומס בצוות לאחר שזוהו סימני שחיקה.",
          criteriaSignals: { workload_management: 4, communication: 2 },
        },
        {
          key: "bring_temp_support",
          label_he: "הבאת תגבור זמני",
          keywords_he: ["תגבור זמני", "כוח אדם נוסף", "עובד זמני"],
          deltas: { cash: -2, quality: 1 },
          evidence_he: "הביא תגבור זמני כדי להקל על הצוות הקבוע.",
          criteriaSignals: { workload_management: 3, financial_awareness: 2 },
        },
        {
          key: "protect_key_person_knowledge",
          label_he: "תיעוד ידע קריטי מבעל התפקיד המרכזי",
          keywords_he: ["לתעד ידע", "תיעוד תהליך", "גיבוי ידע"],
          deltas: {},
          evidence_he: "דאג לתעד ידע קריטי שהיה מרוכז אצל איש צוות בודד.",
          criteriaSignals: { knowledge_protection: 5 },
        },
        {
          key: "push_through_as_is",
          label_he: "המשך לפי התוכנית הקיימת ללא שינוי",
          keywords_he: ["להמשיך כרגיל", "לא לשנות כלום", "להתקדם כמתוכנן"],
          deltas: { quality: -2 },
          evidence_he: "בחר להמשיך לפי התוכנית הקיימת ללא התאמה לעומס שדווח.",
          criteriaSignals: { realism: 2, workload_management: 1 },
        },
      ],
    },
    {
      index: 4,
      situation_he:
        "אתם מתקרבים למועד האספקה שהוסכם. רוב ההחלטות המרכזיות כבר התקבלו, ונותר שלב אחרון לפני סגירת האירוע.",
      event_he: "עדכון חדש\n\nהלקוח מבקש עדכון סטטוס סופי לפני מועד האספקה. ההנהלה הבכירה גם היא ממתינה לסיכום.",
      decisionPrompt_he: "איך תסכמו את האירוע?",
      options: [
        {
          key: "transparent_summary_to_all",
          label_he: "עדכון שקוף ללקוח ולהנהלה כאחד",
          keywords_he: ["עדכון שקוף", "לעדכן את כולם", "דיווח מלא"],
          deltas: { reputation: 3 },
          evidence_he: "מסר עדכון שקוף וזהה ללקוח ולהנהלה הבכירה.",
          criteriaSignals: { communication: 5, realism: 3 },
        },
        {
          key: "positive_spin_only",
          label_he: "התמקדות בהיבטים החיוביים בלבד",
          keywords_he: ["להציג בחיוב", "לא להזכיר בעיות", "עדכון אופטימי"],
          deltas: { reputation: -1 },
          evidence_he: "התמקד בהיבטים החיוביים של האירוע מול הלקוח וההנהלה.",
          criteriaSignals: { communication: 1, realism: 1 },
        },
        {
          key: "document_lessons_learned",
          label_he: "תיעוד לקחים לקראת המקרה הבא",
          keywords_he: ["תיעוד לקחים", "הפקת לקחים", "לתעד לפעם הבאה"],
          deltas: { quality: 1 },
          evidence_he: "תיעד לקחים מהאירוע לטובת תהליכים דומים בעתיד.",
          criteriaSignals: { diagnosis_before_action: 3, knowledge_protection: 3 },
        },
      ],
    },
  ],
};

const vpScenario: Scenario = {
  id: "supply-chain-vp-1",
  domainKey: "supply-chain",
  title_he: "משבר שרשרת אספקה רב-אתרי",
  roleLevel: "vp",
  difficulty: 4,
  summary_he:
    "עיכוב אצל ספק אסטרטגי משפיע בו-זמנית על שלושה קווי מוצר ושני אתרי ייצור, תחת לחץ מהדירקטוריון ולקוחות בין-לאומיים.",
  estimatedMinutes: [25, 35],
  kpis: [
    { key: "schedule", label_he: "לוח זמנים גלובלי", unit: "יום", start: 0, min: -20, max: 20, higherIsBetter: true },
    { key: "cash", label_he: "תקציב חירום", unit: "₪ מיליון", start: 6, min: 0, max: 12, higherIsBetter: true },
    { key: "quality", label_he: "עמידה בסטנדרט איכות", unit: "%", start: 96, min: 50, max: 100, higherIsBetter: true },
    { key: "reputation", label_he: "אמון לקוחות אסטרטגיים", unit: "%", start: 82, min: 0, max: 100, higherIsBetter: true },
  ],
  turns: [
    {
      index: 1,
      situation_he:
        "אתם אחראים על שרשרת האספקה הגלובלית. ספק אסטרטגי יחיד, האחראי לרכיב קריטי בשני קווי מוצר, מדווח על עיכוב מהותי בשל אירוע בבית המפעל שלו. שני אתרי הייצור שלכם תלויים ברכיב הזה, ולדירקטוריון יש כבר מודעות ראשונית לבעיה.",
      constraints_he: ["ספק יחיד קריטי (Single Point of Failure)", "מידע ראשוני בלבד מהספק", "רגישות תקשורתית מול הדירקטוריון"],
      availableIntel: [
        { label_he: "דוח מצב מהספק", cost: 1, accuracy: 60 },
        { label_he: "ניתוח חשיפה לפי קו מוצר", cost: 3, accuracy: 90 },
        { label_he: "בדיקת ספקים חלופיים גלובלית", cost: 5, accuracy: 80 },
      ],
      decisionPrompt_he: "מה הייתם עושים עכשיו?",
      options: [
        {
          key: "commission_exposure_analysis",
          label_he: "הזמנת ניתוח חשיפה מיידי לפי קו מוצר",
          keywords_he: ["ניתוח חשיפה", "מיפוי השפעה", "בדיקת קווי מוצר"],
          deltas: { cash: -1 },
          evidence_he: "הזמין ניתוח חשיפה מהיר לפי קו מוצר לפני קבלת החלטה רחבה.",
          criteriaSignals: { diagnosis_before_action: 5, information_acquisition: 4 },
        },
        {
          key: "activate_dual_sourcing",
          label_he: "הפעלת מסלול ספק משני קיים",
          keywords_he: ["ספק משני", "מקור אספקה נוסף", "dual sourcing"],
          deltas: { schedule: 3, cash: -3 },
          evidence_he: "הפעיל מסלול ספק משני שהוגדר מראש לתרחיש כזה.",
          criteriaSignals: { realism: 4, diagnosis_before_action: 3 },
          nextEvent_he:
            "עדכון חדש\n\nהספק המשני אישר זמינות, אך בתוספת עלות של 22% ובדרישה להתחייבות לשנה קדימה. הרכש מבקש את אישורכם לפני חתימה.",
        },
        {
          key: "brief_board_early",
          label_he: "תדרוך מוקדם ושקוף לדירקטוריון",
          keywords_he: ["לעדכן דירקטוריון", "תדרוך הנהלה", "שקיפות כלפי הדירקטוריון"],
          deltas: { reputation: 2 },
          evidence_he: "בחר לתדרך את הדירקטוריון מוקדם ובאופן שקוף, לפני שהתמונה הייתה מלאה.",
          criteriaSignals: { communication: 5, knowing_when_to_stop: 3 },
        },
        {
          key: "delay_decision_pending_data",
          label_he: "עיכוב ההחלטה עד לקבלת נתונים נוספים",
          keywords_he: ["להמתין למידע נוסף", "לא להחליט עדיין", "לחכות לנתונים"],
          deltas: { schedule: -2 },
          evidence_he: "בחר להמתין לנתונים נוספים לפני קבלת החלטה מחייבת.",
          criteriaSignals: { knowing_when_to_stop: 3, information_acquisition: 3 },
          nextEvent_he:
            "עדכון חדש\n\nבזמן שהמתנתם לנתונים, הספק הקצה את הקיבולת הפנויה שלו ללקוח אחר. הנתונים שביקשתם הגיעו — והם כבר מתארים מצב גרוע יותר מזה שעליו נשאלתם.",
        },
      ],
    },
    {
      index: 2,
      situation_he:
        "התמונה מתבהרת חלקית. אחד משני האתרים חשוף באופן חמור יותר מהאחר, ולקוח אסטרטגי בין-לאומי מבקש התחייבות בכתב לתאריך אספקה חדש.",
      event_he:
        "עדכון חדש\n\nהספק האסטרטגי מודיע כעת שהעיכוב צפוי להימשך שבועיים נוספים מעבר להערכה הראשונית, וגורם ל-40% מהיקף הרכיב הקריטי.",
      constraints_he: ["לחץ להתחייבות כתובה מול לקוח בין-לאומי", "אתר ייצור אחד חשוף משמעותית יותר"],
      availableIntel: [
        { label_he: "ניתוח חשיפה מפורט לכל אחד משני האתרים", cost: 3, accuracy: 90 },
        { label_he: "בדיקת ההיסטוריה החוזית מול הלקוח האסטרטגי", cost: 2, accuracy: 95 },
        { label_he: "סקר זמינות קיבולת אצל ספקים משניים", cost: 2, accuracy: 65 },
      ],
      decisionPrompt_he: "מה הייתם עושים עכשיו?",
      options: [
        {
          key: "prioritize_critical_site",
          label_he: "העדפת האתר הקריטי יותר בהקצאת הרכיב הזמין",
          keywords_he: ["להעדיף אתר אחד", "הקצאה לפי אתר קריטי", "לתעדף אתר"],
          deltas: { schedule: 2, quality: 1 },
          evidence_he: "העדיף את הקצאת הרכיב הזמין לאתר החשוף ביותר, במקום לחלק שווה בשווה.",
          criteriaSignals: { prioritization: 5, diagnosis_before_action: 3 },
        },
        {
          key: "conditional_commitment_to_client",
          label_he: "התחייבות מותנית ומפורשת ללקוח",
          keywords_he: ["התחייבות מותנית", "לתקשר סיכון ללקוח", "תאריך עם הסתייגות"],
          deltas: { reputation: 3 },
          evidence_he: "מסר ללקוח התחייבות מפורשת עם הסתייגות מפורשת לגבי הסיכון הנותר.",
          criteriaSignals: { communication: 5, realism: 4 },
          nextEvent_he:
            "עדכון חדש\n\nהלקוח קיבל את ההתחייבות המותנית, ומבקש נקודות בקרה שבועיות ואדם אחד מוגדר מולו. הצוות שלכם כבר עמוס.",
        },
        {
          key: "unconditional_commitment_to_client",
          label_he: "התחייבות מלאה וללא הסתייגות ללקוח",
          keywords_he: ["התחייבות מלאה", "לאשר תאריך סופי", "הבטחה ללא תנאי"],
          deltas: { reputation: -3, schedule: -1 },
          evidence_he: "התחייב ללקוח באופן מלא וללא הסתייגות, בטרם התבררה מלוא התמונה.",
          criteriaSignals: { realism: 1, communication: 2, diagnosis_before_action: 1 },
          nextEvent_he:
            "עדכון חדש\n\nהלקוח שלח את ההתחייבות שנתתם להנהלה שלו והפיץ אותה פנימית כתאריך מאושר. שני האתרים מדווחים שהתאריך הזה אינו בר-השגה בתנאים הנוכחיים.",
        },
        {
          key: "emergency_capacity_purchase",
          label_he: "רכישת קיבולת חירום בעלות גבוהה",
          keywords_he: ["רכישת קיבולת חירום", "לשלם פרמיה לספק", "לקנות קיבולת נוספת"],
          deltas: { schedule: 4, cash: -5 },
          evidence_he: "רכש קיבולת חירום בעלות גבוהה כדי לצמצם את הפער בלוח הזמנים.",
          criteriaSignals: { financial_awareness: 3, realism: 3 },
        },
      ],
    },
    {
      index: 3,
      situation_he:
        "צוותי הניהול בשני האתרים עובדים תחת לחץ ממושך. מנהל אתר אחד מתריע כי חלק מהחלטות ההסלמה מגיעות ללא הקשר מספק, והצוות מתקשה לתעדף.",
      event_he: "עדכון חדש\n\nמנהל אתר בכיר מבקש שיחה דחוחה על אופן העברת ההחלטות וההקשר הנלווה אליהן.",
      constraints_he: ["ריבוי בעלי עניין באתרים שונים", "לחץ זמן מתמשך"],
      decisionPrompt_he: "איך תתמודדו עם הפער בתקשורת?",
      options: [
        {
          key: "structured_context_briefing",
          label_he: "מסירת תדרוך מובנה עם הקשר מלא לצוותי האתרים",
          keywords_he: ["תדרוך מובנה", "להסביר את ההקשר", "לשתף רקע להחלטות"],
          deltas: { quality: 2 },
          evidence_he: "מסר תדרוך מובנה שכלל את ההקשר המלא מאחורי ההחלטות, לא רק את ההוראות עצמן.",
          criteriaSignals: { communication: 5, workload_management: 2 },
        },
        {
          key: "delegate_local_authority",
          label_he: "האצלת סמכות החלטה מקומית למנהלי האתרים",
          keywords_he: ["להאציל סמכות", "לתת אוטונומיה לאתר", "האצלה למנהל האתר"],
          deltas: { schedule: 1 },
          evidence_he: "האציל סמכות החלטה מקומית למנהלי האתרים בתחומים מוגדרים.",
          criteriaSignals: { workload_management: 4, prioritization: 2 },
        },
        {
          key: "keep_all_decisions_centralized",
          label_he: "שמירת כל ההחלטות במרכז ללא האצלה",
          keywords_he: ["לרכז החלטות", "לא להאציל", "כל ההחלטות דרכי"],
          deltas: { quality: -1 },
          evidence_he: "בחר לשמור את כל ההחלטות במרכז, ללא האצלה למנהלי האתרים.",
          criteriaSignals: { workload_management: 1, knowledge_protection: 1, communication: 2 },
          nextEvent_he:
            "עדכון חדש\n\nשני מנהלי האתרים ביקשו פגישה משותפת. אחד מהם ציין שהוא ממתין לאישורכם על שלוש החלטות תפעוליות, ובינתיים הקו עומד.",
        },
        {
          key: "document_decision_rationale",
          label_he: "תיעוד שיטתי של הרציונל מאחורי כל הסלמה",
          keywords_he: ["לתעד רציונל", "תיעוד החלטות", "לשמור הקשר בכתב"],
          deltas: {},
          evidence_he: "התחיל בתיעוד שיטתי של הרציונל מאחורי כל החלטת הסלמה.",
          criteriaSignals: { knowledge_protection: 4, communication: 2 },
        },
      ],
    },
    {
      index: 4,
      situation_he:
        "המשבר מתקרב לסיומו. חלק מהיעדים המקוריים לא יושגו במלואם, וחלקם כן. הדירקטוריון והלקוחות האסטרטגיים ממתינים לסיכום רב-רבעוני.",
      event_he: "עדכון חדש\n\nיו\"ר הדירקטוריון מבקש ממכם לסכם את האירוע ואת ההשלכות ל-Q הבא בפגישה אחת.",
      decisionPrompt_he: "איך תבנו את הסיכום לדירקטוריון וללקוחות?",
      options: [
        {
          key: "full_transparency_with_forward_plan",
          label_he: "סיכום שקוף הכולל תוכנית קדימה מוגדרת",
          keywords_he: ["סיכום שקוף", "תוכנית קדימה", "מה נלמד ומה הצעד הבא"],
          deltas: { reputation: 3 },
          evidence_he: "בנה סיכום שקוף לדירקטוריון שכלל גם תוכנית פעולה קדימה, לא רק דיווח על מה שקרה.",
          criteriaSignals: { communication: 5, realism: 4 },
        },
        {
          key: "minimize_visible_impact",
          label_he: "הצגת ההשפעה כמינימלית ככל האפשר",
          keywords_he: ["להציג כקטן", "למזער את הדיווח", "לא להדגיש את ההשפעה"],
          deltas: { reputation: -2 },
          evidence_he: "בחר להציג את ההשפעה כמינימלית מול הדירקטוריון, מעבר למה שהנתונים תמכו בו.",
          criteriaSignals: { communication: 1, realism: 1 },
        },
        {
          key: "propose_structural_change",
          label_he: "הצעת שינוי מבני במדיניות הספקים",
          keywords_he: ["שינוי מדיניות ספקים", "לשנות מדיניות רכש", "מבנה ספקים חדש"],
          deltas: { cash: -1 },
          evidence_he: "הציע שינוי מבני במדיניות הספקים כדי להפחית חשיפה עתידית לספק יחיד.",
          criteriaSignals: { diagnosis_before_action: 4, realism: 3 },
        },
      ],
    },
  ],
};

const scenarios: Scenario[] = [managerScenario, vpScenario];
export default scenarios;
