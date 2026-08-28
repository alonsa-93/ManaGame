import type { Scenario } from "@/lib/scenario-schema";

/**
 * Finance & FP&A domain content. Follows the exact shape of
 * content/scenarios/supply-chain.ts (the reference implementation):
 * a KPI set (max 4, per Master Spec §11), ~4 turns, and a canonical action
 * vocabulary per turn with keyword hints, deltas, evidence text and
 * criteria signals (from the fixed CRITERIA list in lib/scenario-schema.ts).
 */

const kpis: Scenario["kpis"] = [
  { key: "cash_runway", label_he: "יתרת מזומנים (חודשי ריצה)", unit: "חודשים", start: 11, min: 0, max: 18, higherIsBetter: true },
  { key: "budget_variance", label_he: "סטיית תקציב מהתחזית", unit: "%", start: -4, min: -15, max: 10, higherIsBetter: true },
  { key: "forecast_accuracy", label_he: "דיוק התחזית הרבעונית", unit: "%", start: 82, min: 40, max: 100, higherIsBetter: true },
  { key: "stakeholder_confidence", label_he: "אמון בעלי העניין", unit: "%", start: 75, min: 0, max: 100, higherIsBetter: true },
];

const managerScenario: Scenario = {
  id: "finance-manager-1",
  domainKey: "finance",
  title_he: "סימן אזהרה תקציבי ברבעון",
  roleLevel: "manager",
  difficulty: 2,
  summary_he:
    "מנהל/ת כספים ביחידה עסקית מזהה סימן ראשוני לחריגה תקציבית קרוב לסגירת הרבעון, תחת מידע חלקי ולחץ ממחלקות שונות.",
  estimatedMinutes: [20, 30],
  kpis,
  turns: [
    {
      index: 1,
      situation_he:
        "אתם מנהלים את הכספים של יחידה עסקית. בבדיקת ביניים שגרתית זיהיתם סימן אזהרה ראשוני: ההוצאה בפועל חורגת מהתחזית שהוצגה בתחילת הרבעון, וקצב הגבייה מלקוחות מסוימים מואט. עד כה אין תמונה מלאה של מקור החריגה, ומספר מנהלי מחלקות כבר שואלים אם ייתכנו שינויים בתקציב שלהם.",
      constraints_he: ["מידע חלקי על מקור החריגה", "קרבה למועד סגירת הרבעון", "לחץ משאלות של מנהלי מחלקות"],
      availableIntel: [
        { label_he: "ניתוח סטיות לפי מחלקה", cost: 1, accuracy: 85 },
        { label_he: "תחזית גבייה מעודכנת", cost: 2, accuracy: 70 },
        { label_he: "בדיקת התחייבויות חוזיות פתוחות", cost: 3, accuracy: 90 },
      ],
      decisionPrompt_he: "מה היית עושה עכשיו?",
      options: [
        {
          key: "request_variance_analysis_by_department",
          label_he: "הזמנת ניתוח סטיות מפורט לפי מחלקה",
          keywords_he: ["ניתוח סטיות לפי מחלקה", "לבדוק מקור החריגה", "ניתוח תקציב מחלקתי"],
          deltas: { budget_variance: 1 },
          evidence_he: "ביקש ניתוח סטיות מפורט לפי מחלקה לפני נקיטת פעולה רוחבית.",
          criteriaSignals: { information_acquisition: 4, diagnosis_before_action: 4 },
          nextEvent_he:
            "עדכון חדש\n\nהניתוח מגלה שהחריגה מרוכזת בעיקר במחלקת השיווק, בשל התחייבויות חוזיות שנחתמו לפני תחילת הרבעון. מנהל השיווק מבקש לשוחח איתכם באופן דחוף.",
        },
        {
          key: "immediate_spend_freeze",
          label_he: "הקפאת הוצאות מיידית לכל המחלקות",
          keywords_he: ["הקפאת תקציב", "עצירת הוצאות לכולם", "freeze מיידי לכל המחלקות"],
          deltas: { cash_runway: 1, stakeholder_confidence: -2 },
          evidence_he: "הטיל הקפאת הוצאות גורפת על כלל המחלקות מבלי לבודד תחילה את מקור החריגה.",
          criteriaSignals: { diagnosis_before_action: 1, prioritization: 1, realism: 2 },
          nextEvent_he:
            "עדכון חדש\n\nההקפאה הגורפת עצרה גם פעילות שוטפת מול לקוחות. מספר מנהלי מחלקות פונים בבקשה דחופה לחריגים.",
        },
        {
          key: "notify_finance_leadership",
          label_he: "עדכון סמנכ\"ל הכספים על סימן האזהרה",
          keywords_he: ["לעדכן סמנכ\"ל כספים", "דיווח מוקדם להנהלה", "ליידע את ה-CFO"],
          deltas: { stakeholder_confidence: 2 },
          evidence_he: "עדכן את ההנהלה הבכירה על סימן האזהרה התקציבי מיד עם זיהויו.",
          criteriaSignals: { communication: 4, financial_awareness: 3 },
        },
        {
          key: "revise_forecast_conservatively",
          label_he: "עדכון התחזית הרבעונית לכיוון שמרני",
          keywords_he: ["תחזית שמרנית", "להוריד את התחזית", "לעדכן תחזית כלפי מטה"],
          deltas: { forecast_accuracy: 2, stakeholder_confidence: -1 },
          evidence_he: "עדכן את התחזית הרבעונית לכיוון שמרני יותר בהתבסס על הנתונים החלקיים שהיו זמינים.",
          criteriaSignals: { realism: 4, diagnosis_before_action: 2 },
        },
        {
          key: "defer_decision_wait_more_data",
          label_he: "המתנה לנתונים נוספים לפני החלטה",
          keywords_he: ["להמתין לנתונים נוספים", "לא להחליט עדיין", "לחכות לסגירת החודש"],
          deltas: { budget_variance: -1 },
          evidence_he: "בחר להמתין לנתונים נוספים לפני קבלת החלטה מחייבת.",
          criteriaSignals: { knowing_when_to_stop: 3, information_acquisition: 3 },
        },
      ],
    },
    {
      index: 2,
      situation_he:
        "ההחלטה שלכם השפיעה על המצב. מנהלי מחלקות ממתינים להבהרה לגבי היקף ההשפעה על התקציב שלהם, וצוות ה-FP&A זקוק להכוונה לגבי הצעד הבא.",
      event_he:
        "עדכון חדש\n\nמחלקת השיווק מבקשת הבהרה לגבי היקף ההשפעה על התקציב שלה, ובמקביל מנהל התפעול שואל אם ניתן להימנע מקיצוצים בתחום שלו.",
      constraints_he: ["חלון החלטה קצר", "לחץ ממנהלי מחלקות שונים"],
      availableIntel: [
        { label_he: "פילוח החריגה לפי מחלקה ולפי סעיף", cost: 2, accuracy: 90 },
        { label_he: "תחזית תזרים מעודכנת לשלושת החודשים הבאים", cost: 3, accuracy: 75 },
        { label_he: "סקירת התחייבויות חוזיות שלא ניתן לקצץ", cost: 1, accuracy: 95 },
      ],
      decisionPrompt_he: "מה עכשיו?",
      options: [
        {
          key: "targeted_cuts_by_root_cause",
          label_he: "קיצוצים ממוקדים במקור החריגה בלבד",
          keywords_he: ["קיצוץ ממוקד", "לפגוע רק במחלקה הרלוונטית", "קיצוץ ספציפי"],
          deltas: { budget_variance: 2, stakeholder_confidence: 1 },
          evidence_he: "ביצע קיצוצים ממוקדים במקור החריגה בלבד, במקום לפגוע בכלל המחלקות.",
          criteriaSignals: { diagnosis_before_action: 4, prioritization: 3 },
          nextEvent_he:
            "עדכון חדש\n\nהקיצוץ הממוקד ייצב את התקציב, אך מנהל השיווק מדווח שחלק מהצוות שלו עובד בעומס גבוה כדי לעמוד ביעדים המקוריים חרף הצמצום.",
        },
        {
          key: "across_the_board_cut",
          label_he: "קיצוץ אחיד בכל המחלקות",
          keywords_he: ["קיצוץ אחיד", "לחתוך לכולם באותה מידה", "קיצוץ רוחבי"],
          deltas: { budget_variance: 1, stakeholder_confidence: -2 },
          evidence_he: "הטיל קיצוץ אחיד על כלל המחלקות ללא קשר למקור החריגה.",
          criteriaSignals: { diagnosis_before_action: 1, prioritization: 1, realism: 2 },
        },
        {
          key: "negotiate_marketing_commitments",
          label_he: "משא ומתן על ההתחייבויות החוזיות של השיווק",
          keywords_he: ["משא ומתן עם ספקי שיווק", "לבחון את החוזים", "לצמצם התחייבויות קיימות"],
          deltas: { cash_runway: 1, budget_variance: 1 },
          evidence_he: "פתח במשא ומתן לבחינת ההתחייבויות החוזיות שגרמו לחריגה.",
          criteriaSignals: { financial_awareness: 4, realism: 3 },
        },
        {
          key: "escalate_to_bu_head",
          label_he: "העלאת הנושא למנהל היחידה העסקית",
          keywords_he: ["להעלות למנהל היחידה", "לבקש החלטה מלמעלה", "להסלים לניהול בכיר"],
          deltas: { stakeholder_confidence: 1 },
          evidence_he: "העלה את הסוגיה למנהל היחידה העסקית לפני נעילת החלטה משמעותית.",
          criteriaSignals: { communication: 3, knowing_when_to_stop: 2 },
        },
      ],
    },
    {
      index: 3,
      situation_he:
        "צוות התכנון והתקציב (FP&A) עובד בעומס גבוה בשבועות האחרונים, בין הכנת התחזית המעודכנת לבין תמיכה שוטפת למחלקות. אנליסט מרכזי אחד מרכז אצלו את מרבית מודל התחזית הקריטי.",
      event_he:
        "עדכון חדש\n\nהאנליסט המרכזי מודיע שהוא יוצא לחופשה מתוכננת בשבוע הבא, בדיוק לפני מועד סגירת התחזית הרבעונית.",
      constraints_he: ["צוות FP&A מצומצם", "מועד סגירה קרוב"],
      decisionPrompt_he: "איך תנהלו את הצוות והידע הקריטי בשלב הזה?",
      options: [
        {
          key: "document_forecast_model",
          label_he: "תיעוד מובנה של מודל התחזית",
          keywords_he: ["לתעד את המודל", "תיעוד תהליך תחזית", "גיבוי ידע פיננסי"],
          deltas: {},
          evidence_he: "דאג לתעד באופן מובנה את מודל התחזית שהיה מרוכז אצל אנליסט בודד.",
          criteriaSignals: { knowledge_protection: 5 },
        },
        {
          key: "redistribute_closing_tasks",
          label_he: "חלוקה מחדש של משימות הסגירה בצוות",
          keywords_he: ["לחלק משימות מחדש", "לפזר עומס בצוות", "לאזן עבודה בין אנליסטים"],
          deltas: { forecast_accuracy: 1 },
          evidence_he: "חילק מחדש את משימות הסגירה בצוות כדי להפחית את התלות באיש מפתח בודד.",
          criteriaSignals: { workload_management: 4 },
        },
        {
          key: "bring_temp_fpna_support",
          label_he: "הבאת תגבור זמני לצוות ה-FP&A",
          keywords_he: ["תגבור זמני", "אנליסט זמני", "כוח אדם נוסף לתקופה קצרה"],
          deltas: { cash_runway: -1, forecast_accuracy: 1 },
          evidence_he: "הביא תגבור זמני לצוות ה-FP&A כדי לעמוד במועד הסגירה.",
          criteriaSignals: { workload_management: 3, financial_awareness: 2 },
        },
        {
          key: "push_through_no_change",
          label_he: "המשך כרגיל ללא שינוי בעומס",
          keywords_he: ["להמשיך כרגיל", "לא לשנות כלום", "להתקדם כמתוכנן"],
          deltas: { forecast_accuracy: -2 },
          evidence_he: "בחר להמשיך כרגיל ללא התאמה לעומס ולסיכון הידע שדווחו.",
          criteriaSignals: { realism: 2, workload_management: 1, knowledge_protection: 1 },
        },
      ],
    },
    {
      index: 4,
      situation_he:
        "אתם מתקרבים למועד סגירת הרבעון. חלק מהצעדים שננקטו כבר ייצבו את המצב, וחלק מהיעדים המקוריים עדיין בסיכון.",
      event_he:
        "עדכון חדש\n\nסמנכ\"ל הכספים מבקש מכם סיכום ברור לקראת ישיבת ההנהלה, כולל השפעת הצעדים על התחזית לרבעון הבא.",
      decisionPrompt_he: "איך תבנו את הסיכום להנהלה?",
      options: [
        {
          key: "transparent_summary_with_forward_plan",
          label_he: "סיכום שקוף הכולל תוכנית להמשך",
          keywords_he: ["סיכום שקוף", "דיווח מלא כולל תוכנית קדימה", "מה קרה ומה הצעד הבא"],
          deltas: { stakeholder_confidence: 3 },
          evidence_he: "בנה סיכום שקוף להנהלה שכלל גם תוכנית פעולה להמשך הרבעון.",
          criteriaSignals: { communication: 5, realism: 3 },
        },
        {
          key: "present_optimistic_view_only",
          label_he: "הצגת ההיבטים החיוביים בלבד",
          keywords_he: ["להציג בחיוב", "לא להזכיר את החריגה", "עדכון אופטימי בלבד"],
          deltas: { stakeholder_confidence: -2 },
          evidence_he: "התמקד בהיבטים החיוביים של הרבעון מול ההנהלה הבכירה.",
          criteriaSignals: { communication: 1, realism: 1 },
        },
        {
          key: "document_lessons_for_next_quarter",
          label_he: "תיעוד לקחים לקראת הרבעון הבא",
          keywords_he: ["תיעוד לקחים", "הפקת לקחים", "לשפר תהליך תחזית"],
          deltas: { forecast_accuracy: 1 },
          evidence_he: "תיעד לקחים מהרבעון לטובת תהליך התחזית הבא.",
          criteriaSignals: { diagnosis_before_action: 3, knowledge_protection: 2 },
        },
      ],
    },
  ],
};

