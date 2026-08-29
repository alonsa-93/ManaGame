import type { Scenario } from "@/lib/scenario-schema";

/**
 * Product & R&D domain (מוצר ופיתוח). Follows the exact shape defined in
 * content/scenarios/supply-chain.ts: a KPI set (max 4, per Master Spec §11),
 * ~4 turns, and a canonical action vocabulary per turn with keyword hints,
 * deltas, evidence text and criteria signals (from the fixed CRITERIA list
 * in lib/scenario-schema.ts).
 */

const managerKpis: Scenario["kpis"] = [
  { key: "schedule", label_he: "לוח זמנים", unit: "יום", start: 0, min: -14, max: 14, higherIsBetter: true },
  { key: "defect_rate", label_he: "שיעור באגים בייצור", unit: "%", start: 4, min: 0, max: 25, higherIsBetter: false },
  { key: "tech_debt", label_he: "חוב טכני", unit: "%", start: 22, min: 0, max: 100, higherIsBetter: false },
  { key: "morale", label_he: "מורל הצוות", unit: "%", start: 74, min: 0, max: 100, higherIsBetter: true },
];

const managerScenario: Scenario = {
  id: "product-rd-manager-1",
  domainKey: "product-rd",
  title_he: "באג קריטי בפתח ההשקה",
  roleLevel: "manager",
  difficulty: 2,
  summary_he:
    "שבועיים לפני מועד השקה שכבר תוקשר ללקוחות, נתגלה באג קריטי בתהליך התשלום. צוות ה-QA מצומצם וזמן הבדיקה מוגבל.",
  estimatedMinutes: [20, 30],
  kpis: managerKpis,
  turns: [
    {
      index: 1,
      situation_he:
        "אתם מנהלים את קבוצת המוצר האחראית על מודול התשלומים. שבועיים לפני מועד השקה שכבר תוקשר ללקוחות ולצוות המכירות, צוות ה-QA מזהה באג קריטי: בתרחיש ספציפי, תשלומים בכרטיס אשראי זר עלולים להיכשל בשקט מבלי שהמשתמש מקבל הודעת שגיאה. ההיקף המדויק של ההשפעה עדיין לא ברור - הבאג התגלה בסביבת בדיקות, ולא ידוע כמה מתוך בסיס הלקוחות הקיים ייחשף לתרחיש. צוות ה-QA מצומצם משמעותית לעומת מחזורי שחרור קודמים, וללוח הזמנים אין מרווח נוסף.",
      constraints_he: [
        "מועד השקה שכבר תוקשר ללקוחות",
        "צוות QA מצומצם",
        "מידע חלקי על היקף ההשפעה של הבאג",
      ],
      availableIntel: [
        { label_he: "ניתוח לוגים מסביבת הבדיקות", cost: 1, accuracy: 75 },
        { label_he: "סקר משתמשי בטא שנתקלו בתקלה", cost: 2, accuracy: 65 },
        { label_he: "הערכת זמן תיקון מהצוות הטכני", cost: 1, accuracy: 90 },
      ],
      decisionPrompt_he: "מה היית עושה עכשיו?",
      options: [
        {
          key: "investigate_root_cause",
          label_he: "ניתוח שורש הבעיה לפני החלטה",
          keywords_he: ["ניתוח שורש", "לבדוק את הבאג לעומק", "להבין את הגורם לבעיה"],
          deltas: { schedule: -1, tech_debt: -5 },
          evidence_he: "ביצע ניתוח שורש לבאג לפני שקבע את המשך הפעולה.",
          criteriaSignals: { diagnosis_before_action: 5, information_acquisition: 3 },
          nextEvent_he:
            "עדכון חדש\n\nניתוח השורש העלה שהבאג נובע ממודול תשלומים ישן שכבר תוכנן לשדרוג. תיקון מלא ידרוש כשבוע נוסף, אך תיקון חלקי לתרחיש הנפוץ ביותר אפשרי תוך יומיים.",
        },
        {
          key: "ship_with_workaround",
          label_he: "השקה במועד עם עקיפה זמנית",
          keywords_he: ["עקיפה זמנית", "לצאת עם תיקון זמני", "לעמוד בתאריך בכל מחיר"],
          deltas: { schedule: 2, tech_debt: 8, defect_rate: 3 },
          evidence_he: "בחר לעקוף את הבאג בפתרון זמני כדי לעמוד במועד ההשקה שכבר תוקשר.",
          criteriaSignals: { realism: 2, prioritization: 2 },
          nextEvent_he:
            "עדכון חדש\n\nההשקה יצאה במועד, אך מספר לקוחות כבר דיווחו על תשלומים שנכשלו בשקט, וצוות התמיכה מבקש הנחיה דחופה איך להגיב.",
        },
        {
          key: "delay_launch",
          label_he: "דחיית מועד ההשקה",
          keywords_he: ["לדחות השקה", "לעצור את ההשקה", "לא לעמוד בתאריך המקורי"],
          deltas: { schedule: -4, defect_rate: -3, tech_debt: -8 },
          evidence_he: "בחר לדחות את מועד ההשקה כדי לטפל בבאג באופן מלא לפני יציאה ללקוחות.",
          criteriaSignals: { knowing_when_to_stop: 4, realism: 3 },
        },
        {
          key: "pull_qa_from_other_team",
          label_he: "גיוס תגבור QA מצוות אחר",
          keywords_he: ["תגבור QA", "לשאול בודקים מצוות אחר", "כוח אדם נוסף לבדיקות"],
          deltas: { defect_rate: -2, schedule: 1, morale: -3 },
          evidence_he: "גייס תגבור בדיקות מצוות מוצר אחר כדי להאיץ את האימות.",
          criteriaSignals: { workload_management: 2, prioritization: 3 },
        },
        {
          key: "alert_sales_early",
          label_he: "עדכון מוקדם לצוות המכירות על הסיכון",
          keywords_he: ["לעדכן מכירות", "ליידע מראש", "שקיפות מול מכירות"],
          deltas: {},
          evidence_he: "עדכן את צוות המכירות על הסיכון בטרם התקבלה החלטה סופית על מועד ההשקה.",
          criteriaSignals: { communication: 4, information_acquisition: 2 },
        },
      ],
    },
    {
      index: 2,
      situation_he:
        "ההחלטה שהתקבלה השפיעה על מסלול הפרויקט. צוות הפיתוח ממתין להנחיה ברורה להמשך, ונציג הלקוח המרכזי מבקש עדכון סטטוס.",
      event_he:
        "עדכון חדש\n\nבמהלך הבדיקות הנוספות התגלה שהבאג משפיע גם על תרחיש תשלום שני, שלא זוהה בבדיקה הראשונית.",
      constraints_he: ["חלון החלטה קצר", "מידע חלקי על היקף ההשפעה המלא"],
      availableIntel: [
        { label_he: "היקף הלקוחות שנחשפו לבאג בפועל", cost: 2, accuracy: 85 },
        { label_he: "הערכת מאמץ מהנדס לתיקון שורשי מול עקיפה", cost: 2, accuracy: 75 },
        { label_he: "סקירת דיווחי תמיכה מהשבועיים האחרונים", cost: 1, accuracy: 90 },
      ],
      decisionPrompt_he: "מה עכשיו?",
      options: [
        {
          key: "full_fix_before_ship",
          label_he: "השלמת תיקון מלא לפני יציאה",
          keywords_he: ["תיקון מלא", "לא לצאת בלי תיקון שלם", "לסגור את הבאג לגמרי"],
          deltas: { schedule: -2, defect_rate: -4, tech_debt: -5 },
          evidence_he: "בחר להשלים תיקון מלא לשני תרחישי התשלום לפני היציאה ללקוחות.",
          criteriaSignals: { realism: 4, diagnosis_before_action: 3 },
        },
        {
          key: "scope_down_feature",
          label_he: "צמצום היקף הפיצ'ר להשקה חלקית",
          keywords_he: ["צמצום היקף", "השקה חלקית", "להוציא רק חלק מהיכולת"],
          deltas: { schedule: 2, defect_rate: -2 },
          evidence_he: "צמצם את היקף הפיצ'ר המושק כדי להימנע מהתרחיש הבעייתי בשלב זה.",
          criteriaSignals: { prioritization: 4, realism: 2 },
        },
        {
          key: "escalate_to_director",
          label_he: "העלאת הנושא לדירקטור המוצר",
          keywords_he: ["להעלות להנהלה", "לעדכן דירקטור", "לבקש החלטה מלמעלה"],
          deltas: {},
          evidence_he: "העלה את הסוגיה לדירקטור המוצר לפני קבלת החלטה בלתי הפיכה.",
          criteriaSignals: { communication: 3, knowing_when_to_stop: 3 },
        },
        {
          key: "commit_new_date_to_customer",
          label_he: "מסירת תאריך חדש ומחייב ללקוח",
          keywords_he: ["תאריך חדש", "התחייבות ללקוח", "לסגור תאריך סופי"],
          deltas: { schedule: 1, defect_rate: 1 },
          evidence_he: "מסר ללקוח תאריך חדש ומחייב מבלי לוודא שהתיקון לתרחיש השני הושלם.",
          criteriaSignals: { realism: 1, communication: 2, diagnosis_before_action: 1 },
        },
      ],
    },
    {
      index: 3,
      situation_he:
        "צוות הפיתוח עובד שעות נוספות כבר מעל שבוע כדי לעמוד בלוח הזמנים המתוקן. אחד המפתחים הבכירים, שמכיר את מודול התשלומים הישן טוב מכל אחד אחר בצוות, יוצא לחופשה משפחתית שתוכננה מראש.",
      event_he:
        "עדכון חדש\n\nראש הצוות הטכני מתריע כי אם הידע על התיקון לא יתועד לפני יציאת המפתח הבכיר לחופשה, כל תקלה נוספת עלולה להיתקע.",
      constraints_he: ["צוות מצומצם ועייף", "חלון זמן קצר לפני יציאת המפתח הבכיר לחופשה"],
      decisionPrompt_he: "איך תנהלו את הצוות והידע בשלב הזה?",
      options: [
        {
          key: "document_before_leave",
          label_he: "תיעוד הידע הקריטי לפני היציאה לחופשה",
          keywords_he: ["לתעד ידע", "תיעוד לפני חופשה", "גיבוי ידע קריטי"],
          deltas: {},
          evidence_he: "דאג לתעד את הידע הקריטי על מודול התשלומים לפני יציאת המפתח הבכיר לחופשה.",
          criteriaSignals: { knowledge_protection: 5 },
          nextEvent_he:
            "עדכון חדש\n\nהתיעוד שהוכן לפני היציאה לחופשה עבד: כשעלתה שאלה על מודול התשלומים, מפתחת אחרת מהצוות הצליחה לענות עליה תוך דקות.",
        },
        {
          key: "cancel_vacation_request",
          label_he: "בקשה לדחות את החופשה",
          keywords_he: ["לבטל חופשה", "לדחות יציאה לחופשה", "לבקש להישאר"],
          deltas: { morale: -4, schedule: 1 },
          evidence_he: "ביקש מהמפתח הבכיר לדחות את חופשתו המתוכננת כדי להבטיח כיסוי.",
          criteriaSignals: { realism: 1, communication: 2, diagnosis_before_action: 1 },
        },
        {
          key: "redistribute_workload",
          label_he: "חלוקה מחדש של העומס בצוות",
          keywords_he: ["לחלק מחדש עומס", "לאזן עומס", "לפזר משימות בצוות"],
          deltas: { morale: 3 },
          evidence_he: "חילק מחדש את העומס בצוות לאחר שזוהו סימני עייפות מתמשכת.",
          criteriaSignals: { workload_management: 4 },
        },
        {
          key: "push_through_no_change",
          label_he: "המשך לפי התוכנית הקיימת ללא שינוי",
          keywords_he: ["להמשיך כרגיל", "לא לשנות כלום", "להתקדם כמתוכנן"],
          deltas: { morale: -3 },
          evidence_he: "בחר להמשיך לפי התוכנית הקיימת ללא התאמה לעומס ולסיכון בידע שדווחו.",
          criteriaSignals: { realism: 2, workload_management: 1, knowledge_protection: 1 },
          nextEvent_he:
            "עדכון חדש\n\nהעומס גבה מחיר: באג נוסף התגלה בבדיקות הרגרסיה בגלל תשומת לב שהתפזרה בין יותר מדי משימות במקביל. מועד ההשקה בסיכון נוסף.",
        },
      ],
    },
    {
      index: 4,
      situation_he:
        "המוצר קרוב ליציאה בתאריך המתוקן. רוב הסיכונים טופלו, ונותר שלב אחרון של סיכום לפני האישור הסופי.",
      event_he:
        "עדכון חדש\n\nמנהל המוצר הבכיר מבקש מכם תדריך קצר על מצב הפרויקט לפני מתן האישור הסופי להשקה.",
      decisionPrompt_he: "איך תסכמו את מצב הפרויקט?",
      options: [
        {
          key: "transparent_status_report",
          label_he: "דיווח שקוף על מה שטופל ומה שנותר פתוח",
          keywords_he: ["דיווח שקוף", "לדווח על סיכונים שנותרו", "עדכון מלא"],
          deltas: {},
          evidence_he: "מסר דיווח שקוף שכלל גם את הסיכונים שעדיין לא טופלו במלואם.",
          criteriaSignals: { communication: 5, realism: 3 },
        },
        {
          key: "present_as_fully_resolved",
          label_he: "הצגת המצב כמטופל במלואו",
          keywords_he: ["הכל תקין", "לא להזכיר בעיות", "להציג כמוכן לגמרי"],
          deltas: { defect_rate: 1 },
          evidence_he: "הציג את מצב הפרויקט כמטופל במלואו, מעבר למה שהבדיקות תמכו בו.",
          criteriaSignals: { communication: 1, realism: 1 },
        },
        {
          key: "document_lessons_learned",
          label_he: "תיעוד לקחים לתהליכי שחרור עתידיים",
          keywords_he: ["תיעוד לקחים", "הפקת לקחים", "לתעד לפעם הבאה"],
          deltas: { tech_debt: -2 },
          evidence_he: "תיעד לקחים מהתהליך לטובת מחזורי שחרור עתידיים.",
          criteriaSignals: { diagnosis_before_action: 3, knowledge_protection: 3 },
        },
        {
          key: "propose_qa_process_change",
          label_he: "הצעת שינוי בתהליך הבדיקות לשחרורים הבאים",
          keywords_he: ["שינוי תהליך QA", "לשפר תהליך בדיקות", "מניעה לפעם הבאה"],
          deltas: { defect_rate: -1 },
          evidence_he: "הציע שינוי בתהליך הבדיקות כדי להפחית סיכון דומה בעתיד.",
          criteriaSignals: { diagnosis_before_action: 3, prioritization: 2 },
        },
      ],
    },
  ],
};

