import type { Scenario } from "@/lib/scenario-schema";

/**
 * Healthcare / Medical Devices domain content.
 *
 * Fictional company "VitalCore Medical" and fictional product "MediFlow"
 * (a connected insulin pump) are used throughout — this is a business-
 * judgment simulation, not real medical or regulatory guidance. The
 * oversight body referenced ("הרשות המפקחת על מכשור רפואי") is a generic,
 * invented stand-in and does not refer to any real regulator.
 */

const managerKpis: Scenario["kpis"] = [
  {
    key: "patient_safety_risk",
    label_he: "רמת סיכון לבטיחות מטופלים",
    unit: "%",
    start: 25,
    min: 0,
    max: 100,
    higherIsBetter: false,
  },
  {
    key: "regulatory_readiness",
    label_he: "מוכנות רגולטורית",
    unit: "%",
    start: 60,
    min: 0,
    max: 100,
    higherIsBetter: true,
  },
  {
    key: "schedule",
    label_he: "לוח זמנים לחקירה ולייצור",
    unit: "יום",
    start: 0,
    min: -10,
    max: 10,
    higherIsBetter: true,
  },
  {
    key: "budget",
    label_he: "תקציב חקירה ואיכות",
    unit: "₪ אלף",
    start: 50,
    min: 0,
    max: 100,
    higherIsBetter: true,
  },
];

