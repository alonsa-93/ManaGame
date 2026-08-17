import type { Scenario } from "@/lib/scenario-schema";

/**
 * Domain: aviation-defense (תעופה וביטחון).
 *
 * All program names, client names and technical details in this file are
 * fictional and illustrative. This is a business-judgment / program-
 * management simulation — it does not reference any real defense program,
 * platform, contract or security-sensitive information.
 */

const kpis: Scenario["kpis"] = [
  { key: "schedule", label_he: "לוח זמנים לאבן דרך", unit: "יום", start: 0, min: -30, max: 30, higherIsBetter: true },
  { key: "budget", label_he: "תקציב תוכנית", unit: "₪ מיליון", start: 8, min: 0, max: 16, higherIsBetter: true },
  { key: "safety_margin", label_he: "מרווח בטיחות/הנדסי", unit: "%", start: 90, min: 40, max: 100, higherIsBetter: true },
  { key: "stakeholder_trust", label_he: "אמון לקוח ורגולציה", unit: "%", start: 80, min: 0, max: 100, higherIsBetter: true },
];

const managerScenario: Scenario = {
  id: "aviation-defense-manager-1",
  domainKey: "aviation-defense",
  title_he: "עיכוב באישור ספק למערכת קריטית",
  roleLevel: "manager",
  difficulty: 3,
  summary_he:
    "אתם מנהלים תוכנית רב-שנתית לפיתוח מערכת אווירונית. ספק המשנה של תת-מערכת קריטית ('לוח בקרת הינע') מדווח על עיכוב בתהליך ההסמכה, ועל כך שהוא לא יוכל לעמוד בלוח הזמנים המקורי לבדיקות הקבלה.",
  estimatedMinutes: [20, 30],
  kpis,
  turns: [
    {
      index: 1,
      situation_he:
        "אתם מנהלים את תוכנית 'זמיר', תוכנית רב-שנתית לפיתוח מערכת אווירונית עבור לקוח ממשלתי בדוי. ספק המשנה האחראי על לוח בקרת ההינע — תת-מערכת קריטית לבטיחות הטיסה — הודיע כי תהליך ההסמכה של הרכיב נתקל בכשל בבדיקת עמידות בתנאי טמפרטורה קיצוניים, ושהוא זקוק לעוד כשישה שבועות כדי להשלים תיקון ובדיקה חוזרת. מועד בדיקות הקבלה מול הלקוח נקבע מראש ומופיע בהסכם החוזי.",
      constraints_he: [
        "מועד בדיקות קבלה קבוע בחוזה מול הלקוח",
        "מידע חלקי על שורש הכשל בבדיקת הטמפרטורה",
        "תקציב חירום מוגבל לתוכנית",
      ],
      availableIntel: [
        { label_he: "דוח כשל מפורט מהספק", cost: 1, accuracy: 75 },
        { label_he: "חוות דעת הנדסית עצמאית על הכשל", cost: 3, accuracy: 92 },
        { label_he: "בדיקת יכולת ספק חלופי מוסמך", cost: 2, accuracy: 80 },
      ],
      decisionPrompt_he: "מה הייתם עושים עכשיו?",
      options: [
        {
          key: "request_independent_engineering_review",
          label_he: "הזמנת חוות דעת הנדסית עצמאית על שורש הכשל",
          keywords_he: ["חוות דעת הנדסית", "בדיקה עצמאית", "לבדוק את שורש הכשל", "ניתוח כשל עצמאי"],
          deltas: { budget: -1 },
          evidence_he: "הזמין חוות דעת הנדסית עצמאית לבירור שורש הכשל לפני קבלת החלטה על לוח הזמנים.",
          criteriaSignals: { diagnosis_before_action: 5, information_acquisition: 4 },
          nextEvent_he:
            "עדכון חדש\n\nחוות הדעת ההנדסית העלתה כי הכשל נובע מבחירת חומר איטום שאינו מתאים לטווח הטמפרטורות המלא, ולא מפגם בתהליך הייצור עצמו. תיקון הבעיה צפוי להיות ישים, אך מצריך אישור מחדש של סדרת בדיקות.",
        },
        {
          key: "accept_supplier_timeline_as_is",
          label_he: "קבלת לוח הזמנים החדש של הספק ללא בדיקה נוספת",
          keywords_he: ["לקבל את העיכוב", "לאשר את לוח הזמנים החדש", "להסתמך על הספק בלבד"],
          deltas: { schedule: -3, safety_margin: 1 },
          evidence_he: "קיבל את לוח הזמנים המתוקן של הספק מבלי לבחון באופן עצמאי את שורש הכשל.",
          criteriaSignals: {},
        },
        {
          key: "activate_qualified_backup_supplier",
          label_he: "בחינת הפעלת ספק גיבוי מוסמך במקביל",
          keywords_he: ["ספק גיבוי", "ספק חלופי מוסמך", "מסלול מקביל לספק"],
          deltas: { budget: -2, schedule: 1 },
          evidence_he: "בחן הפעלת ספק גיבוי מוסמך במקביל כדי לצמצם את התלות בספק היחיד.",
          criteriaSignals: { realism: 3, diagnosis_before_action: 2 },
        },
        {
          key: "push_supplier_to_compress_schedule",
          label_he: "דרישה מהספק לדחוס את לוח הזמנים לתיקון",
          keywords_he: ["לדחוס לוח זמנים", "ללחוץ על הספק", "לדרוש זירוז"],
          deltas: { schedule: 2, safety_margin: -3 },
          evidence_he: "דרש מהספק לקצר את משך תהליך התיקון וההסמכה החוזרת של הרכיב.",
          criteriaSignals: {},
        },
        {
          key: "notify_customer_early",
          label_he: "עדכון מוקדם ושקוף ללקוח על הסיכון ללוח הזמנים",
          keywords_he: ["עדכון ללקוח", "ליידע את הלקוח מראש", "שקיפות מול הלקוח"],
          deltas: { stakeholder_trust: 2, schedule: -1 },
          evidence_he: "עדכן את הלקוח מוקדם ובאופן שקוף על סיכון אפשרי ללוח הזמנים, לפני שהיה ודאי.",
          criteriaSignals: { communication: 4, realism: 2 },
        },
      ],
    },
    {
      index: 2,
      situation_he:
        "המידע על שורש הכשל התבהר במידה מסוימת. צוות ההנדסה שלכם מבקש הכוונה לגבי אופן ההתמודדות עם התיקון והשפעתו על יתר שלבי הבדיקות.",
      event_he:
        "עדכון חדש\n\nהספק מציע שני מסלולים: תיקון מלא של חומר האיטום שיוסיף כארבעה שבועות ללוח הזמנים, או פתרון ביניים זמני שמאפשר עמידה במועד המקורי אך מצמצם את מרווח הבטיחות התרמי ב-15 נקודות אחוז עד להשלמת התיקון המלא בשלב מאוחר יותר.",
      constraints_he: ["חלון החלטה קצר לפני שליחת עדכון רשמי ללקוח", "מידע חלקי לגבי ההשפעה ארוכת הטווח של הפתרון הזמני"],
      decisionPrompt_he: "איזה מסלול הייתם בוחרים?",
      options: [
        {
          key: "choose_full_fix_accept_delay",
          label_he: "בחירה בתיקון המלא וקבלת העיכוב בלוח הזמנים",
          keywords_he: ["תיקון מלא", "לקבל את העיכוב", "לא להתפשר על בטיחות"],
          deltas: { schedule: -4, safety_margin: 2 },
          evidence_he: "בחר בתיקון המלא של הרכיב וקיבל את ההשפעה על לוח הזמנים במקום לפגוע במרווח הבטיחות.",
          criteriaSignals: { realism: 4, diagnosis_before_action: 2 },
          nextEvent_he:
            "עדכון חדש\n\nהלקוח קיבל את העדכון על העיכוב בהבנה, אך ביקש תוכנית התאוששות מפורטת לשלב הבדיקות הבא.",
        },
        {
          key: "choose_interim_fix_with_monitoring",
          label_he: "אימוץ הפתרון הזמני בליווי תוכנית ניטור מוגדרת",
          keywords_he: ["פתרון זמני עם ניטור", "לאשר פתרון ביניים מבוקר", "מעקב תרמי מוגדר"],
          deltas: { schedule: 1, safety_margin: -2 },
          evidence_he: "אימץ את הפתרון הזמני, אך רק בליווי תוכנית ניטור מוגדרת עד להשלמת התיקון המלא.",
          criteriaSignals: { realism: 2, prioritization: 3 },
        },
        {
          key: "choose_interim_fix_no_monitoring",
          label_he: "אימוץ הפתרון הזמני ללא ליווי נוסף",
          keywords_he: ["לאשר פתרון זמני", "לקבל את המסלול הקצר", "להתקדם כמו שהספק מציע"],
          deltas: { schedule: 3, safety_margin: -5 },
          evidence_he: "אימץ את הפתרון הזמני של הספק כלשונו, ללא תוכנית ניטור נוספת מטעם התוכנית.",
          criteriaSignals: {},
        },
        {
          key: "escalate_decision_to_director",
          label_he: "העלאת ההחלטה לדירקטור התוכנית לפני מחויבות",
          keywords_he: ["להעלות להנהלה", "לעדכן דירקטור", "לבקש אישור מלמעלה"],
          deltas: { stakeholder_trust: 1 },
          evidence_he: "העלה את ההחלטה בין שני המסלולים לדירקטור התוכנית לפני שהתחייב לאחד מהם מול הלקוח.",
          criteriaSignals: { communication: 3, knowing_when_to_stop: 3 },
        },
      ],
    },
    {
      index: 3,
      situation_he:
        "צוות ההנדסה עובד תחת עומס גבוה מאז שהתגלה הכשל. חלק מהמהנדסים המרכזיים מעורבים גם בפרויקט מקביל, ויש חשש לעיכוב נוסף אם לא יחולק העומס.",
      event_he: "עדכון חדש\n\nראש צוות ההנדסה מתריע כי שני מהנדסים בכירים המעורבים בבדיקת התיקון קרובים לשחיקה, וגם מזהיר שהידע על תהליך ההסמכה מרוכז כמעט כולו אצלם.",
      constraints_he: ["צוות הנדסה מצומצם", "תלות בידע המרוכז אצל מספר מצומצם של אנשים"],
      decisionPrompt_he: "איך תנהלו את הצוות בשלב הזה?",
      options: [
        {
          key: "redistribute_engineering_load",
          label_he: "חלוקה מחדש של העומס בין מהנדסי הצוות",
          keywords_he: ["לחלק מחדש עומס", "לאזן עומס בין מהנדסים", "לפזר משימות הנדסיות"],
          deltas: { safety_margin: 1 },
          evidence_he: "חילק מחדש את עומס העבודה ההנדסי לאחר שזוהו סימני שחיקה אצל אנשי מפתח.",
          criteriaSignals: { workload_management: 4, communication: 2 },
        },
        {
          key: "document_certification_knowledge",
          label_he: "תיעוד שיטתי של ידע תהליך ההסמכה",
          keywords_he: ["לתעד ידע", "תיעוד תהליך הסמכה", "גיבוי ידע הנדסי"],
          deltas: {},
          evidence_he: "יזם תיעוד שיטתי של הידע על תהליך ההסמכה שהיה מרוכז אצל מספר מצומצם של מהנדסים.",
          criteriaSignals: { knowledge_protection: 5 },
        },
        {
          key: "bring_temp_certification_support",
          label_he: "הבאת תגבור חיצוני מוסמך לבדיקות",
          keywords_he: ["תגבור חיצוני", "יועץ הנדסי נוסף", "כוח אדם מוסמך נוסף"],
          deltas: { budget: -2, safety_margin: 1 },
          evidence_he: "הביא תגבור חיצוני מוסמך כדי להקל על הצוות הקבוע בשלב הבדיקות.",
          criteriaSignals: { workload_management: 3, financial_awareness: 2 },
        },
        {
          key: "push_through_without_change",
          label_he: "המשך לפי התוכנית הקיימת ללא שינוי בהקצאה",
          keywords_he: ["להמשיך כרגיל", "לא לשנות הקצאה", "להתקדם כמתוכנן"],
          deltas: { safety_margin: -2 },
          evidence_he: "בחר להמשיך לפי ההקצאה הקיימת ללא התאמה לעומס ולסימני השחיקה שדווחו.",
          criteriaSignals: {},
        },
      ],
    },
    {
      index: 4,
      situation_he:
        "אתם מתקרבים למועד בדיקות הקבלה המתוקן. רוב ההחלטות המרכזיות כבר התקבלו, והלקוח מבקש מפגש סיכום לפני כניסה לשלב הבדיקות עצמו.",
      event_he: "עדכון חדש\n\nנציג הלקוח מבקש מכם מצג ביניים שיפרט את מצב התיקון, את מרווח הבטיחות הנוכחי ואת רמת הביטחון שלכם בעמידה במועד המתוקן.",
      decisionPrompt_he: "איך תבנו את מצג הביניים ללקוח?",
      options: [
        {
          key: "transparent_status_with_data",
          label_he: "מצג שקוף הכולל נתונים תומכים ורמת ביטחון מפורשת",
          keywords_he: ["מצג שקוף", "לשתף נתונים מלאים", "רמת ביטחון מפורשת"],
          deltas: { stakeholder_trust: 3 },
          evidence_he: "הציג ללקוח מצג שקוף שכלל את הנתונים התומכים ואת רמת הביטחון בפועל, כולל אי-הוודאות שנותרה.",
          criteriaSignals: { communication: 5, realism: 3 },
        },
        {
          key: "overstate_confidence",
          label_he: "הצגת רמת ביטחון גבוהה מהמוצדק על ידי הנתונים",
          keywords_he: ["להציג ביטחון גבוה", "לא להזכיר אי-ודאות", "להרגיע את הלקוח"],
          deltas: { stakeholder_trust: -2 },
          evidence_he: "הציג ללקוח רמת ביטחון גבוהה מזו שהנתונים שבידיו תמכו בה בפועל.",
          criteriaSignals: {},
        },
        {
          key: "document_lessons_for_future_programs",
          label_he: "תיעוד לקחים מהכשל לטובת תוכניות עתידיות",
          keywords_he: ["תיעוד לקחים", "הפקת לקחים", "לתעד לתוכניות הבאות"],
          deltas: { safety_margin: 1 },
          evidence_he: "תיעד לקחים מתהליך הכשל וההסמכה לטובת תוכניות דומות בעתיד.",
          criteriaSignals: { diagnosis_before_action: 3, knowledge_protection: 3 },
        },
      ],
    },
  ],
};

