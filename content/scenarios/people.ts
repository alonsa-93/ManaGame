import type { Scenario } from "@/lib/scenario-schema";

/**
 * People & HR Leadership domain (domainKey: "people").
 * Follows the reference shape defined in content/scenarios/supply-chain.ts:
 * a KPI set (max 4, per Master Spec §11), 4 turns, and a canonical action
 * vocabulary per turn with keyword hints, deltas, evidence text and
 * criteria signals (from the fixed CRITERIA list in lib/scenario-schema.ts).
 */

const managerKpis: Scenario["kpis"] = [
  { key: "morale", label_he: "מורל הצוות", unit: "%", start: 72, min: 0, max: 100, higherIsBetter: true },
  { key: "attrition_risk", label_he: "סיכון עזיבה - עובד מפתח", unit: "%", start: 35, min: 0, max: 100, higherIsBetter: false },
  { key: "workload", label_he: "סיכון שחיקה בצוות", unit: "%", start: 55, min: 0, max: 100, higherIsBetter: false },
  { key: "org_trust", label_he: "אמון בניהול הישיר", unit: "%", start: 80, min: 0, max: 100, higherIsBetter: true },
];

const managerScenario: Scenario = {
  id: "people-manager-1",
  domainKey: "people",
  title_he: "איתות עזיבה של עובדת מפתח בצוות עמוס",
  roleLevel: "manager",
  difficulty: 2,
  summary_he:
    "עובדת מפתח מגלה סימני ריחוק אפשריים לקראת עזיבה, בעוד הצוות סובל מעומס גובר בעקבות איוש חסר, ומתפתחת מתיחות בין שני חברי צוות סביב חלוקת אחריות.",
  estimatedMinutes: [20, 30],
  kpis: managerKpis,
  turns: [
    {
      index: 1,
      situation_he:
        "אתם מנהלים צוות של שמונה אנשים. בשבועיים האחרונים שמתם לב שדנה, אחת העובדות המובילות בצוות ומי שמחזיקה חלק ניכר מהידע התפעולי הקריטי, פחות פעילה בדיונים ודחתה בנימוס הצעה להוביל פרויקט חדש. במקביל, מאז שעמית עזב את הצוות לפני חודש והתקן טרם אויש, שאר הצוות עובד בעומס גבוה מהרגיל. לצד זאת, יוסי ורותם, שאמורים לחלוק אחריות משותפת על משימה, החליפו לאחרונה מיילים חדים בנוגע לחלוקת העבודה ביניהם.",
      constraints_he: [
        "אין עדיין מידע ישיר על כוונותיה של דנה",
        "התקן שהתפנה טרם אויש",
        "משאבי אנוש עדיין לא מעורבים בתמונה",
      ],
      availableIntel: [
        { label_he: "תוצאות סקר מעורבות אחרון", cost: 1, accuracy: 70 },
        { label_he: "מגמות מראיונות עזיבה מהרבעון הקודם", cost: 2, accuracy: 80 },
        { label_he: "בנצ'מארק שכר לתפקיד מול השוק", cost: 2, accuracy: 85 },
      ],
      decisionPrompt_he: "מה היית עושה עכשיו?",
      options: [
        {
          key: "schedule_1on1_with_key_employee",
          label_he: "שיחת 1:1 ישירה עם דנה",
          keywords_he: ["שיחה אישית עם דנה", "1:1 עם דנה", "לשוחח איתה על המצב"],
          deltas: { attrition_risk: -3, org_trust: 2 },
          evidence_he: "יזם שיחת 1:1 ישירה עם העובדת שהראתה סימני ריחוק, לפני שהתמונה התבררה במלואה.",
          criteriaSignals: { information_acquisition: 4, communication: 3 },
          nextEvent_he:
            "עדכון חדש\n\nבשיחה דנה שיתפה שגייס חיצוני פנה אליה, אך הדגישה שעדיין לא החליטה דבר. היא ציינה גם שהיא מרגישה שאין לה מספיק תחושת התקדמות בתפקיד בזמן האחרון.",
        },
        {
          key: "review_comp_benchmark",
          label_he: "בדיקת בנצ'מארק שכר מול השוק",
          keywords_he: ["בדיקת שכר מול השוק", "בנצ'מארק שכר", "להשוות שכר לשוק"],
          deltas: { attrition_risk: -1 },
          evidence_he: "בדק נתוני שכר מול השוק לתפקיד לפני שגיבש מסקנות לגבי הסיכון.",
          criteriaSignals: { financial_awareness: 3, information_acquisition: 3 },
        },
        {
          key: "redistribute_workload_now",
          label_he: "חלוקה מחדש של העומס בצוות",
          keywords_he: ["לחלק מחדש עומס", "להקל על הצוות", "לאזן משימות בין אנשים"],
          deltas: { workload: -8, morale: 3 },
          evidence_he: "חילק מחדש את העומס בצוות לאחר שזוהתה עלייה בעומס בעקבות התקן הפנוי.",
          criteriaSignals: { workload_management: 4 },
        },
        {
          key: "mediate_conflict_directly",
          label_he: "גישור ישיר בין יוסי לרותם",
          keywords_he: ["לגשר בין השניים", "לשוחח עם שניהם יחד", "לפתור את חילופי המיילים"],
          deltas: { morale: 2, org_trust: 1 },
          evidence_he: "יזם שיחה משותפת עם שני חברי הצוות שבהתכתבותם עלתה מתיחות.",
          criteriaSignals: { communication: 4, diagnosis_before_action: 2 },
        },
        {
          key: "wait_and_monitor",
          label_he: "המתנה ומעקב לפני נקיטת פעולה",
          keywords_he: ["להמתין ולבדוק", "לא לפעול עדיין", "לראות איך זה מתפתח"],
          deltas: { attrition_risk: 4, workload: 3 },
          evidence_he: "בחר להמתין ולעקוב אחרי ההתפתחויות לפני נקיטת פעולה כלשהי.",
          criteriaSignals: {},
        },
      ],
    },
    {
      index: 2,
      situation_he:
        "השבוע ממשיך להיות טעון. המתיחות בין יוסי לרותם עדיין לא נפתרה במלואה, והעומס בצוות נשאר גבוה מהרגיל.",
      event_he:
        "עדכון חדש\n\nדנה ביקשה לקבוע שיחת המשך בהקדם. במקביל, יוסי פנה אליכם בכתב עם תלונה קצרה על חלוקת המשימות מול רותם.",
      constraints_he: ["חלון זמן קצר לפני שהמתיחות משפיעה על התוצרים", "מידע חלקי על כוונותיה הסופיות של דנה"],
      decisionPrompt_he: "איך תמשיכו מכאן?",
      options: [
        {
          key: "growth_path_conversation",
          label_he: "שיחת פיתוח קריירה עם דנה",
          keywords_he: ["שיחת פיתוח קריירה", "להציע מסלול צמיחה", "לדבר על עתיד בתפקיד"],
          deltas: { attrition_risk: -6, morale: 3 },
          evidence_he: "קיים שיחה ממוקדת בפיתוח ובתחושת ההתקדמות של דנה בתפקיד, בהתאם למה שעלה בשיחה הקודמת.",
          criteriaSignals: { communication: 4, diagnosis_before_action: 3 },
        },
        {
          key: "escalate_to_hrbp",
          label_he: "שיתוף שותף/ת משאבי אנוש",
          keywords_he: ["לערב את משאבי אנוש", "לשתף HRBP", "להביא גורם מקצועי לתמונה"],
          deltas: { org_trust: 2, attrition_risk: -3 },
          evidence_he: "שיתף את שותף משאבי האנוש בתמונת המצב לפני שהמשיך לפעול לבד.",
          criteriaSignals: { communication: 3, knowledge_protection: 2 },
        },
        {
          key: "formal_mediation_session",
          label_he: "מפגש גישור פורמלי בין יוסי לרותם",
          keywords_he: ["מפגש גישור פורמלי", "ישיבה משותפת עם כללים", "לפתור את הסכסוך רשמית"],
          deltas: { morale: 4, workload: -1 },
          evidence_he: "יזם מפגש גישור פורמלי עם כללי שיחה מוסכמים, במקום להשאיר את הפתרון לא רשמי.",
          criteriaSignals: { communication: 4, prioritization: 2 },
          nextEvent_he:
            "עדכון חדש\n\nהגישור הרגיע את המתיחות בטווח המיידי, אך העלה נושא עומק: חלוקת האחריות בין יוסי לרותם מעולם לא הוגדרה בבירור בכתב.",
        },
        {
          key: "quick_fix_reassign_task",
          label_he: "העברת המשימה השנויה במחלוקת לגורם אחר",
          keywords_he: ["להעביר את המשימה לאדם אחר", "פתרון מהיר לסכסוך", "לעקוף את הבעיה בינתיים"],
          deltas: { morale: -1, workload: 1 },
          evidence_he: "העביר את המשימה השנויה במחלוקת לאדם נוסף, מבלי לטפל בשורש המתיחות.",
          criteriaSignals: {},
        },
        {
          key: "postpone_review",
          label_he: "דחיית הטיפול לטובת מסירה דחופה",
          keywords_he: ["לדחות את הטיפול", "להתמקד קודם במסירה", "לא כרגע, יש עדיפות אחרת"],
          deltas: { attrition_risk: 5 },
          evidence_he: "דחה את הטיפול בנושאי הצוות לטובת מסירה דחופה אחרת.",
          criteriaSignals: {},
        },
      ],
    },
    {
      index: 3,
      situation_he:
        "הצוות נמצא בשבוע השלישי של עומס מוגבר. אחד מחברי הצוות, שאינו מעורב בסכסוך, שיתף בפרטיות שהוא שוקל לקחת ימי מחלה בשל תשישות. במקביל, חלק ניכר מהידע התפעולי הקריטי של הצוות עדיין מרוכז אצל דנה בלבד.",
      event_he:
        "עדכון חדש\n\nמנהל/ת משאבי האנוש הכללי מבקש/ת מכם תמונת מצב מסודרת על הצוות, כולל תוכנית פעולה לטיפול בעומס ובסיכון העזיבה.",
      constraints_he: ["צוות מצומצם מאז עזיבת עמית", "ריכוז ידע קריטי אצל עובדת אחת"],
      decisionPrompt_he: "איך תנהלו את הצוות בשלב הזה?",
      options: [
        {
          key: "document_critical_knowledge",
          label_he: "תיעוד הידע הקריטי שמרוכז אצל דנה",
          keywords_he: ["לתעד ידע קריטי", "גיבוי ידע של דנה", "להעביר ידע לצוות"],
          deltas: {},
          evidence_he: "יזם תיעוד שיטתי של הידע התפעולי הקריטי שהיה מרוכז אצל עובדת בודדת.",
          criteriaSignals: { knowledge_protection: 5 },
        },
        {
          key: "redistribute_and_set_boundaries",
          label_he: "ארגון מחדש של העומס וקביעת גבולות ברורים",
          keywords_he: ["לקבוע גבולות עומס", "לארגן מחדש את העבודה", "למנוע שחיקה בצוות"],
          deltas: { workload: -10, morale: 3 },
          evidence_he: "ארגן מחדש את חלוקת העבודה וקבע גבולות ברורים לצמצום סיכון השחיקה שדווח.",
          criteriaSignals: { workload_management: 5 },
        },
        {
          key: "clarify_roles_after_mediation",
          label_he: "הבהרת תחומי אחריות בין יוסי לרותם בכתב",
          keywords_he: ["להבהיר תחומי אחריות", "להגדיר תפקידים מחדש", "לסגור את נושא החלוקה בכתב"],
          deltas: { morale: 2, org_trust: 2 },
          evidence_he: "הבהיר בכתב את תחומי האחריות של יוסי ורותם, בהמשך לפער שעלה בגישור.",
          criteriaSignals: { diagnosis_before_action: 3, communication: 2 },
        },
        {
          key: "prioritize_deliverable_over_burnout",
          label_he: "עדיפות למסירה הדחופה על פני הטיפול בעומס",
          keywords_he: ["להתמקד במסירה קודם", "לדחות טיפול בעומס", "להתקדם לפי התוכנית הקיימת"],
          deltas: { workload: 5, attrition_risk: 3 },
          evidence_he: "בחר להעדיף את המסירה הדחופה על פני טיפול מיידי בסימני העומס שדווחו.",
          criteriaSignals: {},
        },
        {
          key: "bring_temp_backfill",
          label_he: "הבאת תגבור זמני לצוות",
          keywords_he: ["תגבור זמני לצוות", "להביא כוח אדם נוסף", "למלא את התקן החסר באופן זמני"],
          deltas: { workload: -6 },
          evidence_he: "הביא תגבור זמני לצוות לצמצום העומס עד לאיוש התקן הפנוי.",
          criteriaSignals: { workload_management: 3, financial_awareness: 2 },
        },
      ],
    },
    {
      index: 4,
      situation_he:
        "אתם מתקרבים לסיום הרבעון. דנה הודיעה שהיא נשארת בצוות בשלב זה, אך המצב עדיין שברירי. לפניכם הזדמנות לסכם את התקופה מול הצוות ומול ההנהלה.",
      event_he:
        "עדכון חדש\n\nהמנהל/ת הישיר/ה שלכם מבקש/ת סיכום קצר על מה שנלמד בתקופה האחרונה ועל הצעדים למניעת הישנות המצב.",
      decisionPrompt_he: "איך תסכמו את התקופה?",
      options: [
        {
          key: "transparent_team_update",
          label_he: "עדכון שקוף לצוות על השינויים שנעשו",
          keywords_he: ["עדכון שקוף לצוות", "לשתף את הצוות בשינויים", "תקשורת פתוחה על מה שהשתנה"],
          deltas: { org_trust: 3, morale: 2 },
          evidence_he: "מסר לצוות עדכון שקוף על השינויים בחלוקת העבודה ובתחומי האחריות, ללא חשיפת פרטים אישיים.",
          criteriaSignals: { communication: 5 },
        },
        {
          key: "document_retention_playbook",
          label_he: "תיעוד לקחים לנוהל שימור עתידי",
          keywords_he: ["לתעד תובנות לעתיד", "בניית נוהל שימור עובדים", "לקחים לצוות הבא"],
          deltas: {},
          evidence_he: "תיעד את הלקחים מהתקופה לטובת נוהל שימור עתידי בצוות.",
          criteriaSignals: { knowledge_protection: 3, diagnosis_before_action: 2 },
        },
        {
          key: "quiet_close_no_followup",
          label_he: "סגירת הנושא בשקט ללא מעקב המשך",
          keywords_he: ["לסגור בשקט", "לא לתקשר יותר על זה", "להמשיך הלאה בלי לדבר"],
          deltas: { org_trust: -2 },
          evidence_he: "בחר לסגור את הנושא בשקט, ללא עדכון המשך לצוות או להנהלה.",
          criteriaSignals: {},
        },
        {
          key: "schedule_followup_checkins",
          label_he: "קביעת מעקב שוטף לחודש הקרוב",
          keywords_he: ["לתאם מעקב", "פגישות המשך", "לבדוק שוב בעוד חודש"],
          deltas: { attrition_risk: -3, org_trust: 1 },
          evidence_he: "קבע מעקב שוטף עם דנה ועם הצוות לחודש הקרוב.",
          criteriaSignals: { workload_management: 2, communication: 2 },
        },
      ],
    },
  ],
};