const managerScenario: Scenario = {
  id: "healthcare-manager-1",
  domainKey: "healthcare",
  title_he: "אות בטיחות שדה מוקדם במשאבת אינסולין מופצת",
  roleLevel: "manager",
  difficulty: 3,
  summary_he:
    "מנהל/ת איכות ותפעול ב-VitalCore Medical מקבל/ת אותות שדה ראשוניים ועמומים על משאבת האינסולין 'MediFlow', שכבר מופצת למרפאות ולמטופלים. יש לאזן בין מהירות בירור, תקשורת עם השטח והמשך רציפות הייצור.",
  estimatedMinutes: [25, 35],
  kpis: managerKpis,
  turns: [
    {
      index: 1,
      situation_he:
        "אתם מנהלים את תחום האיכות והתפעול של משאבת האינסולין החכמה 'MediFlow', המופצת כבר כשנה למרפאות ולמטופלים. בעשרת הימים האחרונים התקבלו במוקד שירות הלקוחות שישה דיווחים על חריגה במסירת מינון — חלק מהמטופלים תיארו תסמינים של היפוגליקמיה, ושניים מהמקרים הובילו לאשפוז המוגדר כ'קשור באופן אפשרי'. הקשר הסיבתי בין המקרים לתקלה במכשיר עצמו טרם אושר, וייתכן שמדובר בתקלה טכנית, בטעות שימוש או בצירוף מקרים.",
      constraints_he: [
        "מידע ראשוני וחלקי מהשטח",
        "לחץ לשמור על רציפות אספקה למרפאות",
        "חובת דיווח לרשות המפקחת על מכשור רפואי בתוך חלון זמן מוגדר",
      ],
      availableIntel: [
        { label_he: "ניתוח יומן תלונות מפורט", cost: 1, accuracy: 75 },
        { label_he: "משיכת נתוני קושחה (לוגים) מהמכשירים שדווחו", cost: 3, accuracy: 90 },
        { label_he: "בדיקת מדגם ממאגר הייצור (Batch) האחרון", cost: 2, accuracy: 80 },
      ],
      decisionPrompt_he: "מה תעשו עכשיו?",
      options: [
        {
          key: "pull_device_logs",
          label_he: "משיכת לוגים מהמכשירים שדווחו",
          keywords_he: ["למשוך לוגים", "לבדוק נתוני קושחה", "לנתח לוג מכשיר"],
          deltas: { budget: -2, schedule: -1 },
          evidence_he: "פעל למשיכת נתוני קושחה מהמכשירים שדווחו לפני קביעת מסקנה.",
          criteriaSignals: { diagnosis_before_action: 5, information_acquisition: 4 },
          nextEvent_he:
            "עדכון חדש\n\nניתוח הלוגים מצביע על כך שכל המקרים שדווחו שייכים למאגר ייצור (Batch) בודד, מתוך תקופת ייצור מוגדרת של כשלושה שבועות.",
        },
        {
          key: "quarantine_suspect_batch",
          label_he: "הקפאת מאגר הייצור החשוד עד לבירור",
          keywords_he: ["להקפיא מאגר ייצור", "עצירת משלוח של מאגר חשוד", "הקפאת מלאי חשוד"],
          deltas: { schedule: -2, budget: -1, patient_safety_risk: -5 },
          evidence_he: "בחר להקפיא את מאגר הייצור החשוד ולעצור משלוחים נוספים ממנו עד לבירור.",
          criteriaSignals: { diagnosis_before_action: 3, prioritization: 4 },
        },
        {
          key: "notify_clinics_immediately",
          label_he: "הפצת התרעה מיידית לכלל המרפאות המשתמשות במכשיר",
          keywords_he: ["להתריע למרפאות", "הודעה מיידית ללקוחות", "עדכון בטיחות דחוף"],
          deltas: { patient_safety_risk: -2, regulatory_readiness: -3 },
          evidence_he: "בחר להפיץ התרעה לכלל המרפאות באופן מיידי, בטרם הושלם בירור ראשוני של הגורם.",
          criteriaSignals: { communication: 4, knowing_when_to_stop: 3 },
        },
        {
          key: "continue_normal_operations",
          label_he: "המשך פעילות רגילה ללא שינוי בייצור או בהפצה",
          keywords_he: ["להמשיך כרגיל", "לא לעצור ייצור", "המשך הפצה רגילה"],
          deltas: { patient_safety_risk: 4, schedule: 2 },
          evidence_he: "בחר להמשיך בייצור ובהפצה הרגילים ללא שינוי, על בסיס המידע הראשוני שהיה זמין.",
          criteriaSignals: { diagnosis_before_action: 1, knowing_when_to_stop: 1, realism: 1 },
        },
        {
          key: "escalate_to_regulatory_affairs",
          label_he: "עדכון מוקדם של אגף הרגולציה והאיכות הפנימי",
          keywords_he: ["לעדכן רגולציה", "ליידע את מחלקת האיכות", "דיווח פנימי מוקדם"],
          deltas: { regulatory_readiness: 3 },
          evidence_he: "עדכן את אגף הרגולציה והאיכות הפנימי בשלב מוקדם, לפני שהתמונה הייתה סופית.",
          criteriaSignals: { communication: 3, knowing_when_to_stop: 2 },
        },
      ],
    },
    {
      index: 2,
      situation_he:
        "מאז ההחלטה הראשונית עברו 48 שעות. צוות ההנדסה מדווח כי אותר גורם טכני אפשרי הקשור למאגר ייצור מוגדר, אך הקשר הסיבתי המלא טרם אושר במלואו.",
      event_he:
        "עדכון חדש\n\nהרשות המפקחת על מכשור רפואי פנתה יזומה בעקבות דיווח של אחד מבתי החולים, ומבקשת עדכון מסודר בתוך חמישה ימי עבודה. במקביל, מרפאה נוספת מדווחת על מקרה דומה במכשיר ממאגר ייצור אחר.",
      constraints_he: [
        "חלון דיווח רגולטורי של חמישה ימי עבודה",
        "קשר סיבתי לא סופי",
        "אי-ודאות אם מדובר במאגר ייצור בודד",
      ],
      availableIntel: [
        { label_he: "בדיקת מעבדה של דגימות מאותו מאגר ייצור", cost: 3, accuracy: 90 },
        { label_he: "מיפוי המכשירים מהמאגר שכבר הגיעו למרפאות", cost: 2, accuracy: 95 },
        { label_he: "סקירת דיווחי אירועים דומים בשנתיים האחרונות", cost: 1, accuracy: 75 },
      ],
      decisionPrompt_he: "מה השלב הבא?",
      options: [
        {
          key: "expand_investigation_all_batches",
          label_he: "הרחבת החקירה לכלל מאגרי הייצור",
          keywords_he: ["להרחיב חקירה", "לבדוק את כל המאגרים", "חקירה רחבה יותר"],
          deltas: { budget: -3, schedule: -2, patient_safety_risk: -4 },
          evidence_he: "הרחיב את היקף החקירה לכלל מאגרי הייצור, ולא רק למאגר שזוהה תחילה.",
          criteriaSignals: { diagnosis_before_action: 4, information_acquisition: 3 },
          nextEvent_he:
            "עדכון חדש\n\nהחקירה המורחבת מאתרת שני מאגרי ייצור נוספים עם סטייה דומה, אך קטנה יותר. ההיקף הכולל גדל, אך התמונה הטכנית ברורה משמעותית יותר.",
        },
        {
          key: "issue_formal_field_advisory",
          label_he: "הוצאת הודעת בטיחות שדה רשמית למרפאות",
          keywords_he: ["הודעת בטיחות שדה", "הודעה רשמית ללקוחות", "field advisory"],
          deltas: { patient_safety_risk: -3, regulatory_readiness: 2, schedule: -1 },
          evidence_he: "הוציא הודעת בטיחות שדה רשמית ומתועדת למרפאות המשתמשות במכשיר.",
          criteriaSignals: { communication: 5, realism: 3 },
        },
        {
          key: "respond_regulator_minimally",
          label_he: "מענה מינימלי לרשות המפקחת עד להשלמת הבדיקה",
          keywords_he: ["מענה מינימלי לרגולטור", "לעכב פרטים לרשות", "לחכות לפני דיווח מלא"],
          deltas: { regulatory_readiness: -3 },
          evidence_he: "בחר להשיב לרשות המפקחת באופן מינימלי, ולעכב שיתוף פרטים עד להשלמת הבדיקה הפנימית.",
          criteriaSignals: { communication: 1, realism: 2, knowing_when_to_stop: 2 },
        },
        {
          key: "pause_distribution_pending_root_cause",
          label_he: "עצירת הפצה זמנית עד לאישור הגורם השורשי",
          keywords_he: ["לעצור הפצה", "עצירת שיווק זמנית", "השהיית משלוחים"],
          deltas: { patient_safety_risk: -5, schedule: -3, budget: -2 },
          evidence_he: "בחר לעצור את ההפצה באופן זמני עד לאישור הגורם השורשי המלא.",
          criteriaSignals: { diagnosis_before_action: 3, prioritization: 3, knowing_when_to_stop: 3 },
        },
      ],
    },
    {
      index: 3,
      situation_he:
        "צוות האיכות וההנדסה עובד באינטנסיביות מעל שבועיים ברצף על החקירה, לצד מענה לפניות שוטפות של מרפאות. אחראי הבדיקות הטכניות המרכזי הוא היחיד שמכיר לעומק את פרוטוקול הבדיקה שפותח עבור מאגר הייצור החשוד.",
      event_he:
        "עדכון חדש\n\nמנהלת משאבי אנוש מתריעה כי חלק מאנשי צוות האיכות מראים סימני עומס משמעותי, ואחראי הבדיקות המרכזי ביקש יום חופש דחוף בשל מצב אישי.",
      constraints_he: ["צוות מצומצם מול היקף חקירה גדל", "תלות בידע של איש מפתח יחיד"],
      decisionPrompt_he: "איך תנהלו את הצוות ואת הידע הקריטי בשלב הזה?",
      options: [
        {
          key: "document_test_protocol_now",
          label_he: "תיעוד מיידי של פרוטוקול הבדיקה מהאחראי המרכזי",
          keywords_he: ["לתעד פרוטוקול בדיקה", "גיבוי ידע קריטי", "תיעוד תהליך בדיקה"],
          deltas: {},
          evidence_he: "דאג לתעד את פרוטוקול הבדיקה הקריטי לפני שהאחראי המרכזי יצא לחופשה.",
          criteriaSignals: { knowledge_protection: 5 },
        },
        {
          key: "redistribute_investigation_load",
          label_he: "חלוקה מחדש של עומס החקירה בצוות",
          keywords_he: ["לחלק מחדש עומס", "לפזר משימות חקירה", "לאזן עומס צוות"],
          deltas: { schedule: -1 },
          evidence_he: "חילק מחדש את עומס החקירה בצוות לאחר שזוהו סימני עומס.",
          criteriaSignals: { workload_management: 4 },
        },
        {
          key: "bring_external_quality_consultant",
          label_he: "הבאת יועץ איכות חיצוני זמני לתגבור",
          keywords_he: ["יועץ חיצוני", "תגבור זמני מומחה", "כוח אדם חיצוני"],
          deltas: { budget: -3, schedule: 1 },
          evidence_he: "הביא יועץ איכות חיצוני זמני לתגבור הצוות הקבוע.",
          criteriaSignals: { workload_management: 3, financial_awareness: 2 },
        },
        {
          key: "push_team_without_change",
          label_he: "המשך באותו קצב ללא שינוי בהקצאה",
          keywords_he: ["להמשיך באותו קצב", "לא לשנות הקצאה", "להתקדם כרגיל"],
          deltas: { patient_safety_risk: 1 },
          evidence_he: "בחר להמשיך באותו קצב עבודה ללא שינוי, חרף סימני העומס שדווחו.",
          criteriaSignals: { realism: 2, workload_management: 1 },
        },
      ],
    },
    {
      index: 4,
      situation_he:
        "החקירה מתקרבת לסיום. הגורם השורשי אושר ברמת ודאות סבירה, וההנהלה הבכירה והרשות המפקחת ממתינות לדוח מסכם ולתוכנית פעולה.",
      event_he:
        "עדכון חדש\n\nהרשות המפקחת מבקשת דוח מסכם רשמי בתוך שבוע, וההנהלה הבכירה מבקשת תדרוך מקביל לפני שהדוח יוצא.",
      decisionPrompt_he: "איך תבנו את הדוח והתדרוך המסכמים?",
      options: [
        {
          key: "transparent_root_cause_report",
          label_he: "דוח שקוף הכולל גורם שורשי, היקף מלא ותוכנית תיקון",
          keywords_he: ["דוח שקוף", "גורם שורשי מלא", "תוכנית תיקון מפורטת"],
          deltas: { regulatory_readiness: 4 },
          evidence_he: "הגיש דוח שקוף לרשות המפקחת שכלל את הגורם השורשי, ההיקף המלא ותוכנית תיקון מוגדרת.",
          criteriaSignals: { communication: 5, realism: 4 },
        },
        {
          key: "understate_scope_in_report",
          label_he: "צמצום היקף הדיווח לגורם השורשי בלבד",
          keywords_he: ["לצמצם דיווח", "לא לפרט היקף מלא", "דיווח חלקי"],
          deltas: { regulatory_readiness: -3 },
          evidence_he: "בחר לצמצם את היקף הדיווח לגורם השורשי בלבד, ללא פירוט מלא של ההיקף שהתגלה.",
          criteriaSignals: { communication: 1, realism: 1 },
        },
        {
          key: "document_lessons_for_qms",
          label_he: "תיעוד לקחים לעדכון מערכת ניהול האיכות",
          keywords_he: ["תיעוד לקחים", "עדכון נהלי איכות", "הפקת לקחים למערכת האיכות"],
          deltas: {},
          evidence_he: "תיעד לקחים מהאירוע לצורך עדכון נהלי מערכת ניהול האיכות.",
          criteriaSignals: { diagnosis_before_action: 3, knowledge_protection: 3 },
        },
      ],
    },
  ],
};

