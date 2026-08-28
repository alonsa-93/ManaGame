import type { Scenario } from "@/lib/scenario-schema";

/**
 * Cybersecurity & Incident Response domain content.
 *
 * All company names, products and the incident itself are fictional and
 * illustrative. Scenarios focus on business/crisis-management judgment
 * (containment pace, escalation timing, internal and external
 * communication, regulatory posture) — not on technical attack details.
 */

const managerKpis: Scenario["kpis"] = [
  { key: "containment", label_he: "התקדמות בלימת האירוע", unit: "%", start: 20, min: 0, max: 100, higherIsBetter: true },
  { key: "exposure_risk", label_he: "סיכון לחשיפת נתונים", unit: "%", start: 40, min: 0, max: 100, higherIsBetter: false },
  { key: "customer_trust", label_he: "אמון לקוחות", unit: "%", start: 85, min: 0, max: 100, higherIsBetter: true },
  { key: "regulatory_exposure", label_he: "חשיפה רגולטורית", unit: "%", start: 10, min: 0, max: 100, higherIsBetter: false },
];

const managerScenario: Scenario = {
  id: "cybersecurity-manager-1",
  domainKey: "cybersecurity",
  title_he: "חשד ראשוני לגישה בלתי מורשית",
  roleLevel: "manager",
  difficulty: 3,
  summary_he:
    "מערכת הניטור של חברת התוכנה 'קליר-סופט' מזהה דפוס גישה חריג בחשבון עובד. יש להחליט על קצב הבלימה, היקף התקשורת הפנימית ורגע ההסלמה, בתנאי מידע פורנזי חלקי בלבד.",
  estimatedMinutes: [20, 30],
  kpis: managerKpis,
  turns: [
    {
      index: 1,
      situation_he:
        "אתם מנהלים את יחידת אבטחת המידע (SOC) בחברת תוכנה בשם 'קליר-סופט', המספקת מערכת ניהול לקוחות ל-B2B. בשעה 03:14 בלילה, מערכת הניטור מסמנת פעילות חריגה: חשבון של נציג שירות לקוחות ביצע ייצוא נתונים ממאגר הלקוחות ממיקום שלא זוהה בעבר, בשעה שאינה תואמת את דפוסי העבודה הרגילים שלו. טרם ידוע אם מדובר בפעילות זדונית, בטעות תפעולית או בעובד שעבד מרחוק שלא כרגיל.",
      constraints_he: [
        "מידע ראשוני בלבד ממערכת הניטור",
        "אין עדיין אישור אם מדובר בפעילות זדונית",
        "יש להימנע מהפרעה מיותרת לפעילות העסקית בשלב זה",
      ],
      availableIntel: [
        { label_he: "בדיקת יומני גישה (Access Logs) מורחבת", cost: 1, accuracy: 80 },
        { label_he: "אימות ישיר מול העובד", cost: 1, accuracy: 60 },
        { label_he: "ניתוח פורנזי ראשוני של התחנה", cost: 3, accuracy: 90 },
      ],
      decisionPrompt_he: "מה הייתם עושים עכשיו?",
      options: [
        {
          key: "pull_extended_logs",
          label_he: "בדיקת יומני גישה מורחבים לפני כל פעולה",
          keywords_he: ["בדיקת יומני גישה", "לבדוק לוגים", "ניתוח פעילות מורחב"],
          deltas: { containment: 5 },
          evidence_he: "בדק יומני גישה מורחבים לפני נקיטת פעולה מרחיקת לכת.",
          criteriaSignals: { diagnosis_before_action: 5, information_acquisition: 4 },
          nextEvent_he:
            "עדכון חדש\n\nבדיקת יומני הגישה מעלה שהחשבון ביצע ייצוא של קובץ הכולל פרטי לקוחות, בעוד שהעובד עצמו מאשר בבירור ראשוני שלא היה מחובר למערכת באותה שעה.",
        },
        {
          key: "disable_account_immediately",
          label_he: "השבתה מיידית של חשבון המשתמש",
          keywords_he: ["להשבית חשבון", "לחסום גישה מיידית", "נעילת המשתמש"],
          deltas: { containment: 6, exposure_risk: -8 },
          evidence_he: "השבית מיידית את חשבון המשתמש החשוד, לפני שהושלם אימות מלא של הפעילות.",
          criteriaSignals: { diagnosis_before_action: 2, information_acquisition: 2, prioritization: 3 },
          nextEvent_he:
            "עדכון חדש\n\nההשבתה מנעה המשך פעילות מהחשבון, אך צוות התמיכה מדווח שהעובד האמיתי איבד גישה למערכות קריטיות לפני משמרת שירות לקוחות עמוסה.",
        },
        {
          key: "contact_employee_directly",
          label_he: "פנייה ישירה לעובד לבירור",
          keywords_he: ["לפנות לעובד", "לברר מול העובד", "שיחה עם העובד"],
          deltas: { containment: 2 },
          evidence_he: "פנה ישירות לעובד כדי לברר את פשר הפעילות החריגה בחשבונו.",
          criteriaSignals: { information_acquisition: 3, communication: 2 },
        },
        {
          key: "escalate_ciso_now",
          label_he: "הסלמה מיידית למנהל אבטחת המידע הראשי",
          keywords_he: ["להסלים למנהל אבטחה", "לעדכן CISO", "דיווח מיידי להנהלה"],
          deltas: { regulatory_exposure: -3 },
          evidence_he: "העלה את הנושא למנהל אבטחת המידע הראשי בשלב מוקדם, לפני שהתמונה הייתה מלאה.",
          criteriaSignals: { communication: 4, knowing_when_to_stop: 2 },
        },
        {
          key: "wait_and_monitor",
          label_he: "המשך ניטור שקט ללא פעולה נוספת",
          keywords_he: ["להמשיך לנטר", "לא לפעול עדיין", "להמתין ולראות"],
          deltas: { exposure_risk: 5, containment: -3 },
          evidence_he: "בחר להמשיך לנטר את הפעילות מבלי לנקוט בפעולה נוספת בשלב זה.",
          criteriaSignals: { knowing_when_to_stop: 2, diagnosis_before_action: 2, prioritization: 1 },
        },
      ],
    },
    {
      index: 2,
      situation_he:
        "החשד לגישה לא מורשית לחשבון עובד אמיתי מתחזק. צוות ה-IT מזהה שאותו חשבון ביצע גם ניסיון התחברות למערכת ניהול הלקוחות (CRM), הכוללת פרטי קשר ותשלום של לקוחות רבים.",
      event_he:
        "עדכון חדש\n\nמערכת מניעת דליפת מידע (DLP) חוסמת ניסיון נוסף לייצוא קובץ גדול, אך לא ברור אם קבצים קודמים כבר יצאו מהרשת לפני שהחסימה הופעלה.",
      constraints_he: [
        "טרם ידוע היקף הנתונים שנחשפו, אם בכלל",
        "יש להחליט אם לשתף את הצוות הרחב יותר",
        "חלון זמן קצר לפני תחילת יום העבודה הרגיל",
      ],
      availableIntel: [
        { label_he: "ניתוח לוגי גישה מלאים של החשבון החשוד", cost: 3, accuracy: 90 },
        { label_he: "בדיקה האם בוצעה הורדת נתונים מה-CRM", cost: 3, accuracy: 85 },
        { label_he: "אימות זהות מול העובד עצמו ומול מנהלו", cost: 1, accuracy: 80 },
      ],
      decisionPrompt_he: "מה הייתם עושים עכשיו?",
      options: [
        {
          key: "force_password_reset_org",
          label_he: "איפוס סיסמאות לכלל בעלי הרשאה דומה",
          keywords_he: ["איפוס סיסמאות", "החלפת סיסמאות לצוות", "reset גורף להרשאות"],
          deltas: { containment: 4, exposure_risk: -4 },
          evidence_he: "יזם איפוס סיסמאות לכלל בעלי ההרשאות הדומות כצעד מניעתי רחב.",
          criteriaSignals: { prioritization: 3, realism: 3 },
        },
        {
          key: "isolate_crm_system",
          label_he: "בידוד זמני של מערכת ה-CRM מהרשת",
          keywords_he: ["לבודד את המערכת", "ניתוק זמני מהרשת", "בידוד רשת"],
          deltas: { containment: 6, exposure_risk: -6, customer_trust: -3 },
          evidence_he: "בודד את מערכת ה-CRM מהרשת הארגונית באופן זמני כדי לעצור חשיפה אפשרית נוספת.",
          criteriaSignals: { diagnosis_before_action: 3, realism: 3 },
          nextEvent_he:
            "עדכון חדש\n\nהבידוד מנע פעילות נוספת בחשבון, אך צוות המכירות מדווח שאינו יכול לגשת לנתוני לקוחות קריטיים לקראת שיחה מתוכננת עם לקוח מרכזי.",
        },
        {
          key: "notify_internal_stakeholders_only",
          label_he: "עדכון פנימי מצומצם לבעלי עניין רלוונטיים בלבד",
          keywords_he: ["עדכון פנימי מצומצם", "ליידע רק את הרלוונטיים", "לשמור בסודיות בשלב זה"],
          deltas: { regulatory_exposure: -1 },
          evidence_he: "עדכן קבוצה מצומצמת ורלוונטית של בעלי עניין פנימיים, מבלי להרחיב את התקשורת בטרם עת.",
          criteriaSignals: { communication: 3, knowledge_protection: 2 },
        },
        {
          key: "launch_full_ir_protocol",
          label_he: "הפעלת נוהל תגובה לאירוע מלא",
          keywords_he: ["נוהל תגובה לאירוע", "הפעלת צוות תגובה", "IR protocol"],
          deltas: { containment: 5 },
          evidence_he: "הפעיל את נוהל תגובה לאירוע המלא, כולל הקצאת בעלי תפקידים מוגדרים מראש.",
          criteriaSignals: { realism: 4, diagnosis_before_action: 2 },
        },
        {
          key: "delay_pending_forensics",
          label_he: "עיכוב פעולות נוספות עד לתוצאות הבדיקה הפורנזית",
          keywords_he: ["להמתין לבדיקה פורנזית", "לא לפעול לפני תוצאות", "לחכות לניתוח מלא"],
          deltas: { exposure_risk: 3 },
          evidence_he: "בחר להמתין לתוצאות הבדיקה הפורנזית לפני נקיטת צעדים נוספים.",
          criteriaSignals: { knowing_when_to_stop: 2, information_acquisition: 3 },
        },
      ],
    },
    {
      index: 3,
      situation_he:
        "האירוע נמצא בטיפול פעיל כבר כשלושה ימים. צוות ה-SOC עובד במשמרות מוארכות, ובמקביל מתחילות להגיע שאלות מנציגי שירות הלקוחות שמבחינים בפניות חוזרות בנוגע לפעילות חריגה בחשבונות.",
      event_he:
        "עדכון חדש\n\nראש צוות ה-SOC מתריע כי חלק מהאנליסטים המרכזיים על סף שחיקה, ובמקביל מתגלה כי ייתכן שהאירוע נמשך זמן רב יותר משהוערך בתחילה.",
      constraints_he: ["צוות מצומצם ועייף", "אי-ודאות לגבי משך האירוע בפועל", "עלייה בפניות משירות הלקוחות"],
      decisionPrompt_he: "איך תנהלו את הצוות ואת התקשורת הפנימית בשלב הזה?",
      options: [
        {
          key: "rotate_soc_shifts",
          label_he: "סבב משמרות מסודר לצוות ה-SOC",
          keywords_he: ["סבב משמרות", "לחלק משמרות", "למנוע שחיקת צוות"],
          deltas: { containment: 1 },
          evidence_he: "ארגן סבב משמרות מסודר כדי למנוע שחיקה של אנליסטים מרכזיים.",
          criteriaSignals: { workload_management: 5 },
        },
        {
          key: "bring_external_ir_firm",
          label_he: "הבאת חברת תגובה לאירועים חיצונית לתגבור",
          keywords_he: ["חברת תגובה חיצונית", "תגבור IR חיצוני", "יועץ אבטחה חיצוני"],
          deltas: { containment: 3, regulatory_exposure: -2 },
          evidence_he: "הביא חברת תגובה לאירועים חיצונית לתגבור הצוות הפנימי.",
          criteriaSignals: { workload_management: 3, realism: 3 },
        },
        {
          key: "brief_customer_service_team",
          label_he: "תדרוך מובנה לצוות שירות הלקוחות",
          keywords_he: ["לתדרך שירות לקוחות", "להכין תסריט מענה", "ליידע את הצוות הפונה ללקוחות"],
          deltas: { customer_trust: 2 },
          evidence_he: "תדרך את צוות שירות הלקוחות עם מסגרת תשובה מוסכמת לפניות הקשורות לאירוע.",
          criteriaSignals: { communication: 4 },
        },
        {
          key: "document_incident_timeline",
          label_he: "תיעוד שיטתי של ציר הזמן והפעולות שננקטו",
          keywords_he: ["לתעד ציר זמן", "תיעוד האירוע", "לשמור תיעוד מסודר"],
          deltas: {},
          evidence_he: "התחיל בתיעוד שיטתי של ציר הזמן והפעולות שננקטו במהלך האירוע.",
          criteriaSignals: { knowledge_protection: 4 },
        },
        {
          key: "push_team_without_change",
          label_he: "המשך העבודה באותו קצב ללא שינוי",
          keywords_he: ["להמשיך באותו קצב", "לא לשנות סידור עבודה", "להתקדם כרגיל"],
          deltas: { containment: -2 },
          evidence_he: "בחר להמשיך את קצב העבודה הקיים ללא התאמה לסימני השחיקה שדווחו.",
          criteriaSignals: { realism: 2, workload_management: 1 },
        },
      ],
    },
    {
      index: 4,
      situation_he:
        "האירוע נסגר מבחינה טכנית: הגישה הלא מורשית נחסמה וכלל המערכות אומתו כתקינות. נותרה שאלה פתוחה האם יש צורך בהודעה ללקוחות או לגורם רגולטורי, בהתאם למידע שנאסף.",
      event_he:
        "עדכון חדש\n\nהבדיקה הפורנזית הסופית מגיעה: לא נמצאה ראיה חד-משמעית לכך שנתוני לקוחות אכן יצאו מהרשת, אך גם לא ניתן לשלול זאת באופן מוחלט.",
      decisionPrompt_he: "איך תסכמו את האירוע ותמליצו להנהלה?",
      options: [
        {
          key: "recommend_disclosure_review",
          label_he: "המלצה להעברת הממצאים לבחינה משפטית לגבי חובת דיווח",
          keywords_he: ["לבחון חובת דיווח", "להעביר למשפטית", "בדיקת חובת גילוי"],
          deltas: { regulatory_exposure: -3 },
          evidence_he: "המליץ להעביר את הממצאים לבחינה משפטית לגבי חובת דיווח, חרף חוסר הוודאות שנותר.",
          criteriaSignals: { realism: 4, communication: 2 },
        },
        {
          key: "transparent_internal_report",
          label_he: "דוח שקוף ומלא להנהלה הבכירה",
          keywords_he: ["דוח שקוף להנהלה", "דיווח מלא", "לא להסתיר ממצאים"],
          deltas: { regulatory_exposure: -1 },
          evidence_he: "הגיש להנהלה הבכירה דוח שקוף ומלא, כולל אי-הוודאות שנותרה לגבי היקף החשיפה.",
          criteriaSignals: { communication: 5, realism: 3 },
        },
        {
          key: "close_without_escalation",
          label_he: "סגירת האירוע ללא העלאה נוספת להנהלה",
          keywords_he: ["לסגור בשקט", "לא להעלות הלאה", "סיום ללא דיווח נוסף"],
          deltas: { regulatory_exposure: 4, customer_trust: -2 },
          evidence_he: "בחר לסגור את האירוע מבלי להעלות את שאלת החשיפה הפוטנציאלית להנהלה הבכירה.",
          criteriaSignals: { communication: 1, realism: 1, knowing_when_to_stop: 1 },
        },
        {
          key: "document_lessons_learned_cyber",
          label_he: "תיעוד לקחים ועדכון נהלי ניטור",
          keywords_he: ["תיעוד לקחים", "הפקת לקחים", "עדכון נהלי ניטור"],
          deltas: { containment: 1 },
          evidence_he: "תיעד לקחים מהאירוע ועדכן את נהלי הניטור לקראת אירועים דומים בעתיד.",
          criteriaSignals: { diagnosis_before_action: 3, knowledge_protection: 3 },
        },
      ],
    },
  ],
};