const vpScenario: Scenario = {
  id: "finance-vp-1",
  domainKey: "finance",
  title_he: "פער תזרים מול מחזור דיווח לדירקטוריון ועסקת רכישה",
  roleLevel: "vp",
  difficulty: 4,
  summary_he:
    "פער תזרים בלתי צפוי מתגלה שבוע לפני ישיבת דירקטוריון רבעונית, בדיוק כשעסקת רכישה משמעותית אמורה להיסגר תחת אי-ודאות שוק.",
  estimatedMinutes: [25, 35],
  kpis: [
    { key: "cash_runway", label_he: "יתרת מזומנים (חודשי ריצה)", unit: "חודשים", start: 5, min: 0, max: 12, higherIsBetter: true },
    { key: "budget_variance", label_he: "סטיית תזרים מהתחזית השנתית", unit: "%", start: -8, min: -25, max: 15, higherIsBetter: true },
    { key: "forecast_accuracy", label_he: "מהימנות תחזית התזרים", unit: "%", start: 68, min: 30, max: 100, higherIsBetter: true },
    { key: "stakeholder_confidence", label_he: "אמון הדירקטוריון והמשקיעים", unit: "%", start: 70, min: 0, max: 100, higherIsBetter: true },
  ],
  turns: [
    {
      index: 1,
      situation_he:
        "אתם משמשים כסמנכ\"ל הכספים של החברה. שבוע לפני ישיבת דירקטוריון רבעונית, זוהתה סטייה משמעותית בין תזרים המזומנים בפועל לבין התחזית שהוצגה לדירקטוריון ברבעון הקודם. במקביל, ההנהלה ממתינה להחלטתכם לגבי המשך תהליך רכישת חברה משלימה בהיקף משמעותי, שאמור להיסגר בתוך כחודש. חלק מהפער בתזרים קשור ככל הנראה לתנודות שער חליפין ולחוסר ודאות בשוק, אך המידע הזמין חלקי.",
      constraints_he: ["חלון זמן קצר לפני ישיבת הדירקטוריון", "מידע חלקי על מקור הפער בתזרים", "לחץ להחלטה על עסקת הרכישה"],
      availableIntel: [
        { label_he: "ניתוח פער תזרים לפי יחידה עסקית", cost: 2, accuracy: 80 },
        { label_he: "סקירת חשיפה למטבע חוץ", cost: 3, accuracy: 75 },
        { label_he: "בדיקת נאותות פיננסית מזורזת לעסקת הרכישה", cost: 5, accuracy: 90 },
      ],
      decisionPrompt_he: "מה הייתם עושים עכשיו?",
      options: [
        {
          key: "commission_cash_gap_analysis",
          label_he: "הזמנת ניתוח פער תזרים לפי יחידה עסקית",
          keywords_he: ["ניתוח פער תזרים", "למפות את מקור הפער", "בדיקת תזרים לפי יחידה עסקית"],
          deltas: { forecast_accuracy: 1 },
          evidence_he: "הזמין ניתוח פער תזרים לפי יחידה עסקית לפני שגיבש עמדה מול הדירקטוריון.",
          criteriaSignals: { diagnosis_before_action: 5, information_acquisition: 4 },
          nextEvent_he:
            "עדכון חדש\n\nהניתוח מראה שעיקר הפער נובע מעיכוב בגבייה מלקוח בין-לאומי גדול ומחשיפה למטבע חוץ שלא גודרה במלואה. יועצי עסקת הרכישה מבקשים תשובה דחופה לגבי לוח הזמנים.",
        },
        {
          key: "pause_acquisition_pending_clarity",
          label_he: "השהיית תהליך הרכישה עד להבהרת התזרים",
          keywords_he: ["להשהות את הרכישה", "לעצור את העסקה זמנית", "לחכות לבהירות בתזרים"],
          deltas: { cash_runway: 1, stakeholder_confidence: -1 },
          evidence_he: "בחר להשהות את תהליך הרכישה עד להבהרת מקור הפער בתזרים.",
          criteriaSignals: { knowing_when_to_stop: 4, realism: 3 },
        },
        {
          key: "brief_board_early_with_partial_data",
          label_he: "תדרוך מוקדם ושקוף לדירקטוריון על הפער שזוהה",
          keywords_he: ["לעדכן דירקטוריון מוקדם", "שקיפות מול הדירקטוריון", "תדרוך דחוף להנהלה"],
          deltas: { stakeholder_confidence: 2 },
          evidence_he: "בחר לתדרך את הדירקטוריון מוקדם ובאופן שקוף על הפער שזוהה, גם בטרם התבררה התמונה המלאה.",
          criteriaSignals: { communication: 5, knowing_when_to_stop: 3 },
        },
        {
          key: "proceed_with_acquisition_as_planned",
          label_he: "המשך תהליך הרכישה כמתוכנן ללא שינוי",
          keywords_he: ["להמשיך כמתוכנן", "לא לעצור את העסקה", "לסגור את הרכישה בזמן"],
          deltas: { cash_runway: -2, forecast_accuracy: -1 },
          evidence_he: "בחר להמשיך בתהליך הרכישה כמתוכנן, ללא עדכון לוח הזמנים לאור הפער שזוהה בתזרים.",
          criteriaSignals: { diagnosis_before_action: 1, knowing_when_to_stop: 1, realism: 1 },
        },
        {
          key: "hedge_fx_exposure_immediately",
          label_he: "גידור מיידי של חשיפת מטבע החוץ",
          keywords_he: ["לגדר מטבע חוץ", "הגנה על חשיפה מטבעית", "עסקת גידור דחופה"],
          deltas: { budget_variance: 2, cash_runway: -1 },
          evidence_he: "פעל לגידור מיידי של חשיפת מטבע החוץ שזוהתה כמקור אפשרי לפער.",
          criteriaSignals: { financial_awareness: 4, realism: 2 },
        },
      ],
    },
    {
      index: 2,
      situation_he:
        "התמונה מתבהרת חלקית. עיכוב הגבייה מהלקוח הבין-לאומי משמעותי יותר מהערכה הראשונית, ובמקביל צוות עסקת הרכישה מבקש החלטה סופית לגבי לוח הזמנים.",
      event_he:
        "עדכון חדש\n\nהלקוח הבין-לאומי מודיע כי התשלום צפוי להתעכב בשישה עד שמונה שבועות נוספים בשל הליכי אישור פנימיים אצלו, בעוד יועצי העסקה ממתינים לתשובה.",
      constraints_he: ["לוח זמנים לחוץ לסגירת עסקת הרכישה", "אי-ודאות לגבי מועד הגבייה בפועל"],
      availableIntel: [
        { label_he: "בדיקת איתנות פיננסית של הלקוח המעכב", cost: 3, accuracy: 80 },
        { label_he: "הערכת עלות עיכוב עסקת הרכישה ברבעון", cost: 2, accuracy: 85 },
        { label_he: "בחינת אפשרויות מימון גישור", cost: 2, accuracy: 70 },
      ],
      decisionPrompt_he: "מה הייתם עושים עכשיו?",
      options: [
        {
          key: "restructure_deal_terms",
          label_he: "בחינת שינוי מבנה עסקת הרכישה לתשלומים מדורגים",
          keywords_he: ["לשנות מבנה עסקה", "תשלומים מדורגים", "earn-out"],
          deltas: { cash_runway: 2, stakeholder_confidence: 1 },
          evidence_he: "יזם בחינה של מבנה תשלומים מדורג לעסקת הרכישה כדי להתאים אותה למגבלת התזרים.",
          criteriaSignals: { prioritization: 4, financial_awareness: 4 },
        },
        {
          key: "secure_bridge_financing",
          label_he: "גיוס מסגרת אשראי גישור זמנית",
          keywords_he: ["מסגרת אשראי גישור", "קו אשראי זמני", "bridge financing"],
          deltas: { cash_runway: 3, budget_variance: -1 },
          evidence_he: "פעל לאבטחת מסגרת אשראי גישור זמנית כדי לגשר על פער התזרים הצפוי.",
          criteriaSignals: { realism: 4, financial_awareness: 3 },
          nextEvent_he:
            "עדכון חדש\n\nמסגרת האשראי אושרה בתנאים סבירים, מה שהעניק לצוות שהות לגבש תוכנית מסודרת - אך אנליסט הליבה בתחום מודלים פיננסיים מדווח על עומס גבוה לקראת ישיבת הדירקטוריון.",
        },
        {
          key: "escalate_collections_directly",
          label_he: "מעורבות ישירה מול הלקוח בנושא הגבייה",
          keywords_he: ["לפנות ישירות ללקוח", "להסלים גבייה", "שיחה עם הלקוח על תשלום"],
          deltas: { forecast_accuracy: 1 },
          evidence_he: "יזם מעורבות ישירה מול הלקוח הבין-לאומי בנושא לוח הזמנים לגבייה.",
          criteriaSignals: { communication: 3, diagnosis_before_action: 2 },
        },
        {
          key: "commit_to_original_timeline_regardless",
          label_he: "התחייבות ללוח הזמנים המקורי של העסקה ללא שינוי",
          keywords_he: ["לא לשנות לוח זמנים", "להתחייב כרגיל", "לסגור בזמן המקורי"],
          deltas: { cash_runway: -3, stakeholder_confidence: -2 },
          evidence_he: "בחר להתחייב ללוח הזמנים המקורי של העסקה, ללא התאמה לעיכוב הגבייה שהתברר.",
          criteriaSignals: { realism: 1, communication: 2, diagnosis_before_action: 1 },
        },
      ],
    },
    {
      index: 3,
      situation_he:
        "צוות התזרים והדיווח הכספי עובד בעומס גבוה לקראת ישיבת הדירקטוריון, כאשר גם עסקת הרכישה וגם הפער בתזרים דורשים התייחסות מקבילה. אנליסט הליבה בתחום מודלים פיננסיים מרכז אצלו ידע קריטי שאינו מתועד באופן מלא.",
      event_he:
        "עדכון חדש\n\nאנליסט הליבה מדווח שהוא מוצף ומבקש לדחות משימות אחרות, בעוד יו\"ר ועדת הביקורת מבקש חומרי רקע מפורטים לפני הישיבה.",
      constraints_he: ["צוות מצומצם תחת עומס", "ריבוי דרישות מקבילות מהדירקטוריון"],
      decisionPrompt_he: "איך תנהלו את הצוות והידע הקריטי בשלב הזה?",
      options: [
        {
          key: "document_critical_cashflow_model",
          label_he: "תיעוד מובנה של מודל התזרים הקריטי",
          keywords_he: ["לתעד את המודל", "תיעוד מודל תזרים", "גיבוי ידע פיננסי קריטי"],
          deltas: {},
          evidence_he: "דאג לתעד באופן מובנה את מודל התזרים הקריטי שהיה מרוכז אצל אנליסט בודד.",
          criteriaSignals: { knowledge_protection: 5 },
        },
        {
          key: "bring_temp_treasury_support",
          label_he: "הבאת תגבור זמני לצוות התזרים",
          keywords_he: ["תגבור זמני לצוות", "אנליסט חיצוני זמני", "כוח אדם נוסף לתקופה קצרה"],
          deltas: { cash_runway: -1, forecast_accuracy: 1 },
          evidence_he: "הביא תגבור זמני לצוות התזרים כדי לעמוד בדרישות המקבילות.",
          criteriaSignals: { workload_management: 3, financial_awareness: 2 },
        },
        {
          key: "prioritize_board_materials_over_secondary_tasks",
          label_he: "תעדוף חומרי הדירקטוריון על פני משימות משניות",
          keywords_he: ["לתעדף את הדירקטוריון", "לדחות משימות אחרות", "להתמקד בחומרים לישיבה"],
          deltas: { stakeholder_confidence: 1 },
          evidence_he: "תעדף את הכנת חומרי הדירקטוריון על פני משימות משניות, ותקשר זאת לצוות בבירור.",
          criteriaSignals: { prioritization: 4, workload_management: 2 },
        },
        {
          key: "push_through_no_change",
          label_he: "המשך כרגיל ללא שינוי בעומס הצוות",
          keywords_he: ["להמשיך כרגיל", "לא לשנות כלום", "להתקדם כמתוכנן ללא התאמה"],
          deltas: { forecast_accuracy: -2 },
          evidence_he: "בחר להמשיך כרגיל ללא התאמה לעומס ולסיכון הידע שדווחו.",
          criteriaSignals: { realism: 2, workload_management: 1, knowledge_protection: 1 },
        },
      ],
    },
    {
      index: 4,
      situation_he:
        "אתם מגיעים לישיבת הדירקטוריון. חלק מהצעדים שננקטו כבר ייצבו את מצב התזרים, אך עדיין קיימת אי-ודאות לגבי עיתוי הגבייה ולגבי עסקת הרכישה.",
      event_he:
        "עדכון חדש\n\nיו\"ר הדירקטוריון מבקש מכם להציג תמונת מצב מלאה, כולל השלכות על תזרים המזומנים, על עסקת הרכישה ועל התחזית לרבעון הבא.",
      decisionPrompt_he: "איך תבנו את המצגת לדירקטוריון?",
      options: [
        {
          key: "full_transparency_with_scenarios",
          label_he: "מצגת שקופה הכוללת תרחישי תזרים חלופיים",
          keywords_he: ["מצגת שקופה", "תרחישים חלופיים", "להציג טווח אפשרויות"],
          deltas: { stakeholder_confidence: 3 },
          evidence_he: "בנה מצגת שקופה לדירקטוריון שכללה תרחישי תזרים חלופיים ולא רק תחזית יחידה.",
          criteriaSignals: { communication: 5, realism: 4 },
        },
        {
          key: "minimize_visible_risk",
          label_he: "הצגת הסיכון כמינימלי ככל האפשר",
          keywords_he: ["להציג כקטן", "למזער את הדיווח", "לא להדגיש את הסיכון"],
          deltas: { stakeholder_confidence: -2 },
          evidence_he: "בחר להציג את הסיכון בתזרים כמינימלי, מעבר למה שהנתונים תמכו בו.",
          criteriaSignals: { communication: 1, realism: 1, financial_awareness: 2 },
        },
        {
          key: "propose_governance_change",
          label_he: "הצעת שינוי בתהליך התחזית והבקרה התזרימית",
          keywords_he: ["שינוי תהליך תחזית", "בקרה תזרימית חדשה", "לשפר תהליכי בקרה"],
          deltas: { forecast_accuracy: 2 },
          evidence_he: "הציע שינוי בתהליך התחזית והבקרה התזרימית כדי להפחית סיכון דומה בעתיד.",
          criteriaSignals: { diagnosis_before_action: 4, realism: 3 },
        },
      ],
    },
  ],
};

const scenarios: Scenario[] = [managerScenario, vpScenario];
export default scenarios;