const vpScenario: Scenario = {
  id: "product-rd-vp-1",
  domainKey: "product-rd",
  title_he: "פגם בקנה מידה בטכנולוגיית הליבה",
  roleLevel: "vp",
  difficulty: 4,
  summary_he:
    "שלושה רבעונים לתוך מפת דרכים אסטרטגית, מתגלה שהטכנולוגיה שבבסיס הפיצ'ר הדגל אינה עומדת בקנה המידה הנדרש. מכירות כבר התחייבו ללקוחות אסטרטגיים, והתחרות אינה ממתינה.",
  estimatedMinutes: [25, 35],
  kpis: [
    { key: "schedule", label_he: "לוח זמנים אסטרטגי", unit: "רבעון", start: 0, min: -4, max: 4, higherIsBetter: true },
    { key: "defect_rate", label_he: "פגמים בסביבת קנה מידה", unit: "%", start: 8, min: 0, max: 40, higherIsBetter: false },
    { key: "tech_debt", label_he: "חוב טכני ארכיטקטוני", unit: "%", start: 42, min: 0, max: 100, higherIsBetter: false },
    { key: "morale", label_he: "מורל ארגון המוצר וההנדסה", unit: "%", start: 68, min: 0, max: 100, higherIsBetter: true },
  ],
  turns: [
    {
      index: 1,
      situation_he:
        "אתם אחראים על מפת הדרכים של המוצר הדגל, שנבנה סביב טכנולוגיית ליבה חדשה שפותחה מהיסוד לפני כשלושה רבעונים. צוות ההנדסה מדווח כי בבדיקות עומס ראשוניות בקנה מידה גדול, הארכיטקטורה מציגה סימני האטה חמורים מעבר לצפוי. הנתונים חלקיים - הבדיקות בוצעו על סביבה מדומה ולא על עומס אמיתי. במקביל, צוות המכירות כבר חתם על התחייבויות עם שלושה לקוחות אסטרטגיים לגבי מועד ותכולה, והדירקטוריון עוקב מקרוב אחרי ההתקדמות מול מתחרה שהכריזה לאחרונה על יכולת דומה.",
      constraints_he: [
        "נתונים חלקיים על חומרת הבעיה",
        "התחייבויות מכירה קיימות מול לקוחות אסטרטגיים",
        "לחץ תחרותי מצד מתחרה",
      ],
      availableIntel: [
        { label_he: "בדיקת עומס אמיתית ומבוקרת", cost: 3, accuracy: 92 },
        { label_he: "ניתוח ארכיטקטוני מקצה לקצה", cost: 4, accuracy: 85 },
        { label_he: "סקר סיכון מול שלושת הלקוחות המחויבים", cost: 2, accuracy: 70 },
      ],
      decisionPrompt_he: "מה הייתם עושים עכשיו?",
      options: [
        {
          key: "commission_real_load_test",
          label_he: "הזמנת בדיקת עומס אמיתית ומבוקרת",
          keywords_he: ["בדיקת עומס אמיתית", "לאמת את חומרת הבעיה", "לבדוק בתנאי אמת"],
          deltas: { schedule: -1 },
          evidence_he: "הזמין בדיקת עומס אמיתית ומבוקרת לפני קבלת החלטה אסטרטגית.",
          criteriaSignals: { diagnosis_before_action: 5, information_acquisition: 4 },
          nextEvent_he:
            "עדכון חדש\n\nבדיקת העומס האמיתית מאשרת שהבעיה חמורה יותר מהערכה הראשונית: הארכיטקטורה תומכת רק בכ-60% מהעומס הצפוי אצל הלקוח הגדול ביותר.",
        },
        {
          key: "proceed_as_planned",
          label_he: "המשך לפי מפת הדרכים המקורית ללא שינוי",
          keywords_he: ["להמשיך כמתוכנן", "לא לשנות תוכנית", "להתקדם ללא עצירה"],
          deltas: { schedule: 2, tech_debt: 5 },
          evidence_he: "בחר להמשיך לפי מפת הדרכים המקורית ללא בדיקה נוספת של חומרת הפגם.",
          criteriaSignals: { diagnosis_before_action: 1, prioritization: 1, realism: 2 },
          nextEvent_he:
            "עדכון חדש\n\nאחד הלקוחות האסטרטגיים ביצע בדיקת קבלה עצמאית וזיהה את בעיית הביצועים בעצמו, לפני שהצגתם את הנושא מיוזמתכם.",
        },
        {
          key: "brief_board_early_vp",
          label_he: "תדרוך מוקדם ושקוף לדירקטוריון",
          keywords_he: ["לעדכן דירקטוריון", "תדרוך מוקדם", "שקיפות כלפי ההנהלה"],
          deltas: {},
          evidence_he: "בחר לתדרך את הדירקטוריון מוקדם ובאופן שקוף, גם לפני שהתמונה הייתה מלאה.",
          criteriaSignals: { communication: 5, knowing_when_to_stop: 3 },
        },
        {
          key: "pause_sales_commitments",
          label_he: "עצירה זמנית של התחייבויות מכירה חדשות",
          keywords_he: ["לעצור התחייבויות מכירה", "להקפיא סגירות חדשות", "לא לחתום לקוחות נוספים"],
          deltas: { schedule: -1 },
          evidence_he: "ביקש לעצור זמנית התחייבויות מכירה חדשות עד להבהרת חומרת הפגם.",
          criteriaSignals: { knowing_when_to_stop: 4, realism: 3, financial_awareness: 2 },
        },
        {
          key: "architecture_deep_dive",
          label_he: "ניתוח ארכיטקטוני מקצה לקצה עם צוות ההנדסה",
          keywords_he: ["ניתוח ארכיטקטוני", "לבדוק את הארכיטקטורה לעומק", "לזהות את שורש הבעיה"],
          deltas: { tech_debt: -3 },
          evidence_he: "יזם ניתוח ארכיטקטוני מקצה לקצה עם צוות ההנדסה כדי להבין את שורש הבעיה.",
          criteriaSignals: { diagnosis_before_action: 4, information_acquisition: 3 },
        },
      ],
    },
    {
      index: 2,
      situation_he:
        "התמונה מתבהרת. חלק מהיקף הפגם כבר ידוע, אך עדיין לא ברור אם ניתן לפתור אותו בארכיטקטורה הקיימת או שנדרש שינוי מהותי. הלקוח האסטרטגי הגדול ביותר מבקש תשובה ברורה בתוך שבוע.",
      event_he:
        "עדכון חדש\n\nצוות ההנדסה מציג שתי חלופות: תיקון נקודתי שיאפשר עמידה חלקית בעומס תוך חודש, או שכתוב ארכיטקטוני שיימשך כרבעון אך יפתור את הבעיה במלואה.",
      constraints_he: ["לחץ לתשובה מהירה מהלקוח הגדול ביותר", "אי-ודאות לגבי היתכנות הפתרון הנקודתי"],
      availableIntel: [
        { label_he: "סקירה ארכיטקטונית עצמאית של היתכנות התיקון", cost: 3, accuracy: 85 },
        { label_he: "מיפוי כל המערכות התלויות ברכיב הפגום", cost: 2, accuracy: 90 },
        { label_he: "בדיקת התחייבויות חוזיות מול הלקוח האסטרטגי", cost: 2, accuracy: 95 },
      ],
      decisionPrompt_he: "מה הייתם עושים עכשיו?",
      options: [
        {
          key: "commit_to_partial_fix",
          label_he: "התחייבות לתיקון נקודתי בטווח קצר",
          keywords_he: ["תיקון נקודתי", "פתרון זמני", "לפתור חלקית בטווח קצר"],
          deltas: { schedule: 2, tech_debt: 6, defect_rate: 3 },
          evidence_he: "התחייב לתיקון נקודתי בטווח קצר כדי לענות ללחץ הלקוח.",
          criteriaSignals: { realism: 2, communication: 2 },
        },
        {
          key: "propose_architecture_rewrite",
          label_he: "הצעת שכתוב ארכיטקטוני מלא",
          keywords_he: ["שכתוב ארכיטקטוני", "פתרון יסודי", "לבנות מחדש את הליבה"],
          deltas: { schedule: -3, tech_debt: -15, defect_rate: -5 },
          evidence_he: "הציע שכתוב ארכיטקטוני מלא שיפתור את הבעיה ביסודה, גם במחיר עיכוב משמעותי.",
          criteriaSignals: { realism: 4, diagnosis_before_action: 3 },
        },
        {
          key: "conditional_transparent_commitment",
          label_he: "התחייבות מותנית ושקופה מול הלקוח הגדול",
          keywords_he: ["התחייבות מותנית", "לתקשר סיכון ללקוח", "שקיפות מול הלקוח"],
          deltas: {},
          evidence_he: "מסר ללקוח האסטרטגי התחייבות מפורשת עם הסתייגות ברורה לגבי הסיכון הנותר.",
          criteriaSignals: { communication: 5, realism: 4 },
        },
        {
          key: "unconditional_promise_to_client",
          label_he: "הבטחה מלאה ללא הסתייגות ללקוח",
          keywords_he: ["הבטחה מלאה", "לאשר תאריך סופי ללא תנאי", "התחייבות בלתי מסויגת"],
          deltas: { schedule: -2 },
          evidence_he: "התחייב ללקוח באופן מלא וללא הסתייגות, בטרם התבררה ההיתכנות הטכנית.",
          criteriaSignals: { realism: 1, communication: 2, diagnosis_before_action: 1 },
        },
        {
          key: "parallel_track_both_paths",
          label_he: "הרצת שני המסלולים במקביל עד קבלת החלטה סופית",
          keywords_he: ["שני מסלולים במקביל", "לא לבחור עדיין", "לבדוק את שתי החלופות"],
          deltas: { schedule: -1, morale: -1 },
          evidence_he: "בחר להריץ את שני המסלולים במקביל כדי לשמור על גמישות לפני החלטה סופית.",
          criteriaSignals: { knowing_when_to_stop: 3, prioritization: 2 },
        },
      ],
    },
    {
      index: 3,
      situation_he:
        "צוותי ההנדסה עובדים תחת לחץ ממושך כבר מספר שבועות. מובילת הצוות האחראית על שכבת הליבה, שמכירה את הפרטים הטכניים טוב מכל אחד אחר בארגון, מתריעה על סימני שחיקה ומבקשת פגישה דחופה.",
      event_he:
        "עדכון חדש\n\nבמקביל, סמנכ\"ל המכירות מבקש הבהרה מיידית לגבי מה בדיוק ניתן להבטיח ללקוחות נוספים שמתעניינים באותה יכולת.",
      constraints_he: ["ריבוי בעלי עניין עם אינטרסים שונים", "סימני שחיקה בצוות ליבת המוצר"],
      decisionPrompt_he: "איך תנהלו את הצוות ואת בעלי העניין בשלב הזה?",
      options: [
        {
          key: "structured_briefing_all_stakeholders",
          label_he: "תדרוך מובנה ואחיד לכל בעלי העניין",
          keywords_he: ["תדרוך מובנה", "מסר אחיד לכולם", "ליישר קו בין בעלי עניין"],
          deltas: {},
          evidence_he: "מסר תדרוך מובנה ואחיד למכירות, להנדסה ולהנהלה, כדי למנוע מסרים סותרים.",
          criteriaSignals: { communication: 5, prioritization: 2 },
        },
        {
          key: "protect_core_team_bandwidth",
          label_he: "הגנה על זמן הצוות המרכזי מפני פניות נוספות",
          keywords_he: ["להגן על זמן הצוות", "לחסום פניות נוספות", "לצמצם הפרעות לצוות הליבה"],
          deltas: { morale: 4 },
          evidence_he: "פעל לחסום פניות נוספות אל צוות הליבה כדי להגן על יכולתו להתמקד בפתרון.",
          criteriaSignals: { workload_management: 4 },
        },
        {
          key: "document_architecture_knowledge",
          label_he: "תיעוד שיטתי של הידע הארכיטקטוני הקריטי",
          keywords_he: ["לתעד ידע ארכיטקטוני", "תיעוד ידע קריטי", "גיבוי ידע של מובילת הצוות"],
          deltas: {},
          evidence_he: "יזם תיעוד שיטתי של הידע הארכיטקטוני שמרוכז אצל מובילת צוות הליבה.",
          criteriaSignals: { knowledge_protection: 5 },
          nextEvent_he:
            "עדכון חדש\n\nהתיעוד הארכיטקטוני שיזמתם מאפשר לצוות שלם, לא רק למובילת הליבה, להשתתף בהחלטה הסופית על מפת הדרכים.",
        },
        {
          key: "keep_all_updates_centralized_vp",
          label_he: "ריכוז כל העדכונים דרככם באופן בלעדי",
          keywords_he: ["לרכז הכל דרכי", "לא להאציל עדכונים", "כל התקשורת עוברת דרכי"],
          deltas: { morale: -2 },
          evidence_he: "בחר לרכז את כל העדכונים לבעלי העניין דרכו באופן בלעדי, ללא האצלה.",
          criteriaSignals: { workload_management: 1, knowledge_protection: 1, communication: 2 },
          nextEvent_he:
            "עדכון חדש\n\nריכוז העדכונים דרככם יצר צוואר בקבוק: שני צוותים קיבלו הנחיות סותרות כי לא הייתה להם גישה ישירה למידע העדכני, ונדרש תיאום מאסיבי לפני המצג לדירקטוריון.",
        },
      ],
    },
    {
      index: 4,
      situation_he:
        "המהלך מתקרב להכרעה. חלק מהיעדים המקוריים של מפת הדרכים לא יושגו במועד המקורי, וחלקם כן. יו\"ר הדירקטוריון מבקש סיכום אחד שיכלול גם את ההשלכות על שלושת הרבעונים הקרובים.",
      event_he:
        "עדכון חדש\n\nמנכ\"לית החברה מבקשת ממכם להציג בפני הדירקטוריון לא רק את מה שקרה, אלא גם המלצה לגבי מדיניות פיתוח הליבה קדימה.",
      decisionPrompt_he: "איך תבנו את הסיכום וההמלצה לדירקטוריון?",
      options: [
        {
          key: "full_transparency_forward_plan_vp",
          label_he: "סיכום שקוף הכולל תוכנית קדימה מוגדרת",
          keywords_he: ["סיכום שקוף", "תוכנית קדימה", "מה נלמד ומה הצעד הבא"],
          deltas: {},
          evidence_he: "בנה סיכום שקוף לדירקטוריון שכלל תוכנית פעולה מוגדרת לרבעונים הקרובים, לא רק דיווח על מה שקרה.",
          criteriaSignals: { communication: 5, realism: 4 },
        },
        {
          key: "minimize_visible_impact_vp",
          label_he: "הצגת ההשפעה כמינימלית ככל האפשר",
          keywords_he: ["למזער את הדיווח", "להציג כבעיה קטנה", "לא להדגיש את ההשפעה"],
          deltas: {},
          evidence_he: "בחר להציג את ההשפעה כמינימלית מול הדירקטוריון, מעבר למה שהנתונים תמכו בו.",
          criteriaSignals: { communication: 1, realism: 1 },
        },
        {
          key: "propose_core_tech_governance",
          label_he: "הצעת מדיניות ממשל טכנולוגי חדשה לליבת המוצר",
          keywords_he: ["ממשל טכנולוגי", "מדיניות פיתוח ליבה", "בקרת סיכונים ארכיטקטוניים"],
          deltas: { tech_debt: -5 },
          evidence_he: "הציע מדיניות ממשל טכנולוגי חדשה לבדיקת קנה מידה בשלבים מוקדמים יותר של פיתוח ליבה.",
          criteriaSignals: { diagnosis_before_action: 4, realism: 3 },
        },
        {
          key: "recommend_pause_new_core_bets",
          label_he: "המלצה לעצור התחייבויות אסטרטגיות חדשות עד לייצוב הליבה",
          keywords_he: ["לעצור התחייבויות חדשות", "לייצב לפני התרחבות", "לא להתחייב לעוד עד שהליבה יציבה"],
          deltas: { schedule: -1 },
          evidence_he: "המליץ לעצור התחייבויות אסטרטגיות חדשות סביב הטכנולוגיה עד לייצוב מלא.",
          criteriaSignals: { knowing_when_to_stop: 4, prioritization: 2 },
        },
      ],
    },
  ],
};

const scenarios: Scenario[] = [managerScenario, vpScenario];
export default scenarios;