const vpKpis: Scenario["kpis"] = [
  { key: "containment", label_he: "התקדמות בלימת האירוע הגלובלי", unit: "%", start: 15, min: 0, max: 100, higherIsBetter: true },
  { key: "exposure_risk", label_he: "היקף חשיפת נתוני לקוחות", unit: "%", start: 55, min: 0, max: 100, higherIsBetter: false },
  { key: "customer_trust", label_he: "אמון לקוחות אסטרטגיים", unit: "%", start: 70, min: 0, max: 100, higherIsBetter: true },
  { key: "regulatory_exposure", label_he: "חשיפה רגולטורית ומשפטית", unit: "%", start: 35, min: 0, max: 100, higherIsBetter: false },
];

const vpScenario: Scenario = {
  id: "cybersecurity-vp-1",
  domainKey: "cybersecurity",
  title_he: "דליפת נתוני לקוחות בלחץ זמן קיצוני",
  roleLevel: "vp",
  difficulty: 5,
  summary_he:
    "אירוע פריצה מאומת בפלטפורמת ה-SaaS הגלובלית 'נובה-קלאוד' חושף נתוני לקוחות עסקיים בהיקף משמעותי. יש לאזן בין בלימה טכנית, חובות רגולטוריות, שקיפות ללקוחות ורציפות עסקית, תחת שעון דוחק ומול ריבוי בעלי עניין.",
  estimatedMinutes: [25, 35],
  kpis: vpKpis,
  turns: [
    {
      index: 1,
      situation_he:
        "אתם עומדים בראש אבטחת המידע של 'נובה-קלאוד', פלטפורמת SaaS גלובלית המשרתת אלפי לקוחות עסקיים. צוות אבטחת המידע אישר אירוע פריצה מאומת: גורם לא מזוהה קיבל גישה למסד נתוני לקוחות הכולל פרטי קשר ומידע חשבון. הגישה הלא מורשית נבלמה מבחינה טכנית, אך היקף הנתונים שנחשפו בפועל טרם מוצה. הדירקטוריון והיועצת המשפטית הראשית כבר עודכנו, ולוח הזמנים להחלטות מכריעות נמדד בשעות ולא בימים.",
      constraints_he: [
        "שעון רגולטורי לדיווח פוטנציאלי כבר פועל",
        "אי-ודאות לגבי היקף הנתונים שנחשפו בפועל",
        "ריבוי בעלי עניין: משפטי, דירקטוריון, לקוחות אסטרטגיים",
        "לחץ תקשורתי חיצוני עלול לעלות בכל רגע",
      ],
      availableIntel: [
        { label_he: "מיפוי היקף הנתונים שנחשפו", cost: 2, accuracy: 75 },
        { label_he: "חוות דעת משפטית ראשונית על חובת דיווח", cost: 2, accuracy: 70 },
        { label_he: "ניתוח פורנזי מעמיק של דפוס החדירה", cost: 4, accuracy: 90 },
      ],
      decisionPrompt_he: "מה הייתם עושים עכשיו, כשהשעון הרגולטורי כבר פועל?",
      options: [
        {
          key: "commission_scope_mapping",
          label_he: "הזמנת מיפוי מיידי של היקף הנתונים שנחשפו",
          keywords_he: ["מיפוי היקף חשיפה", "לבדוק כמה לקוחות נפגעו", "ניתוח היקף הדליפה"],
          deltas: { regulatory_exposure: -2, exposure_risk: -3 },
          evidence_he: "הזמין מיפוי מיידי של היקף הנתונים שנחשפו לפני קבלת החלטות מחייבות.",
          criteriaSignals: { diagnosis_before_action: 5, information_acquisition: 4 },
          nextEvent_he:
            "עדכון חדש\n\nהמיפוי הראשוני מעלה שכ-12,000 לקוחות עסקיים נחשפו ברמה כלשהי, אך לא ברור אילו שדות מידע ספציפיים נחשפו לכל אחד מהם.",
        },
        {
          key: "engage_legal_before_disclosure",
          label_he: "מעורבות מיידית של הייעוץ המשפטי לפני כל הודעה חיצונית",
          keywords_he: ["לערב את המשפטית", "חוות דעת משפטית", "לבדוק חובת דיווח לפני הודעה"],
          deltas: { regulatory_exposure: -3 },
          evidence_he: "ערב את הייעוץ המשפטי באופן מיידי לפני כל פרסום או הודעה חיצונית.",
          criteriaSignals: { diagnosis_before_action: 3, communication: 2 },
        },
        {
          key: "immediate_customer_notification",
          label_he: "הודעה מיידית לכלל הלקוחות, בטרם הושלם המיפוי",
          keywords_he: ["להודיע ללקוחות מיד", "הודעה גורפת מיידית", "לפרסם לכולם עכשיו"],
          deltas: { customer_trust: 2, regulatory_exposure: 1, exposure_risk: -2 },
          evidence_he: "בחר להודיע לכלל הלקוחות באופן מיידי, לפני שהושלם מיפוי היקף החשיפה בפועל.",
          criteriaSignals: { diagnosis_before_action: 1, prioritization: 1, realism: 2 },
        },
        {
          key: "activate_crisis_committee",
          label_he: "הפעלת ועדת משבר רב-תחומית",
          keywords_he: ["ועדת משבר", "גיבוש צוות רב-תחומי", "crisis committee"],
          deltas: { containment: 3, exposure_risk: -4 },
          evidence_he: "הפעיל ועדת משבר רב-תחומית הכוללת הנהלה, משפטי, אבטחה ותקשורת.",
          criteriaSignals: { realism: 4, communication: 3 },
        },
        {
          key: "delay_all_action_pending_forensics",
          label_he: "עיכוב כל החלטה חיצונית עד להשלמת הניתוח הפורנזי המלא",
          keywords_he: ["להמתין לניתוח פורנזי מלא", "לא לפעול כלפי חוץ עדיין", "לחכות לתמונה מלאה"],
          deltas: { regulatory_exposure: 3, exposure_risk: 5 },
          evidence_he: "בחר לעכב כל החלטה כלפי חוץ עד להשלמת הניתוח הפורנזי המלא.",
          criteriaSignals: { knowing_when_to_stop: 2, information_acquisition: 2 },
        },
      ],
    },
    {
      index: 2,
      situation_he:
        "המיפוי מתקדם: כ-12 אלף לקוחות עסקיים נחשפו ברמה כלשהי, כאשר עבור כרבע מהם קיימת אינדיקציה לחשיפת פרטי קשר וחשבון מלאים. היועצת המשפטית מעריכה שקיימת חובת דיווח, אך טרם ניתן לקבוע את המסגרת הזמן המדויקת. במקביל, מתחילות להתפרסם התייחסויות לא מאומתות ברשתות מקצועיות.",
      event_he:
        "עדכון חדש\n\nכתב טכנולוגיה פונה ליחסי הציבור של החברה עם שאלות ישירות על 'דיווחים על פריצה', לפני שהחברה פרסמה כל הודעה רשמית.",
      constraints_he: ["שאלות מהתקשורת כבר מתקבלות", "היקף מדויק עדיין לא סופי", "לחץ מהדירקטוריון לנקיטת עמדה אחידה"],
      availableIntel: [
        { label_he: "חקירה פורנזית ממוקדת לרבע הלקוחות החשוף ביותר", cost: 3, accuracy: 90 },
        { label_he: "חוות דעת משפטית על חלון הזמן לדיווח הרגולטורי", cost: 2, accuracy: 95 },
        { label_he: "ניטור אזכורים ברשתות מקצועיות ובתקשורת", cost: 1, accuracy: 65 },
      ],
      decisionPrompt_he: "איך תנווטו את ההחלטה הבאה, כשהתקשורת כבר מעורבת?",
      options: [
        {
          key: "proactive_controlled_statement",
          label_he: "פרסום הודעה יזומה ומבוקרת לפני שהתקשורת תוביל את הנרטיב",
          keywords_he: ["הודעה יזומה", "להקדים את התקשורת", "לפרסם הודעה מבוקרת"],
          deltas: { customer_trust: 3, regulatory_exposure: -1 },
          evidence_he: "פרסם הודעה יזומה ומבוקרת שכללה את מה שידוע ואת מה שעדיין לא ידוע, לפני שהתקשורת הובילה את הנרטיב.",
          criteriaSignals: { communication: 5, realism: 4 },
          nextEvent_he:
            "עדכון חדש\n\nההודעה היזומה התקבלה בהערכה על השקיפות, אך כמה לקוחות אסטרטגיים דורשים כעת שיחה אישית עם ההנהלה הבכירה תוך 24 שעות.",
        },
        {
          key: "no_comment_to_press",
          label_he: "מדיניות 'אין תגובה' לתקשורת בשלב זה",
          keywords_he: ["אין תגובה", "לא להגיב לתקשורת", "לשתוק בשלב זה"],
          deltas: { customer_trust: -3 },
          evidence_he: "בחר במדיניות 'אין תגובה' לתקשורת בשלב זה של האירוע.",
          criteriaSignals: { communication: 2, realism: 3, knowing_when_to_stop: 3 },
        },
        {
          key: "notify_strategic_customers_first",
          label_he: "עדכון אישי מוקדם ללקוחות האסטרטגיים הגדולים ביותר",
          keywords_he: ["לעדכן לקוחות מרכזיים קודם", "שיחה אישית ללקוחות גדולים", "עדכון VIP מוקדם"],
          deltas: { customer_trust: 3, regulatory_exposure: -1, exposure_risk: -1 },
          evidence_he: "יזם עדכון אישי ומוקדם ללקוחות האסטרטגיים הגדולים ביותר, לפני הודעה כללית.",
          criteriaSignals: { prioritization: 4, communication: 3 },
        },
        {
          key: "wait_for_full_legal_certainty",
          label_he: "המתנה לוודאות משפטית מלאה לפני כל תקשורת חיצונית",
          keywords_he: ["להמתין לוודאות משפטית", "לא לתקשר עד לבהירות מלאה", "לחכות לחוות דעת סופית"],
          deltas: { regulatory_exposure: 2, customer_trust: -2, exposure_risk: 4 },
          evidence_he: "בחר להמתין לוודאות משפטית מלאה לפני כל תקשורת חיצונית, בעוד ההתייחסויות הלא מאומתות ממשיכות להתפשט.",
          criteriaSignals: { knowing_when_to_stop: 2, diagnosis_before_action: 2, prioritization: 1 },
        },
      ],
    },
    {
      index: 3,
      situation_he:
        "ועדת המשבר פועלת כבר יומיים ברציפות. חברי הוועדה מגיעים ממחלקות שונות שממשיכות במקביל לתפקד בשגרה, וישנם סימנים לכך שההחלטות אינן מגיעות בעקביות לכל הדרגים הרלוונטיים באתרי החברה השונים.",
      event_he:
        "עדכון חדש\n\nמנהלת אזור אירופה מדווחת שקיבלה הנחיות סותרות משני גורמים שונים בתוך הוועדה, ומבקשת בהירות לגבי מי מוסמך לקבל החלטות בכל תחום.",
      constraints_he: ["ריבוי דרגים ואזורים גיאוגרפיים", "עומס מתמשך על חברי הוועדה", "צורך בבהירות סמכויות"],
      decisionPrompt_he: "איך תארגנו את קבלת ההחלטות וההאצלה בשלב הזה?",
      options: [
        {
          key: "define_clear_raci",
          label_he: "הגדרת מבנה סמכויות ברור ותקשורו לכלל הצוותים",
          keywords_he: ["הגדרת סמכויות", "מי מחליט מה", "מבנה החלטות ברור"],
          deltas: { containment: 2, exposure_risk: -2 },
          evidence_he: "הגדיר מבנה סמכויות ברור וסמכויות החלטה, ותקשר אותו לכלל הצוותים המעורבים.",
          criteriaSignals: { communication: 5, workload_management: 3 },
        },
        {
          key: "rotate_crisis_committee_members",
          label_he: "סבב חברי ועדה כדי למנוע שחיקה",
          keywords_he: ["סבב חברי ועדה", "למנוע שחיקת ועדה", "להחליף חברים בתורנות"],
          deltas: { containment: 1, exposure_risk: -1 },
          evidence_he: "ארגן סבב של חברי ועדת המשבר כדי למנוע שחיקה של אנשי מפתח.",
          criteriaSignals: { workload_management: 5 },
        },
        {
          key: "centralize_all_regional_decisions",
          label_he: "ריכוז כל ההחלטות האזוריות במטה בלבד",
          keywords_he: ["לרכז החלטות במטה", "לא להאציל לאזורים", "כל ההחלטות דרך המטה"],
          deltas: { containment: -1, exposure_risk: 2 },
          evidence_he: "בחר לרכז את כל ההחלטות האזוריות במטה, ללא האצלה לצוותים המקומיים.",
          criteriaSignals: { workload_management: 1, knowledge_protection: 1, communication: 2 },
        },
        {
          key: "document_decision_authority_log",
          label_he: "תיעוד שיטתי של כל החלטה וסמכות מאחוריה",
          keywords_he: ["תיעוד סמכויות", "יומן החלטות", "לתעד מי אישר מה"],
          deltas: {},
          evidence_he: "התחיל בתיעוד שיטתי של כל החלטה מרכזית וזהות מקבל הסמכות מאחוריה.",
          criteriaSignals: { knowledge_protection: 4 },
        },
      ],
    },
    {
      index: 4,
      situation_he:
        "האירוע מתקרב לנקודת הכרעה. הניתוח הפורנזי הושלם ברובו, וברור כעת שנחשפו נתוני קשר וחשבון עבור כ-9,000 לקוחות עסקיים בפועל. הדירקטוריון ממתין להחלטה סופית לגבי מתכונת הדיווח הרגולטורי וההודעה הפומבית, ולוח הזמנים לדיווח מתקרב לסיומו.",
      event_he:
        "עדכון חדש\n\nיו\"ר הדירקטוריון מבקש החלטה סופית תוך שעתיים: מתכונת דיווח מלאה ושקופה, או מתכונת מצומצמת המבוססת על המינימום הנדרש בלבד.",
      decisionPrompt_he: "איך תגבשו את ההחלטה הסופית ואת ההודעה?",
      options: [
        {
          key: "full_transparent_disclosure",
          label_he: "דיווח מלא ושקוף, מעבר למינימום הנדרש",
          keywords_he: ["דיווח מלא ושקוף", "מעבר למינימום", "גילוי נאות מלא"],
          deltas: { customer_trust: 4, regulatory_exposure: -4, exposure_risk: -2 },
          evidence_he: "בחר בדיווח מלא ושקוף שחרג מהמינימום הפורמלי הנדרש.",
          criteriaSignals: { communication: 5, realism: 4 },
        },
        {
          key: "minimum_required_disclosure",
          label_he: "דיווח לפי המינימום הפורמלי הנדרש בלבד",
          keywords_he: ["מינימום נדרש", "דיווח מצומצם", "רק מה שחייבים"],
          deltas: { regulatory_exposure: -1, customer_trust: -1 },
          evidence_he: "בחר בדיווח המבוסס על המינימום הפורמלי הנדרש בלבד.",
          criteriaSignals: { financial_awareness: 2, communication: 1, realism: 2 },
        },
        {
          key: "delay_final_decision_further",
          label_he: "בקשת ארכה נוספת לפני קבלת ההחלטה הסופית",
          keywords_he: ["לבקש ארכה", "לדחות את ההחלטה עוד", "לא להכריע עכשיו"],
          deltas: { regulatory_exposure: 3, customer_trust: -2, exposure_risk: 4 },
          evidence_he: "ביקש ארכה נוספת לפני קבלת ההחלטה הסופית, מעבר לחלון הזמן שהוקצה.",
          criteriaSignals: { knowing_when_to_stop: 1, prioritization: 2, realism: 2 },
        },
        {
          key: "propose_post_incident_program",
          label_he: "הצעת תוכנית תמיכה ללקוחות שנפגעו כחלק מההודעה",
          keywords_he: ["תוכנית תמיכה ללקוחות", "מענה ללקוחות שנפגעו", "הצעת תמיכה קונקרטית"],
          deltas: { customer_trust: 3 },
          evidence_he: "כלל בהודעה הצעת תוכנית תמיכה ומענה קונקרטי ללקוחות שנפגעו בפועל.",
          criteriaSignals: { realism: 3, prioritization: 2 },
        },
      ],
    },
  ],
};

const scenarios: Scenario[] = [managerScenario, vpScenario];
export default scenarios;