const vpScenario: Scenario = {
  id: "aviation-defense-vp-1",
  domainKey: "aviation-defense",
  title_he: "סוגיית מרווח בטיחות באבן דרך תוכנית מרכזית",
  roleLevel: "vp",
  difficulty: 5,
  summary_he:
    "מספר שבועות לפני אבן דרך מרכזית בתוכנית 'זמיר', סדרת בדיקות מגלה חריגה לא צפויה במרווח הבטיחות התרמי של תת-מערכת קריטית. הדירקטוריון, הלקוח הממשלתי הבדוי וגוף פיקוח תקציבי ממתינים להחלטה, ונתוני הבדיקות עדיין חלקיים.",
  estimatedMinutes: [25, 35],
  kpis: [
    { key: "schedule", label_he: "לוח זמנים לאבן דרך", unit: "יום", start: 0, min: -45, max: 45, higherIsBetter: true },
    { key: "budget", label_he: "תקציב תוכנית", unit: "₪ מיליון", start: 20, min: 0, max: 40, higherIsBetter: true },
    { key: "safety_margin", label_he: "מרווח בטיחות/הנדסי", unit: "%", start: 88, min: 30, max: 100, higherIsBetter: true },
    { key: "stakeholder_trust", label_he: "אמון לקוח, דירקטוריון ורגולציה", unit: "%", start: 75, min: 0, max: 100, higherIsBetter: true },
  ],
  turns: [
    {
      index: 1,
      situation_he:
        "אתם סמנכ\"ל התוכניות, ואחראים על תוכנית 'זמיר' — תוכנית רב-שנתית ואסטרטגית עבור לקוח ממשלתי בדוי, הנמצאת שבועות ספורים לפני אבן דרך מרכזית הכוללת הדגמת מוכנות מבצעית. סדרת בדיקות אחרונה העלתה חריגה לא צפויה במרווח הבטיחות התרמי של תת-מערכת קריטית בתנאי קצה, שלא זוהתה בסבבי הבדיקות הקודמים. הנתונים חלקיים בלבד — מדובר במדגם בדיקות מצומצם, וטרם ברור אם מדובר בבעיה שיטתית או בחריגה נקודתית. גוף פיקוח תקציבי ממשלתי מלווה את התוכנית, והדירקטוריון כבר קיבל דיווח ראשוני.",
      constraints_he: [
        "אבן דרך מרכזית בעוד מספר שבועות בלבד",
        "מדגם בדיקות מצומצם — לא ברור אם החריגה שיטתית",
        "מעורבות גוף פיקוח תקציבי וממשלתי",
        "רגישות גבוהה לכל תקשורת חיצונית בנושא",
      ],
      availableIntel: [
        { label_he: "ניתוח סטטיסטי מורחב של מדגם הבדיקות", cost: 3, accuracy: 85 },
        { label_he: "חוות דעת מעבדת בדיקות עצמאית חיצונית", cost: 5, accuracy: 93 },
        { label_he: "סקירת תקדימים דומים בתוכניות עבר", cost: 2, accuracy: 70 },
      ],
      decisionPrompt_he: "מה הייתם עושים עכשיו?",
      options: [
        {
          key: "commission_extended_statistical_analysis",
          label_he: "הזמנת ניתוח סטטיסטי מורחב לפני כל החלטה מחייבת",
          keywords_he: ["ניתוח סטטיסטי מורחב", "להרחיב את מדגם הבדיקות", "לבדוק אם החריגה שיטתית"],
          deltas: { budget: -2 },
          evidence_he: "הזמין ניתוח סטטיסטי מורחב של מדגם הבדיקות לפני קביעה האם מדובר בבעיה שיטתית.",
          criteriaSignals: { diagnosis_before_action: 5, information_acquisition: 4 },
          nextEvent_he:
            "עדכון חדש\n\nהניתוח המורחב מצביע על מגמה עקבית בתת-קבוצה מסוימת של יחידות, אך אינו חד-משמעי — נדרש עוד מידע כדי לקבוע אם מדובר בפגם ייצור נקודתי או בבעיית תכן רחבה יותר.",
        },
        {
          key: "proceed_to_milestone_as_planned",
          label_he: "המשך לקראת אבן הדרך כמתוכנן ללא עיכוב",
          keywords_he: ["להמשיך כמתוכנן", "לא לעכב את אבן הדרך", "להתקדם בלוח הזמנים המקורי"],
          deltas: { schedule: 3, safety_margin: -4 },
          evidence_he: "בחר להמשיך לקראת אבן הדרך כמתוכנן, בטרם התבררה מהות החריגה שהתגלתה בבדיקות.",
          criteriaSignals: {},
        },
        {
          key: "commission_independent_lab_review",
          label_he: "הזמנת חוות דעת ממעבדת בדיקות עצמאית",
          keywords_he: ["מעבדה עצמאית", "חוות דעת חיצונית", "בדיקה בלתי תלויה"],
          deltas: { budget: -4, schedule: -1 },
          evidence_he: "הזמין חוות דעת ממעבדה עצמאית חיצונית כדי לקבל הערכה בלתי תלויה על חומרת החריגה.",
          criteriaSignals: { diagnosis_before_action: 4, realism: 3 },
        },
        {
          key: "brief_board_and_oversight_early",
          label_he: "תדרוך מוקדם ושקוף לדירקטוריון ולגוף הפיקוח",
          keywords_he: ["לעדכן דירקטוריון", "לעדכן גוף פיקוח", "שקיפות מוקדמת מול רגולציה"],
          deltas: { stakeholder_trust: 2 },
          evidence_he: "בחר לתדרך את הדירקטוריון וגוף הפיקוח התקציבי מוקדם ובאופן שקוף, בטרם התבררה מלוא התמונה.",
          criteriaSignals: { communication: 4, realism: 2 },
        },
        {
          key: "delay_all_action_pending_full_data",
          label_he: "עצירת כל פעולה עד לקבלת נתונים מלאים",
          keywords_he: ["לעצור הכול עד לנתונים", "לא לפעול בלי מידע מלא", "להמתין לתמונה שלמה"],
          deltas: { schedule: -2 },
          evidence_he: "בחר לעצור כל פעולה נוספת עד לקבלת תמונת נתונים מלאה, ולא פעל על בסיס המידע החלקי הקיים.",
          criteriaSignals: { knowing_when_to_stop: 2 },
        },
      ],
    },
    {
      index: 2,
      situation_he:
        "התמונה מתבהרת חלקית, אך עדיין אינה סופית. הלקוח הממשלתי מבקש עמדה רשמית לגבי האם התוכנית תעמוד באבן הדרך במועד, וגוף הפיקוח התקציבי מבקש הבהרות לגבי החשיפה הכספית האפשרית.",
      event_he:
        "עדכון חדש\n\nהמידע הנוסף מצביע על כך שהחריגה מוגבלת לאצווה ייצור מסוימת של הרכיב, ולא לתכן כולו — אך אימות מלא של המסקנה הזו ידרוש עוד כשלושה שבועות של בדיקות ממוקדות, זמן שאינו קיים לפני אבן הדרך המתוכננת.",
      constraints_he: ["לחץ להצהרה רשמית ללקוח לפני אימות מלא", "חשיפה תקציבית לא ודאית", "זמן אימות נדרש חורג ממועד אבן הדרך"],
      decisionPrompt_he: "מה הייתם עושים עכשיו?",
      options: [
        {
          key: "propose_conditional_milestone",
          label_he: "הצעת אבן דרך מותנית עם תנאים מפורשים",
          keywords_he: ["אבן דרך מותנית", "תנאים מפורשים", "אישור חלקי עם הסתייגות"],
          deltas: { schedule: 1, stakeholder_trust: 2 },
          evidence_he: "הציע ללקוח מסלול של אבן דרך מותנית, הכולל תנאים מפורשים לגבי הבדיקות הנותרות.",
          criteriaSignals: { realism: 5, communication: 4 },
          nextEvent_he:
            "עדכון חדש\n\nהלקוח מוכן לשקול מסלול מותנה, אך מבקש שהתנאים ואבני הביניים ייקבעו במפורש ובכתב לפני האישור הסופי.",
        },
        {
          key: "delay_milestone_pending_full_verification",
          label_he: "דחיית אבן הדרך עד לאימות מלא של המסקנה",
          keywords_he: ["לדחות את אבן הדרך", "להמתין לאימות מלא", "לא להתחייב לפני ודאות"],
          deltas: { schedule: -4, safety_margin: 2 },
          evidence_he: "בחר לדחות את אבן הדרך עד להשלמת אימות מלא של מקור החריגה, במקום להתחייב על בסיס מסקנה חלקית.",
          criteriaSignals: { realism: 3, knowing_when_to_stop: 4 },
        },
        {
          key: "commit_fully_without_verification",
          label_he: "התחייבות מלאה לעמידה באבן הדרך ללא הסתייגות",
          keywords_he: ["התחייבות מלאה", "לאשר ללא הסתייגות", "להבטיח עמידה מלאה"],
          deltas: { stakeholder_trust: -4, safety_margin: -3 },
          evidence_he: "התחייב ללקוח באופן מלא וללא הסתייגות לעמידה באבן הדרך, בטרם אומתה מסקנת הבדיקות.",
          criteriaSignals: {},
        },
        {
          key: "disclose_budget_exposure_to_oversight",
          label_he: "גילוי מלא של החשיפה התקציבית האפשרית לגוף הפיקוח",
          keywords_he: ["גילוי חשיפה תקציבית", "לעדכן פיקוח תקציבי", "שקיפות כספית מול רגולציה"],
          deltas: { budget: -1, stakeholder_trust: 2 },
          evidence_he: "גילה באופן מלא לגוף הפיקוח התקציבי את טווח החשיפה הכספית האפשרית, כולל התרחיש הגרוע.",
          criteriaSignals: { financial_awareness: 4, communication: 3 },
        },
      ],
    },
    {
      index: 3,
      situation_he:
        "הצוות ההנדסי והתפעולי בתוכנית עובד תחת לחץ ממושך מאז גילוי החריגה. יש חילוקי דעות פנימיים בין ראשי תחומים לגבי חומרת הממצא, וחלק מהמידע הקריטי מצוי אצל קבוצה מצומצמת של מומחים בכירים.",
      event_he: "עדכון חדש\n\nשניים ממובילי הבדיקות ההנדסיות מציגים הערכות סיכון שונות באופן משמעותי, וראש תחום האיכות מתריע כי אין תיעוד מספק של תהליך קבלת ההחלטות עד כה.",
      constraints_he: ["חילוקי דעות מקצועיים בין בכירים", "ריכוז ידע קריטי אצל מספר מצומצם של אנשים", "עומס ממושך על הצוות"],
      decisionPrompt_he: "איך תנהלו את הפער המקצועי ואת ניהול הידע בשלב הזה?",
      options: [
        {
          key: "convene_structured_review_board",
          label_he: "כינוס ועדת סקירה הנדסית מובנית להכרעה בין ההערכות",
          keywords_he: ["ועדת סקירה הנדסית", "הכרעה מקצועית מובנית", "פאנל הערכת סיכון"],
          deltas: { safety_margin: 2 },
          evidence_he: "כינס ועדת סקירה הנדסית מובנית כדי להכריע בין הערכות הסיכון השונות, במקום להכריע לבד.",
          criteriaSignals: { diagnosis_before_action: 4, prioritization: 3 },
        },
        {
          key: "mandate_decision_documentation",
          label_he: "חיוב תיעוד שיטתי של כל שלב בתהליך ההחלטה",
          keywords_he: ["לתעד תהליך החלטה", "תיעוד שיטתי", "לשמור רציונל בכתב"],
          deltas: {},
          evidence_he: "חייב תיעוד שיטתי של תהליך קבלת ההחלטות וההערכות המקצועיות השונות לאורך התהליך.",
          criteriaSignals: { knowledge_protection: 5, communication: 2 },
        },
        {
          key: "redistribute_review_workload",
          label_he: "חלוקה מחדש של עומס הבדיקות בין צוותי הנדסה נוספים",
          keywords_he: ["לחלק מחדש עומס בדיקות", "לגייס עוד מהנדסים לבדיקה", "לפזר את עומס הבדיקות"],
          deltas: { budget: -2, safety_margin: 1 },
          evidence_he: "חילק מחדש את עומס הבדיקות בין צוותי הנדסה נוספים כדי להקל על המומחים המרכזיים.",
          criteriaSignals: { workload_management: 4 },
        },
        {
          key: "side_with_optimistic_assessment",
          label_he: "אימוץ ההערכה האופטימית מבין השתיים ללא בירור נוסף",
          keywords_he: ["לבחור בהערכה האופטימית", "ללכת עם ההערכה הנוחה", "לא לבדוק את הפער בין ההערכות"],
          deltas: { safety_margin: -3, schedule: 2 },
          evidence_he: "אימץ את ההערכה האופטימית מבין השתיים מבלי לברר לעומק את מקור הפער ביניהן.",
          criteriaSignals: {},
        },
      ],
    },
    {
      index: 4,
      situation_he:
        "מועד אבן הדרך המותנית מתקרב. חלק מהתנאים שנקבעו מול הלקוח מולאו, וחלקם עדיין בבירור. הדירקטוריון, הלקוח וגוף הפיקוח התקציבי ממתינים כולם למצג סיכום אחד ומשותף.",
      event_he: "עדכון חדש\n\nיו\"ר הדירקטוריון מבקש ממכם להציג בפגישה אחת, מול כל בעלי העניין יחד, את מצב אבן הדרך, את מרווח הבטיחות הנוכחי ואת תוכנית ההמשך.",
      decisionPrompt_he: "איך תבנו את מצג הסיכום המשותף לכל בעלי העניין?",
      options: [
        {
          key: "unified_transparent_summary_with_plan",
          label_he: "מצג שקוף ואחיד לכל בעלי העניין הכולל תוכנית המשך מוגדרת",
          keywords_he: ["מצג שקוף לכולם", "מסר אחיד לכל בעלי העניין", "תוכנית המשך מוגדרת"],
          deltas: { stakeholder_trust: 4 },
          evidence_he: "בנה מצג שקוף ואחיד לכל בעלי העניין יחד, שכלל את מצב הבטיחות בפועל ותוכנית המשך מוגדרת.",
          criteriaSignals: { communication: 5, realism: 4 },
        },
        {
          key: "tailor_different_messages_per_audience",
          label_he: "התאמת מסרים שונים לכל קהל בנפרד",
          keywords_he: ["מסר שונה לכל גורם", "להתאים דיווח לפי קהל", "לספר לכל אחד משהו אחר"],
          deltas: { stakeholder_trust: -3 },
          evidence_he: "בחר להתאים מסרים שונים באופן מהותי לכל אחד מבעלי העניין בנפרד, במקום מצג אחיד.",
          criteriaSignals: {},
        },
        {
          key: "propose_program_level_process_change",
          label_he: "הצעת שינוי מבני בתהליכי הבדיקה וההסמכה לתוכנית",
          keywords_he: ["שינוי תהליך בדיקה", "לשפר תהליכי הסמכה", "לקחים מבניים לתוכנית"],
          deltas: { budget: -2, safety_margin: 2 },
          evidence_he: "הציע שינוי מבני בתהליכי הבדיקה וההסמכה של התוכנית כדי להפחית סיכון דומה בעתיד.",
          criteriaSignals: { diagnosis_before_action: 4, realism: 3 },
        },
      ],
    },
  ],
};

const scenarios: Scenario[] = [managerScenario, vpScenario];
export default scenarios;