const vpScenario: Scenario = {
  id: "healthcare-vp-1",
  domainKey: "healthcare",
  title_he: "החלטת הסלמה לפעולת שדה וולונטרית רב-ארצית",
  roleLevel: "vp",
  difficulty: 5,
  summary_he:
    "סמנכ\"ל/ית האיכות והרגולציה של VitalCore Medical נדרש/ת להחליט האם ובאיזה היקף להוביל פעולת שדה וולונטרית במשאבת האינסולין 'MediFlow', מול נתונים חלקיים, ריבוי רשויות ומדינות, לחץ דירקטוריון וחשיפה משפטית ותקשורתית.",
  estimatedMinutes: [30, 40],
  kpis: [
    {
      key: "patient_safety_risk",
      label_he: "חשיפת בטיחות מטופלים ברמת השוק",
      unit: "%",
      start: 45,
      min: 0,
      max: 100,
      higherIsBetter: false,
    },
    {
      key: "regulatory_readiness",
      label_he: "מוכנות מול רשויות בכל השווקים",
      unit: "%",
      start: 50,
      min: 0,
      max: 100,
      higherIsBetter: true,
    },
    {
      key: "schedule",
      label_he: "לוח זמנים להחלטת שדה",
      unit: "יום",
      start: 0,
      min: -15,
      max: 15,
      higherIsBetter: true,
    },
    {
      key: "budget",
      label_he: "תקציב חירום לפעולת שדה",
      unit: "₪ מיליון",
      start: 5,
      min: 0,
      max: 10,
      higherIsBetter: true,
    },
  ],
  turns: [
    {
      index: 1,
      situation_he:
        "אתם סמנכ\"ל/ית האיכות והרגולציה של VitalCore Medical. בשלושת השבועות האחרונים תועדו 14 מקרים ברחבי השוק (ישראל, אירופה וארה\"ב) של חריגה במסירת מינון במשאבת האינסולין 'MediFlow', מתוכם שלושה מקרים המוגדרים כחמורים. הקשר בין המקרים לגורם טכני משותף עדיין לא סופי, אך דפוס ראשוני מצביע על אלגוריתם כיול בגרסת תוכנה ספציפית. הדירקטוריון מודע לנושא וביקש עדכון דחוף, המחלקה המשפטית מזהירה מפני חשיפה, וצוות הרגולציה מציין כי פעולת שדה וולונטרית, אם תוחלט, תחייב דיווח מיידי בכל המדינות הרלוונטיות.",
      constraints_he: [
        "ריבוי רשויות ומדינות עם דרישות דיווח שונות",
        "קשר סיבתי טכני לא סופי",
        "חשיפה משפטית ותקשורתית פוטנציאלית",
        "לחץ דירקטוריון לתשובה מהירה",
      ],
      availableIntel: [
        { label_he: "ניתוח סטטיסטי מלא של כלל המקרים שדווחו", cost: 2, accuracy: 85 },
        { label_he: "בדיקת גרסת התוכנה החשודה במעבדה", cost: 4, accuracy: 92 },
        { label_he: "ייעוץ משפטי מוקדם על חשיפה רגולטורית", cost: 1, accuracy: 70 },
      ],
      decisionPrompt_he: "מה הייתם עושים עכשיו?",
      options: [
        {
          key: "commission_full_statistical_analysis",
          label_he: "הזמנת ניתוח סטטיסטי מלא של כלל המקרים לפני החלטה",
          keywords_he: ["ניתוח סטטיסטי מלא", "לבחון את כל המקרים", "מיפוי דפוס מקרים"],
          deltas: { budget: -1 },
          evidence_he: "הזמין ניתוח סטטיסטי מלא של כלל המקרים שדווחו לפני קבלת החלטת הסלמה.",
          criteriaSignals: { diagnosis_before_action: 5, information_acquisition: 4 },
          nextEvent_he:
            "עדכון חדש\n\nהניתוח הסטטיסטי מצביע על מתאם חזק בין המקרים החמורים לבין גרסת תוכנה ספציפית שהותקנה בין ינואר למרץ, המהווים כ-18% מהמכשירים הפעילים בשוק.",
        },
        {
          key: "initiate_voluntary_field_correction",
          label_he: "פתיחה מיידית בהליך פעולת שדה וולונטרית",
          keywords_he: ["פעולת שדה וולונטרית", "voluntary field action", "לפתוח הליך תיקון שדה"],
          deltas: { patient_safety_risk: -6, schedule: -3, budget: -4 },
          evidence_he: "בחר לפתוח מיידית בהליך פעולת שדה וולונטרית, בטרם הושלם אישור סופי של הגורם השורשי.",
          criteriaSignals: { realism: 3, prioritization: 3 },
        },
        {
          key: "brief_board_with_scenarios",
          label_he: "תדרוך הדירקטוריון עם מספר תרחישי החלטה אפשריים",
          keywords_he: ["לתדרך דירקטוריון", "להציג תרחישים להנהלה", "עדכון הנהלה בכירה עם חלופות"],
          deltas: { regulatory_readiness: 2 },
          evidence_he: "תדרך את הדירקטוריון והציג מספר תרחישי החלטה אפשריים במקום המלצה בודדת מוקדמת מדי.",
          criteriaSignals: { communication: 5, prioritization: 4 },
        },
        {
          key: "wait_for_full_causal_confirmation",
          label_he: "המתנה לאישור סיבתי סופי לפני כל פעולה",
          keywords_he: ["להמתין לאישור סופי", "לא לפעול לפני ודאות מלאה", "לחכות לנתונים נוספים"],
          deltas: { schedule: 2, patient_safety_risk: 2 },
          evidence_he: "בחר להמתין לאישור סיבתי סופי לפני נקיטת כל פעולה, לרבות פעולה חלקית.",
          criteriaSignals: { knowing_when_to_stop: 2, diagnosis_before_action: 2, prioritization: 1 },
        },
        {
          key: "engage_legal_and_regulatory_jointly",
          label_he: "כינוס משותף של הצוות המשפטי וצוות הרגולציה להערכת חשיפה",
          keywords_he: ["לכנס משפטי ורגולציה", "הערכת חשיפה משותפת", "ייעוץ משפטי ורגולטורי מקביל"],
          deltas: { regulatory_readiness: 3, budget: -1 },
          evidence_he: "כינס את הצוות המשפטי וצוות הרגולציה יחד להערכת חשיפה לפני גיבוש עמדה.",
          criteriaSignals: { communication: 3, diagnosis_before_action: 2 },
        },
      ],
    },
    {
      index: 2,
      situation_he:
        "בעקבות הפעולות הראשוניות מתקבלת תמונה חדה יותר, אך לא סופית, לגבי היקף הבעיה. הצוות המשפטי מציג שתי חלופות עיקריות: פעולה מדורגת מול תת-אוכלוסיית מכשירים, או פעולת שדה רחבה על כלל הגרסה.",
      event_he:
        "עדכון חדש\n\nאחת הרשויות באירופה פנתה יזומה ומבקשת עמדה רשמית בתוך 72 שעות. במקביל, כתב תחקירים פנה לדובר החברה בבקשת תגובה.",
      constraints_he: [
        "חלון זמן קצר מול רשות אירופית",
        "חשיפה תקשורתית אפשרית",
        "אי-ודאות לגבי היקף המכשירים המושפעים",
      ],
      availableIntel: [
        { label_he: "חוות דעת רגולטורית חיצונית על היקף הפעולה הנדרש", cost: 3, accuracy: 85 },
        { label_he: "ניתוח סטטיסטי של שיעור הכשל בתת-האוכלוסייה", cost: 3, accuracy: 80 },
        { label_he: "הערכת עלות ולוחות זמנים לפעולת שדה רחבה", cost: 2, accuracy: 90 },
      ],
      decisionPrompt_he: "מה הייתם עושים עכשיו?",
      options: [
        {
          key: "targeted_field_action_affected_lot",
          label_he: "פעולת שדה ממוקדת רק לגרסת התוכנה החשודה",
          keywords_he: ["פעולת שדה ממוקדת", "תיקון לגרסה ספציפית", "טיפול בתת-אוכלוסיית מכשירים"],
          deltas: { patient_safety_risk: -5, schedule: -2, budget: -3 },
          evidence_he: "בחר בפעולת שדה ממוקדת לגרסת התוכנה החשודה בלבד, בהתבסס על הממצא הסטטיסטי.",
          criteriaSignals: { diagnosis_before_action: 4, prioritization: 4 },
        },
        {
          key: "broad_market_wide_recall",
          label_he: "פעולת שדה רחבה על כלל המכשירים בשוק",
          keywords_he: ["פעולת שדה רחבה", "פעולת שדה מלאה", "תיקון לכלל המכשירים"],
          deltas: { patient_safety_risk: -7, schedule: -5, budget: -7 },
          evidence_he: "בחר בפעולת שדה רחבה החלה על כלל המכשירים בשוק, מעבר לתת-הקבוצה שזוהתה כחשודה.",
          criteriaSignals: { realism: 2, financial_awareness: 1, prioritization: 2 },
        },
        {
          key: "formal_response_to_eu_regulator",
          label_he: "מענה רשמי ומתועד לרשות האירופית בתוך חלון הזמן",
          keywords_he: ["מענה רשמי לרגולטור אירופי", "דיווח לרשות באירופה", "עמדה רשמית לרגולטור"],
          deltas: { regulatory_readiness: 4 },
          evidence_he: "הגיש מענה רשמי ומתועד לרשות האירופית בתוך חלון הזמן שנדרש.",
          criteriaSignals: { communication: 4, realism: 3 },
          nextEvent_he:
            "עדכון חדש\n\nהרשות האירופית מקבלת את המענה הרשמי ומאשרת חלון זמן נוסף של שבוע להשלמת ההחלטה, אך מבקשת דיווח ביניים תוך 48 שעות.",
        },
        {
          key: "decline_media_comment",
          label_he: "הימנעות מתגובה לתקשורת עד להחלטה סופית",
          keywords_he: ["לא להגיב לתקשורת", "להימנע מתגובה לעיתונות", "לדחות תגובה לתקשורת"],
          deltas: { regulatory_readiness: -2 },
          evidence_he: "בחר להימנע לחלוטין ממתן תגובה לתקשורת עד לגיבוש החלטה סופית.",
          criteriaSignals: { communication: 2, knowing_when_to_stop: 3, realism: 3 },
        },
      ],
    },
    {
      index: 3,
      situation_he:
        "הצוות המורחב — איכות, רגולציה, משפטי ותפעול — פועל תחת עומס גבוה כבר למעלה משבועיים. מנהלת הרגולציה הבינלאומית מתריעה כי חלק מהאנשים המרכזיים בתהליך קרובים לשחיקה, ובמקביל יש עדיין החלטות תפעוליות פתוחות לגבי היקף הפעולה בכל מדינה.",
      event_he:
        "עדכון חדש\n\nמנכ\"ל החברה מבקש מכם החלטה סופית עוד היום, בעוד ראש צוות הרגולציה הבינלאומי מבקש 48 שעות נוספות להשלמת בדיקה במדגם ממדינה שלישית.",
      constraints_he: [
        "לחץ זמן סותר בין ההנהלה הבכירה לצוות המקצועי",
        "צוות מורחב תחת עומס גבוה",
        "החלטה כמעט בלתי הפיכה מבחינה תדמיתית ומשפטית",
      ],
      decisionPrompt_he: "איך תנהלו את ההחלטה ואת הצוות בשלב הזה?",
      options: [
        {
          key: "grant_extra_time_for_third_country_sample",
          label_he: "מתן 48 שעות נוספות להשלמת הבדיקה במדגם השלישי, תוך עדכון המנכ\"ל",
          keywords_he: ["לתת זמן נוסף לבדיקה", "לעכב החלטה למדגם נוסף", "לבקש ארכה מבוקרת"],
          deltas: { schedule: -1, regulatory_readiness: 2 },
          evidence_he: "העניק ארכה מבוקרת של 48 שעות להשלמת הבדיקה, תוך עדכון שקוף של המנכ\"ל על הסיבה.",
          criteriaSignals: { knowing_when_to_stop: 4, communication: 3 },
        },
        {
          key: "decide_now_without_third_sample",
          label_he: "קבלת החלטה סופית היום ללא נתוני המדגם השלישי",
          keywords_he: ["להחליט עכשיו", "לא לחכות למדגם נוסף", "החלטה מיידית ללא הנתונים"],
          deltas: { schedule: 2, patient_safety_risk: 2 },
          evidence_he: "בחר לקבל החלטה סופית באותו יום, ללא המתנה לנתוני המדגם השלישי.",
          criteriaSignals: { information_acquisition: 1, diagnosis_before_action: 2, knowing_when_to_stop: 2 },
        },
        {
          key: "redistribute_crossfunctional_load",
          label_he: "חלוקה מחדש של העומס בין צוותי האיכות, הרגולציה והמשפטי",
          keywords_he: ["לחלק מחדש עומס בין צוותים", "לאזן עומס בין מחלקות", "תגבור צולב בין צוותים"],
          deltas: {},
          evidence_he: "חילק מחדש את העומס בין צוותי האיכות, הרגולציה והמשפטי לאחר שזוהו סימני שחיקה.",
          criteriaSignals: { workload_management: 4 },
        },
        {
          key: "document_decision_rationale_realtime",
          label_he: "תיעוד שוטף של הרציונל להחלטה לצורך המשך ובקרה",
          keywords_he: ["לתעד רציונל בזמן אמת", "תיעוד החלטה מתמשך", "לשמור תיעוד לבקרה עתידית"],
          deltas: {},
          evidence_he: "התחיל בתיעוד שוטף של הרציונל מאחורי כל שלב בהחלטה, לצורך בקרה עתידית.",
          criteriaSignals: { knowledge_protection: 4 },
        },
      ],
    },
    {
      index: 4,
      situation_he:
        "ההחלטה על היקף פעולת השדה התקבלה. יש להשלים כעת את ההודעה הרשמית לרשויות, למרפאות ולציבור, ולהציג לדירקטוריון תוכנית מעקב.",
      event_he:
        "עדכון חדש\n\nיו\"ר הדירקטוריון מבקש ממכם להציג בישיבה הקרובה גם את ההשלכות התקציביות וגם את תוכנית המניעה לטווח הארוך.",
      decisionPrompt_he: "איך תבנו את הדיווח הסופי ותוכנית ההמשך?",
      options: [
        {
          key: "full_disclosure_with_prevention_plan",
          label_he: "דיווח מלא ושקוף הכולל תוכנית מניעה מובנית לטווח הארוך",
          keywords_he: ["דיווח מלא ושקוף", "תוכנית מניעה", "שקיפות מול דירקטוריון ורשויות"],
          deltas: { regulatory_readiness: 5 },
          evidence_he: "הציג דיווח מלא ושקוף לדירקטוריון ולרשויות, שכלל תוכנית מניעה מובנית למניעת הישנות.",
          criteriaSignals: { communication: 5, realism: 4 },
        },
        {
          key: "limit_disclosure_to_minimum_required",
          label_he: "צמצום הדיווח למינימום הנדרש רגולטורית בלבד",
          keywords_he: ["דיווח מינימלי", "לצמצם לדרישה הרגולטורית", "לא לפרט מעבר לנדרש"],
          deltas: { regulatory_readiness: -4 },
          evidence_he: "בחר לצמצם את הדיווח למינימום הנדרש רגולטורית בלבד, ללא פירוט תוכנית מניעה.",
          criteriaSignals: { communication: 1, realism: 2 },
        },
        {
          key: "propose_qms_structural_change",
          label_he: "הצעת שינוי מבני במערכת ניהול האיכות ובתהליכי הבקרה",
          keywords_he: ["שינוי מבני במערכת האיכות", "עדכון תהליכי בקרה", "שיפור מערך ניטור שדה"],
          deltas: { budget: -2 },
          evidence_he: "הציע שינוי מבני במערכת ניהול האיכות ובתהליכי ניטור השדה כדי להפחית סיכון עתידי דומה.",
          criteriaSignals: { diagnosis_before_action: 4, realism: 3 },
        },
      ],
    },
  ],
};

const scenarios: Scenario[] = [managerScenario, vpScenario];
export default scenarios;