const vpKpis: Scenario["kpis"] = [
  { key: "morale", label_he: "מעורבות בפונקציה הקריטית", unit: "%", start: 68, min: 0, max: 100, higherIsBetter: true },
  { key: "attrition_risk", label_he: "סיכון עזיבה בפונקציה קריטית", unit: "%", start: 42, min: 0, max: 100, higherIsBetter: false },
  { key: "workload", label_he: "סיכון שחיקה טרום אבן דרך", unit: "%", start: 60, min: 0, max: 100, higherIsBetter: false },
  { key: "org_trust", label_he: "אמון ארגוני בתהליך", unit: "%", start: 65, min: 0, max: 100, higherIsBetter: true },
];

const vpScenario: Scenario = {
  id: "people-vp-1",
  domainKey: "people",
  title_he: "סיכון עזיבה רחב בפונקציה קריטית לקראת אבן דרך",
  roleLevel: "vp",
  difficulty: 4,
  summary_he:
    "עלייה בסיכון עזיבה בפונקציה הנדסית קריטית לפני אבן דרך אספקה מרכזית, על רקע נתוני סקר מעורבות חלקיים ושיחה רגישה על שינוי מבני אפשרי שטרם הוצגה לעובדים.",
  estimatedMinutes: [25, 35],
  kpis: vpKpis,
  turns: [
    {
      index: 1,
      situation_he:
        "אתם סמנכ\"ל משאבי אנוש. שמונה שבועות לפני אבן דרך אספקה מרכזית, מצטברים איתותים על עלייה בסיכון עזיבה בקרב הפונקציה ההנדסית שקריטית לפרויקט. נתוני סקר המעורבות האחרון חלקיים בלבד — כ-60% מהעובדים בפונקציה השיבו. במקביל, מתגבשת ברמת ההנהלה שיחה רגישה על שינוי מבני אפשרי ביחידה, שטרם הוצגה לעובדים.",
      constraints_he: [
        "נתוני סקר מעורבות חלקיים (כ-60% תגובה)",
        "שיחת מבנה ארגוני רגישה טרם גובשה סופית",
        "לוח זמנים הדוק לאבן הדרך",
      ],
      availableIntel: [
        { label_he: "ניתוח פערי תגובה בסקר המעורבות", cost: 2, accuracy: 75 },
        { label_he: "ראיונות עזיבה מהרבעון האחרון", cost: 2, accuracy: 85 },
        { label_he: "מיפוי סיכון עזיבה לפי צוות", cost: 4, accuracy: 90 },
      ],
      decisionPrompt_he: "מה הייתם עושים עכשיו?",
      options: [
        {
          key: "commission_risk_mapping",
          label_he: "הזמנת מיפוי מובנה של סיכון עזיבה לפי צוות",
          keywords_he: ["מיפוי סיכון עזיבה", "ניתוח לפי צוות", "בדיקה מובנית של הפונקציה"],
          deltas: {},
          evidence_he: "הזמין מיפוי מובנה של סיכון העזיבה לפי צוות, לפני נקיטת צעדים רחבים בפונקציה כולה.",
          criteriaSignals: { diagnosis_before_action: 5, information_acquisition: 4 },
          nextEvent_he:
            "עדכון חדש\n\nהמיפוי מראה שהסיכון מרוכז בעיקר בשני צוותים ליבתיים בפונקציה, ולא מתפזר באופן אחיד על פני היחידה כולה.",
        },
        {
          key: "pause_restructuring_talk",
          label_he: "עצירה זמנית של שיחת השינוי המבני",
          keywords_he: ["לעצור את שיחת המבנה", "לדחות את הדיון הארגוני", "להמתין עם השינוי המבני"],
          deltas: { org_trust: 2, attrition_risk: -2 },
          evidence_he: "בחר לעצור זמנית את גיבוש השינוי המבני עד שהתמונה על סיכון העזיבה תהיה ברורה יותר.",
          criteriaSignals: { knowing_when_to_stop: 4, realism: 2 },
        },
        {
          key: "brief_ceo_early",
          label_he: "תדרוך מוקדם ושקוף למנכ\"לית",
          keywords_he: ["לתדרך את המנכ\"לית", "שקיפות מול ההנהלה", "לעדכן מוקדם למרות מידע חלקי"],
          deltas: { org_trust: 1 },
          evidence_he: "תדרך את המנכ\"לית מוקדם ובאופן שקוף על הסיכון המתהווה, על אף שהתמונה עדיין לא הייתה מלאה.",
          criteriaSignals: { communication: 5 },
        },
        {
          key: "launch_targeted_pulse_survey",
          label_he: "השקת סקר פולס ממוקד לפונקציה",
          keywords_he: ["סקר פולס ממוקד", "להשלים פערי נתונים", "סקר קצר נוסף לפונקציה"],
          deltas: {},
          evidence_he: "השיק סקר פולס ממוקד כדי לסגור את פער הנתונים בסקר המעורבות המקורי.",
          criteriaSignals: { information_acquisition: 4, diagnosis_before_action: 2 },
        },
        {
          key: "announce_retention_bonus_immediately",
          label_he: "הכרזה מיידית על בונוס שימור רוחבי",
          keywords_he: ["בונוס שימור מיידי", "להכריז על תגמול לכולם", "מענק שימור רוחבי לפונקציה"],
          deltas: { attrition_risk: -4, org_trust: -1 },
          evidence_he: "הכריז על בונוס שימור רוחבי לכלל הפונקציה מיד, ללא אבחון מוקדם של מוקדי הסיכון.",
          criteriaSignals: {},
        },
      ],
    },
    {
      index: 2,
      situation_he:
        "בעקבות הפעולות הראשוניות, התמונה מתחילה להתבהר, אך הלחץ לקראת אבן הדרך גובר. חלק ממנהלי הצוותים בפונקציה הקריטית מדווחים על תסכול גובר סביב חוסר בהירות בנוגע לשינוי המבני האפשרי.",
      event_he:
        "עדכון חדש\n\nשמועה על השינוי המבני האפשרי דלפה בתוך הפונקציה, ומספר מנהלים בכירים מבקשים תשובות ברורות בתוך ימים ספורים.",
      constraints_he: ["השינוי המבני עדיין לא סגור סופית ברמת ההנהלה", "חלון תגובה קצר לפני שהשמועה מתפשטת עוד"],
      decisionPrompt_he: "מה הייתם עושים עכשיו?",
      options: [
        {
          key: "controlled_disclosure_to_managers",
          label_he: "גילוי מבוקר וכן למנהלי הצוותים",
          keywords_he: ["גילוי מבוקר למנהלים", "לשתף מה ידוע ומה לא", "תקשורת כנה על השמועה"],
          deltas: { org_trust: 4, attrition_risk: -2 },
          evidence_he: "מסר למנהלי הצוותים גילוי מבוקר וכן על מה שידוע ומה שעדיין לא סגור, לפני שהשמועה התפשטה עוד.",
          criteriaSignals: { communication: 5, realism: 3 },
          nextEvent_he:
            "עדכון חדש\n\nהגילוי המבוקר הרגיע חלק מהמנהלים, אך אחד מהם מבקש כעת התחייבות ברורה יותר ללוחות הזמנים של ההחלטה — התחייבות שעדיין אינה זמינה.",
        },
        {
          key: "deny_and_reassure",
          label_he: "הכחשת השמועה והרגעה כללית",
          keywords_he: ["להכחיש את השמועה", "להרגיע בלי לפרט", "לומר שאין שינוי בתהליך"],
          deltas: { org_trust: -5, attrition_risk: 4 },
          evidence_he: "הכחיש בפני המנהלים שקיים תהליך של שינוי מבני, בניגוד למצב בפועל.",
          criteriaSignals: {},
        },
        {
          key: "accelerate_decision_timeline",
          label_he: "דחיפה להאצת ההחלטה הסופית",
          keywords_he: ["להאיץ את ההחלטה", "לקצר את חלון אי-הוודאות", "לסגור החלטה מהר יותר"],
          deltas: { attrition_risk: -1, workload: 3 },
          evidence_he: "פעל מול ההנהלה להאצת קבלת ההחלטה הסופית כדי לקצר את חלון אי-הוודאות.",
          criteriaSignals: { prioritization: 3, realism: 2 },
        },
        {
          key: "targeted_stay_conversations",
          label_he: "שיחות שימור ממוקדות עם בעלי סיכון גבוה",
          keywords_he: ["שיחות שימור ממוקדות", "לשוחח עם בעלי סיכון גבוה", "שיחות עם מהנדסים בכירים"],
          deltas: { attrition_risk: -5 },
          evidence_he: "קיים שיחות שימור ממוקדות עם העובדים שזוהו כבעלי סיכון עזיבה גבוה במיפוי הקודם.",
          criteriaSignals: { communication: 3, prioritization: 3 },
        },
        {
          key: "do_nothing_until_decision_final",
          label_he: "שתיקה עד לגיבוש ההחלטה הסופית",
          keywords_he: ["להמתין להחלטה סופית", "לא לתקשר כלום כרגע", "לשתוק עד שיש החלטה"],
          deltas: { org_trust: -2, attrition_risk: 2 },
          evidence_he: "בחר לא לתקשר דבר בנוגע לשמועה עד לגיבוש ההחלטה הסופית.",
          criteriaSignals: {},
        },
      ],
    },
    {
      index: 3,
      situation_he:
        "אבן הדרך מתקרבת. הפונקציה הקריטית עדיין נדרשת לספק בהיקף מלא, ובמקביל שני מהנדסים בכירים בעלי ידע ליבתי מתלבטים אם להישאר. חלק מהצוות מדווח על עומס גובר לקראת המסירה.",
      event_he:
        "עדכון חדש\n\nמנהל/ת הפונקציה מדווח/ת שאם אחד משני המהנדסים הבכירים יעזוב בשבועות הקרובים, קיים סיכון ממשי לעמידה באבן הדרך בשל ריכוז ידע קריטי.",
      constraints_he: ["ריכוז ידע קריטי אצל שני אנשים בלבד", "לוח זמנים סופי ומחייב לאבן הדרך"],
      decisionPrompt_he: "מה הייתם עושים עכשיו?",
      options: [
        {
          key: "critical_knowledge_transfer_plan",
          label_he: "הפעלת תוכנית העברת ידע דחופה",
          keywords_he: ["תוכנית העברת ידע דחופה", "לתעד ידע קריטי", "גיבוי ידע ממהנדסים בכירים"],
          deltas: {},
          evidence_he: "הפעיל תוכנית דחופה להעברת הידע הקריטי שהוחזק בידי שני מהנדסים בכירים בלבד.",
          criteriaSignals: { knowledge_protection: 5, diagnosis_before_action: 2 },
        },
        {
          key: "rebalance_milestone_scope",
          label_he: "איזון מחדש של היקף אבן הדרך",
          keywords_he: ["לצמצם היקף לאבן הדרך", "לאזן מחדש את התכולה", "להתאים את היעד למצב בשטח"],
          deltas: { workload: -6 },
          evidence_he: "פעל מול הנהלת האספקה לאיזון מחדש של היקף אבן הדרך לאור סיכון העומס שדווח.",
          criteriaSignals: { prioritization: 4, realism: 3 },
        },
        {
          key: "individualized_retention_offers",
          label_he: "שיחות שימור פרטניות עם שני המהנדסים",
          keywords_he: ["הצעות שימור מותאמות אישית", "שיחה פרטנית עם כל מהנדס", "להבין מה מניע כל אחד"],
          deltas: { attrition_risk: -6 },
          evidence_he: "קיים שיחות שימור פרטניות עם שני המהנדסים בהתאם למניעים הספציפיים שעלו אצל כל אחד מהם.",
          criteriaSignals: { communication: 3, diagnosis_before_action: 3 },
        },
        {
          key: "push_team_to_absorb_gap",
          label_he: "בקשה מהצוות לספוג את הפער ללא תגבור",
          keywords_he: ["לבקש מהצוות לספוג את הפער", "להטיל עומס נוסף בלי תגבור", "להסתמך על שאר הצוות"],
          deltas: { workload: 7, morale: -3 },
          evidence_he: "ביקש מיתר הצוות לספוג עומס נוסף לקראת אפשרות של עזיבה, ללא תגבור נלווה.",
          criteriaSignals: {},
        },
        {
          key: "escalate_headcount_request",
          label_he: "הסלמת בקשת תקן חירום לסמנכ\"ל הכספים",
          keywords_he: ["לבקש תקן חירום", "גיוס קבלן זמני", "בקשת תקציב דחופה לכיסוי הסיכון"],
          deltas: { workload: -3 },
          evidence_he: "העלה בקשת תקן חירום דחופה כדי לכסות את חלון הסיכון עד לסגירת תהליך השימור.",
          criteriaSignals: { financial_awareness: 3, workload_management: 2 },
        },
      ],
    },
    {
      index: 4,
      situation_he:
        "אבן הדרך הושגה, גם אם לא במלואה. אחד משני המהנדסים הבכירים בחר להישאר, השני עדיין שוקל. ההחלטה על השינוי המבני צפויה להתפרסם בשבועות הקרובים.",
      event_he:
        "עדכון חדש\n\nהמנכ\"לית מבקשת מכם סיכום קצר לדירקטוריון על מה שקרה בפונקציה הקריטית, ועל תוכנית ההמשך לרבות ההתייחסות לשינוי המבני הצפוי.",
      decisionPrompt_he: "איך תבנו את הסיכום לדירקטוריון?",
      options: [
        {
          key: "transparent_board_summary_with_plan",
          label_he: "סיכום שקוף לדירקטוריון עם תוכנית שימור קדימה",
          keywords_he: ["סיכום שקוף לדירקטוריון", "תוכנית שימור קדימה", "דיווח מלא כולל תובנות"],
          deltas: { org_trust: 4 },
          evidence_he: "בנה סיכום שקוף לדירקטוריון שכלל גם תוכנית שימור והגנת ידע קדימה, לא רק דיווח על מה שקרה.",
          criteriaSignals: { communication: 5, realism: 3 },
        },
        {
          key: "present_only_positive_outcome",
          label_he: "הצגת התוצאה החיובית בלבד",
          keywords_he: ["להציג רק את ההצלחה", "לא להזכיר את הסיכון שנותר", "דיווח חלקי בלבד"],
          deltas: { org_trust: -3, attrition_risk: 2 },
          evidence_he: "הציג לדירקטוריון את עמידה באבן הדרך בלבד, מבלי להתייחס לסיכון העזיבה שעדיין קיים.",
          criteriaSignals: {},
        },
        {
          key: "institutionalize_early_warning_process",
          label_he: "הצעת תהליך התרעה מוקדמת קבוע",
          keywords_he: ["לבנות תהליך התרעה מוקדמת", "לשלב סקרים וראיונות עזיבה", "נוהל קבוע לזיהוי סיכון בפונקציות קריטיות"],
          deltas: {},
          evidence_he: "הציע לבנות תהליך התרעה מוקדמת קבוע המשלב נתוני סקר וראיונות עזיבה עבור פונקציות קריטיות.",
          criteriaSignals: { diagnosis_before_action: 4, knowledge_protection: 2 },
        },
        {
          key: "schedule_structural_change_comms_plan",
          label_he: "בניית תוכנית תקשורת ייעודית להכרזת השינוי המבני",
          keywords_he: ["לבנות תוכנית תקשורת לשינוי", "הכנת מסרים להכרזה", "לתכנן את ההודעה מראש"],
          deltas: { org_trust: 2 },
          evidence_he: "בנה תוכנית תקשורת ייעודית לקראת הכרזת השינוי המבני, לצמצום החזרה על תרחיש הדליפה הקודם.",
          criteriaSignals: { communication: 4, diagnosis_before_action: 2 },
        },
      ],
    },
  ],
};

const scenarios: Scenario[] = [managerScenario, vpScenario];
export default scenarios;
