import type { Scenario } from "@/lib/scenario-schema";

/**
 * Retail & Consumer (קמעונאות וצרכנות) domain content.
 * Follows the shape defined in content/scenarios/supply-chain.ts:
 * a KPI set (max 4, per Master Spec §11), 4 turns, and a canonical action
 * vocabulary per turn with keyword hints, deltas, evidence text and
 * criteria signals (from the fixed CRITERIA list in lib/scenario-schema.ts).
 */

const managerKpis: Scenario["kpis"] = [
  { key: "inventory_balance", label_he: "איזון מלאי בין סניפים", unit: "%", start: 65, min: 0, max: 100, higherIsBetter: true },
  { key: "sell_through", label_he: "אחוז מימוש מלאי (Sell-Through)", unit: "%", start: 58, min: 0, max: 100, higherIsBetter: true },
  { key: "customer_satisfaction", label_he: "שביעות רצון לקוחות", unit: "%", start: 74, min: 0, max: 100, higherIsBetter: true },
  { key: "margin", label_he: "רווחיות גולמית", unit: "₪ אלף", start: 320, min: 0, max: 600, higherIsBetter: true },
];

const managerScenario: Scenario = {
  id: "retail-manager-1",
  domainKey: "retail",
  title_he: "קפיצת ביקוש בלתי צפויה במוצר עונתי",
  roleLevel: "manager",
  difficulty: 2,
  summary_he:
    "קפיצת ביקוש פתאומית במוצר עונתי גורמת למחסור בחלק מהסניפים ולעודף מלאי בסניפים אחרים. נדרשות החלטות מהירות על הקצאת מלאי, תמחור ותקשורת מול הסניפים.",
  estimatedMinutes: [20, 30],
  kpis: managerKpis,
  turns: [
    {
      index: 1,
      situation_he:
        "אתם מנהלים את התפעול הקמעונאי באזור המרכז, האחראי על 18 סניפים. בעקבות גל חום מוקדם ופרסום ויראלי ברשתות החברתיות, הביקוש למאוורר נייד קומפקטי - מוצר עונתי מרכזי - זינק פי שלושה בתוך שבוע. שלושה סניפים במרכזי הערים נותרו כבר ללא מלאי כלל, בעוד שני סניפים בפריפריה מחזיקים עודף מלאי משמעותי מאותו מוצר. צוות השירות מדווח על תלונות לקוחות גוברות.",
      constraints_he: [
        "תקציב הובלה בין-סניפי מוגבל",
        "מלאי מרכזי נוסף מוגבל",
        "חלון זמן קצר לפני סוף השבוע - שיא הביקוש",
      ],
      availableIntel: [
        { label_he: "דוח מלאי בזמן אמת לפי סניף", cost: 1, accuracy: 90 },
        { label_he: "תחזית ביקוש מעודכנת לשבוע הקרוב", cost: 2, accuracy: 75 },
        { label_he: "ניתוח רגישות מחיר של הלקוחות", cost: 2, accuracy: 65 },
      ],
      decisionPrompt_he: "מה היית עושה עכשיו?",
      options: [
        {
          key: "reallocate_inventory_between_stores",
          label_he: "העברת מלאי מהירה בין סניפים",
          keywords_he: ["להעביר מלאי בין סניפים", "לשנע מלאי מסניף לסניף", "לאזן מלאי בין סניפים", "reallocation בין סניפים"],
          deltas: { inventory_balance: 4, margin: -1, sell_through: 4 },
          evidence_he: "העביר מלאי מסניפים עם עודף לסניפים עם מחסור בתוך זמן קצר.",
          criteriaSignals: { diagnosis_before_action: 3, prioritization: 3 },
          nextEvent_he:
            "עדכון חדש\n\nההעברה בין הסניפים הצליחה חלקית - אחד הסניפים המקבלים דיווח שקיבל רק כשני שלישים מהכמות המבוקשת, וספק חיצוני פנה בהצעה למלאי נוסף במחיר מיוחד.",
        },
        {
          key: "order_emergency_stock_from_supplier",
          label_he: "הזמנת מלאי חירום מהספק המרכזי",
          keywords_he: ["הזמנת מלאי חירום", "לפנות לספק בבקשה דחופה", "לחדש מלאי מהספק"],
          deltas: { inventory_balance: 2, margin: -2 },
          evidence_he: "פנה לספק המרכזי בבקשה למלאי חירום נוסף מעבר להזמנה הרגילה.",
          criteriaSignals: { realism: 3, financial_awareness: 2 },
        },
        {
          key: "raise_price_in_shortage_stores",
          label_he: "העלאת מחיר זמנית בסניפים עם מחסור",
          keywords_he: ["להעלות מחיר", "תמחור דינמי", "ייקור זמני של המוצר"],
          deltas: { margin: 3, customer_satisfaction: -4, sell_through: -2 },
          evidence_he: "העלה את מחיר המוצר באופן זמני בסניפים שבהם קיים מחסור.",
          criteriaSignals: { financial_awareness: 2, realism: 1 },
        },
        {
          key: "communicate_to_store_managers",
          label_he: "עדכון מנהלי הסניפים על המצב והכיוון",
          keywords_he: ["לעדכן מנהלי סניפים", "תדרוך צוותי סניף", "ליידע את הסניפים"],
          deltas: {},
          evidence_he: "עדכן את מנהלי הסניפים במצב המלאי ובכיוון הפעולה לפני שנקט צעדים נוספים.",
          criteriaSignals: { communication: 4 },
        },
        {
          key: "gather_realtime_inventory_data",
          label_he: "בדיקת נתוני מלאי בזמן אמת לפני החלטה",
          keywords_he: ["לבדוק מלאי בזמן אמת", "לאסוף נתונים לפני שמחליטים", "לבחון את התמונה המלאה קודם"],
          deltas: {},
          evidence_he: "בדק את נתוני המלאי בזמן אמת בכל הסניפים לפני קבלת החלטה מחייבת.",
          criteriaSignals: { information_acquisition: 4, diagnosis_before_action: 2 },
        },
      ],
    },
    {
      index: 2,
      situation_he:
        "ההחלטה שקיבלת השפיעה על חלוקת המלאי, אך הביקוש למוצר ממשיך לעלות והמלאי הכולל באזור מצטמצם במהירות.",
      event_he:
        "עדכון חדש\n\nרשת מתחרה הודיעה על מבצע אגרסיבי על מוצר דומה, וצוות השיווק האזורי מבקש הנחיה דחופה לגבי תגובה.",
      constraints_he: ["מלאי כולל מצטמצם", "לחץ תחרותי חדש"],
      availableIntel: [
        { label_he: "נתוני מכירות יומיים לפי סניף מאז ההחלטה", cost: 1, accuracy: 95 },
        { label_he: "זמינות מלאי אצל הספק לשבוע הקרוב", cost: 2, accuracy: 80 },
        { label_he: "ניתוח רגישות מחיר בקטגוריה בעונה קודמת", cost: 2, accuracy: 70 },
      ],
      decisionPrompt_he: "מה הייתם עושים עכשיו?",
      options: [
        {
          key: "match_competitor_promotion",
          label_he: "התאמת מבצע מול הרשת המתחרה",
          keywords_he: ["להתאים מבצע", "לתת הנחה מקבילה", "תגובה תחרותית במחיר"],
          deltas: { margin: -3, customer_satisfaction: 2, sell_through: 3 },
          evidence_he: "בחר להתאים את המחיר למבצע של הרשת המתחרה.",
          criteriaSignals: { realism: 2, financial_awareness: 1 },
        },
        {
          key: "limit_purchase_quantity_per_customer",
          label_he: "הגבלת כמות רכישה ללקוח בסניפים עם מחסור",
          keywords_he: ["הגבלת כמות ללקוח", "מקסימום יחידות ללקוח", "לצמצם רכישה מרוכזת"],
          deltas: { inventory_balance: 2, customer_satisfaction: -1, sell_through: -2 },
          evidence_he: "הגביל את כמות הרכישה ללקוח בסניפים עם מחסור כדי לפרוס את המלאי הנותר.",
          criteriaSignals: { diagnosis_before_action: 3, prioritization: 2 },
          nextEvent_he:
            "עדכון חדש\n\nההגבלה מיתנה את קצב אזילת המלאי, אך כמה לקוחות קבועים התלוננו ברשתות החברתיות על המדיניות.",
        },
        {
          key: "escalate_to_category_manager",
          label_he: "העלאת הנושא למנהל הקטגוריה הארצי",
          keywords_he: ["לעדכן מנהל קטגוריה", "להעלות לרמה ארצית", "לבקש הנחיה ממטה"],
          deltas: {},
          evidence_he: "העלה את הנושא למנהל הקטגוריה הארצי לפני נקיטת צעד נוסף בעל השפעה רחבה.",
          criteriaSignals: { communication: 3, knowing_when_to_stop: 2 },
        },
        {
          key: "ignore_competitor_stay_course",
          label_he: "המשך במדיניות הקיימת ללא שינוי",
          keywords_he: ["להתעלם מהמתחרה", "להמשיך כרגיל", "לא לשנות מדיניות"],
          deltas: { customer_satisfaction: -2, sell_through: -3 },
          evidence_he: "בחר להמשיך במדיניות הקיימת מבלי להתייחס למהלך המתחרה.",
          criteriaSignals: { diagnosis_before_action: 1, knowing_when_to_stop: 1, realism: 1 },
        },
      ],
    },
    {
      index: 3,
      situation_he:
        "הסניפים העמוסים מדווחים על תורים ולחץ על צוותי המכירה, בעוד סניפי הפריפריה עדיין מחזיקים מלאי עודף שאינו זז.",
      event_he:
        "עדכון חדש\n\nמנהלת אחד הסניפים העמוסים מדווחת על עייפות הצוות ומבקשת תגבור, ובמקביל מנהל סניף בפריפריה שואל האם לבצע מכירת חיסול על העודף.",
      constraints_he: ["צוותי מכירה עמוסים", "מלאי עודף שאינו זז בסניפי הפריפריה"],
      decisionPrompt_he: "איך תנהלו את הצוותים ואת המלאי העודף בשלב הזה?",
      options: [
        {
          key: "temp_staff_support_busy_stores",
          label_he: "תגבור זמני לסניפים העמוסים",
          keywords_he: ["תגבור זמני", "כוח אדם נוסף לסניף", "עובדים נוספים לשעות שיא"],
          deltas: { margin: -1, customer_satisfaction: 2 },
          evidence_he: "הביא תגבור זמני לסניפים העמוסים לאחר שזוהו סימני עומס אצל הצוות.",
          criteriaSignals: { workload_management: 4 },
          nextEvent_he:
            "עדכון חדש\n\nהתגבור לסניפים העמוסים עבד: התורים התקצרו משמעותית, ושביעות הרצון בסניפים המרכזיים יציבה לקראת סוף העונה.",
        },
        {
          key: "clearance_sale_surplus_stores",
          label_he: "מכירת חיסול על העודף בסניפי הפריפריה",
          keywords_he: ["מכירת חיסול", "הנחה על עודף מלאי", "לפנות מלאי עודף במחיר מוזל"],
          deltas: { margin: -2, inventory_balance: 3, sell_through: 6 },
          evidence_he: "יזם מכירת חיסול על המלאי העודף בסניפי הפריפריה כדי לפנות מקום ולממש ערך.",
          criteriaSignals: { diagnosis_before_action: 2, realism: 2 },
        },
        {
          key: "document_reallocation_process",
          label_he: "תיעוד תהליך ההעברה בין הסניפים לשימוש עתידי",
          keywords_he: ["לתעד תהליך", "תיעוד לקחים תוך כדי", "לשמור נהלים לפעם הבאה"],
          deltas: {},
          evidence_he: "תיעד את תהליך ההעברה בין הסניפים כדי שניתן יהיה לחזור עליו במקרה עתידי דומה.",
          criteriaSignals: { knowledge_protection: 4 },
        },
        {
          key: "push_through_no_change",
          label_he: "המשך ללא שינוי בהקצאת כוח האדם או המלאי",
          keywords_he: ["להמשיך כרגיל", "לא לשנות הקצאה", "להתקדם כמתוכנן"],
          deltas: { customer_satisfaction: -2, sell_through: -2 },
          evidence_he: "בחר להמשיך ללא שינוי בהקצאת כוח האדם או במלאי העודף.",
          criteriaSignals: { realism: 2, workload_management: 1 },
          nextEvent_he:
            "עדכון חדש\n\nהעומס גבה מחיר: תור ארוך בסניף עמוס הוביל לתלונת לקוח שהגיעה לרשתות החברתיות, בזמן שמלאי עודף עדיין תקוע בפריפריה.",
        },
      ],
    },
    {
      index: 4,
      situation_he:
        "שיא העונה חלף. חלק מהסניפים הצליחו לעמוד בביקוש וחלקם עדיין מדווחים על אכזבת לקוחות. ההנהלה האזורית מבקשת סיכום לפני ישיבת ההנהלה השבועית.",
      event_he:
        "עדכון חדש\n\nמנהל האזור מבקש מכם תקציר קצר על מה שקרה ועל הלקחים לקראת גל הביקוש הבא.",
      decisionPrompt_he: "איך תסכמו את האירוע?",
      options: [
        {
          key: "transparent_summary_with_recommendations",
          label_he: "סיכום שקוף הכולל המלצות לעתיד",
          keywords_he: ["סיכום שקוף", "המלצות להמשך", "דיווח מלא כולל לקחים"],
          deltas: { customer_satisfaction: 1 },
          evidence_he: "מסר סיכום שקוף שכלל גם המלצות קונקרטיות לקראת גל ביקוש עתידי.",
          criteriaSignals: { communication: 4, realism: 3 },
        },
        {
          key: "highlight_only_successes",
          label_he: "הצגת ההצלחות בלבד בסיכום",
          keywords_he: ["להציג רק הצלחות", "לא להזכיר כשלים", "סיכום חיובי בלבד"],
          deltas: {},
          evidence_he: "התמקד בהיבטים המוצלחים של הטיפול באירוע, מבלי להזכיר את הכשלים שהתגלו.",
          criteriaSignals: { communication: 1, realism: 1 },
        },
        {
          key: "propose_dynamic_allocation_process",
          label_he: "הצעת תהליך הקצאת מלאי דינמי קבוע",
          keywords_he: ["תהליך הקצאה דינמי", "לשנות נוהל מלאי", "מנגנון קבוע להעברות בין סניפים"],
          deltas: { margin: 1 },
          evidence_he: "הציע לקבוע תהליך הקצאת מלאי דינמי בין סניפים לקראת עונות ביקוש עתידיות.",
          criteriaSignals: { diagnosis_before_action: 3, prioritization: 2 },
        },
      ],
    },
  ],
};

const vpScenario: Scenario = {
  id: "retail-vp-1",
  domainKey: "retail",
  title_he: "פער מלאי עונתי ברמת הרשת ערב שיא המכירות",
  roleLevel: "vp",
  difficulty: 4,
  summary_he:
    "רכש עונתי מרכזי אינו נמכר כמתוכנן ערב תקופת המכירות הקריטית ביותר בשנה, עם השלכות על רווחיות, תזרים ותדמית המותג, ונתוני מכירה בזמן אמת חלקיים בלבד.",
  estimatedMinutes: [25, 35],
  kpis: [
    { key: "excess_inventory", label_he: "מלאי עודף מהרכישה העונתית", unit: "₪ מיליון", start: 24, min: 0, max: 45, higherIsBetter: false },
    { key: "sell_through", label_he: "אחוז מימוש מלאי עונתי (Sell-Through)", unit: "%", start: 38, min: 0, max: 100, higherIsBetter: true },
    { key: "margin", label_he: "רווחיות גולמית עונתית", unit: "%", start: 41, min: 0, max: 60, higherIsBetter: true },
    { key: "brand_perception", label_he: "תפיסת המותג בציבור", unit: "%", start: 70, min: 0, max: 100, higherIsBetter: true },
  ],
  turns: [
    {
      index: 1,
      situation_he:
        "אתם סמנכ\"ל המרצ'נדייז והתפעול ברשת קמעונאות ארצית. רכש עונתי מרכזי שבוצע לפני כחצי שנה עבור קולקציית הסתיו-חורף אינו נמכר בקצב שנחזה - נתוני המכירות בשבועיים האחרונים מצביעים על פער של כשליש מהתחזית, ימים בודדים לפני תקופת המכירות הקריטית ביותר בשנה. הנתונים בזמן אמת מהחנויות חלקיים בלבד, והדירקטוריון כבר ביקש עדכון דחוף.",
      constraints_he: [
        "ימים בודדים לפני שיא העונה",
        "נתוני מכירה בזמן אמת חלקיים",
        "לחץ מהדירקטוריון לתשובות מיידיות",
      ],
      availableIntel: [
        { label_he: "ניתוח sell-through לפי קטגוריה וחנות", cost: 2, accuracy: 80 },
        { label_he: "תחזית ביקוש מעודכנת מבוססת נתוני עונה קודמת", cost: 3, accuracy: 70 },
        { label_he: "בדיקת עלות מלאי ותזרים חלופות", cost: 4, accuracy: 90 },
      ],
      decisionPrompt_he: "מה הייתם עושים עכשיו?",
      options: [
        {
          key: "commission_full_sellthrough_analysis",
          label_he: "הזמנת ניתוח sell-through מלא לפי קטגוריה",
          keywords_he: ["ניתוח sell-through", "לבדוק נתונים לפי קטגוריה", "מיפוי הפער לפני החלטה"],
          deltas: { margin: -1 },
          evidence_he: "הזמין ניתוח sell-through מלא לפי קטגוריה וחנות לפני שהתחייב למהלך רחב.",
          criteriaSignals: { diagnosis_before_action: 5, information_acquisition: 4 },
          nextEvent_he:
            "עדכון חדש\n\nהניתוח חשף שהפער מרוכז בעיקר בשתי קטגוריות מרכזיות ובכ-120 חנויות עירוניות, בעוד חנויות אחרות קרובות ליעד. ספק הקולקציה הציע מסגרת החזרה חלקית בתנאים מסוימים.",
        },
        {
          key: "initiate_immediate_markdown",
          label_he: "יזום הורדת מחירים מיידית ורחבה",
          keywords_he: ["הורדת מחירים מיידית", "מבצע רחב על הקולקציה", "markdown מיידי בכל הרשת"],
          deltas: { excess_inventory: -4, margin: -3 },
          evidence_he: "יזם הורדת מחירים רחבה על הקולקציה כולה מיד, בטרם התבררה התמונה המלאה של הפער.",
          criteriaSignals: { realism: 2, diagnosis_before_action: 1, financial_awareness: 2 },
        },
        {
          key: "brief_board_with_initial_data",
          label_he: "תדרוך הדירקטוריון עם הנתונים הראשוניים הזמינים",
          keywords_he: ["לתדרך דירקטוריון", "לעדכן הנהלה בכירה מיד", "שקיפות מוקדמת לדירקטוריון"],
          deltas: { brand_perception: 1 },
          evidence_he: "בחר לתדרך את הדירקטוריון עם הנתונים הראשוניים הזמינים, תוך ציון מפורש של אי-הוודאות שנותרה.",
          criteriaSignals: { communication: 5, realism: 4 },
        },
        {
          key: "delay_until_more_data",
          label_he: "עיכוב כל החלטה עד לקבלת נתונים מלאים",
          keywords_he: ["להמתין לנתונים מלאים", "לא להחליט עדיין", "לחכות לתמונה שלמה"],
          deltas: { excess_inventory: 1 },
          evidence_he: "בחר להמתין לנתונים מלאים לפני כל החלטה, על אף הלחץ בלוח הזמנים.",
          criteriaSignals: { knowing_when_to_stop: 2, information_acquisition: 2 },
        },
      ],
    },
    {
      index: 2,
      situation_he:
        "הניתוח מצביע על ריכוז הבעיה בשתי קטגוריות ובחנויות עירוניות ספציפיות. עונת השיא נפתחת בעוד ימים בודדים, וצוות הכספים מתריע על השפעה אפשרית על תחזית הרווחיות הרבעונית.",
      event_he:
        "עדכון חדש\n\nספק הקולקציה מציע להחזיר חלק מהמלאי תמורת זיכוי, אך רק אם ההחלטה תתקבל תוך 48 שעות. במקביל, צוות השיווק מבקש אישור למבצע פרסומי ממוקד.",
      constraints_he: ["חלון החלטה של 48 שעות מול הספק", "השפעה אפשרית על תחזית הרווחיות הרבעונית"],
      availableIntel: [
        { label_he: "ניתוח סל קניות בחנויות העירוניות שזוהו", cost: 3, accuracy: 85 },
        { label_he: "תחזית מכירות לעונת השיא לפי קטגוריה", cost: 3, accuracy: 70 },
        { label_he: "הערכת השפעת הורדת מחירים על הרווח הרבעוני", cost: 2, accuracy: 90 },
      ],
      decisionPrompt_he: "מה הייתם עושים עכשיו?",
      options: [
        {
          key: "negotiate_partial_return_with_supplier",
          label_he: "משא ומתן על החזרת מלאי חלקית לספק",
          keywords_he: ["להחזיר מלאי לספק", "משא ומתן עם הספק", "זיכוי חלקי על הרכישה"],
          deltas: { excess_inventory: -5, margin: 1 },
          evidence_he: "פתח במשא ומתן עם הספק על החזרת חלק מהמלאי תמורת זיכוי, במקום לספוג את מלוא ההפסד.",
          criteriaSignals: { financial_awareness: 4, realism: 3 },
          nextEvent_he:
            "עדכון חדש\n\nהספק אישר זיכוי חלקי על כ-30% מהמלאי, אך רק בתנאי שהרשת תתחייב להזמנה מוקדמת לעונה הבאה.",
        },
        {
          key: "targeted_regional_promotion",
          label_he: "מבצע פרסומי ממוקד בחנויות העירוניות",
          keywords_he: ["מבצע ממוקד", "פרסום ממוקד לפי אזור", "קמפיין נקודתי לחנויות עירוניות"],
          deltas: { sell_through: 4, margin: -2 },
          evidence_he: "אישר מבצע פרסומי ממוקד לחנויות העירוניות שבהן רוכז עיקר הפער, במקום מבצע ארצי רחב.",
          criteriaSignals: { prioritization: 4, diagnosis_before_action: 2 },
        },
        {
          key: "full_chainwide_clearance",
          label_he: "מכירת חיסול רחבה בכל הרשת",
          keywords_he: ["חיסול ארצי", "מבצע בכל הרשת", "הנחה גורפת על כל הקולקציה"],
          deltas: { excess_inventory: -6, margin: -5 },
          evidence_he: "יזם מכירת חיסול רחבה בכל הרשת על הקולקציה כולה, כולל בחנויות שלא היו קרובות ליעד המקורי.",
          criteriaSignals: { diagnosis_before_action: 1, knowing_when_to_stop: 1, realism: 1 },
        },
        {
          key: "absorb_loss_without_action",
          label_he: "המתנה לשיפור טבעי בביקוש ללא מהלך יזום",
          keywords_he: ["להמתין לשיפור טבעי", "לא לפעול כרגע", "לתת לשוק להתאזן לבד"],
          deltas: { excess_inventory: 2, brand_perception: -1 },
          evidence_he: "בחר להמתין לשיפור טבעי בביקוש מבלי ליזום מהלך תיקון.",
          criteriaSignals: { knowing_when_to_stop: 2, diagnosis_before_action: 2, prioritization: 1 },
        },
      ],
    },
    {
      index: 3,
      situation_he:
        "הצוותים המרכזיים - מרצ'נדייזינג, כספים ושיווק - עובדים תחת לחץ מתמשך, וחלק מההחלטות מגיעות לחנויות ללא הקשר מספק. מנהלת אזור בכירה מדווחת על בלבול בשטח לגבי מדיניות המחיר.",
      event_he:
        "עדכון חדש\n\nמנהלת האזור מבקשת שיחה דחופה על אופן העברת ההנחיות לשטח, וצוות משאבי אנוש מתריע על סימני עומס אצל כמה מאנשי המפתח בצוות המרצ'נדייזינג.",
      constraints_he: ["ריבוי בעלי עניין פנימיים", "סימני עומס אצל אנשי מפתח"],
      decisionPrompt_he: "איך תתמודדו עם הפער בתקשורת ובעומס על הצוות?",
      options: [
        {
          key: "structured_field_briefing",
          label_he: "תדרוך מובנה ואחיד לכל מנהלי האזורים",
          keywords_he: ["תדרוך מובנה", "הנחיה אחידה לשטח", "לשתף הקשר מלא עם מנהלי אזור"],
          deltas: { brand_perception: 1 },
          evidence_he: "מסר תדרוך מובנה ואחיד לכל מנהלי האזורים, שכלל את ההקשר המלא מאחורי ההחלטות.",
          criteriaSignals: { communication: 5 },
          nextEvent_he:
            "עדכון חדש\n\nהתדרוך המובנה עבד: כל מנהלי האזורים מיישמים את מדיניות המחיר בעקביות, וההנהלה האזורית מדווחת על ירידה בבלבול בשטח.",
        },
        {
          key: "redistribute_merchandising_workload",
          label_he: "חלוקה מחדש של העומס בצוות המרצ'נדייזינג",
          keywords_he: ["לחלק מחדש עומס", "לאזן עומס בצוות", "לפזר משימות בין אנשי הצוות"],
          deltas: {},
          evidence_he: "חילק מחדש את העומס בצוות המרצ'נדייזינג לאחר שזוהו סימני שחיקה אצל אנשי מפתח.",
          criteriaSignals: { workload_management: 4 },
        },
        {
          key: "document_decision_trail",
          label_he: "תיעוד שיטתי של רציונל ההחלטות המרכזיות",
          keywords_he: ["לתעד רציונל", "תיעוד החלטות מרכזיות", "לשמור הקשר בכתב לצוות"],
          deltas: {},
          evidence_he: "התחיל בתיעוד שיטתי של הרציונל מאחורי ההחלטות המרכזיות בתקופה הזו.",
          criteriaSignals: { knowledge_protection: 4 },
        },
        {
          key: "keep_centralized_no_delegation",
          label_he: "שמירת כל ההחלטות במרכז ללא האצלה לאזורים",
          keywords_he: ["לרכז החלטות", "לא להאציל סמכות", "כל ההנחיות דרך המטה"],
          deltas: { brand_perception: -1 },
          evidence_he: "בחר לשמור את כל ההחלטות במרכז, ללא האצלת סמכות למנהלי האזורים.",
          criteriaSignals: { workload_management: 1, knowledge_protection: 1, communication: 2 },
          nextEvent_he:
            "עדכון חדש\n\nריכוז ההחלטות במרכז יצר בלבול בשטח: שני אזורים יישמו את מדיניות המחיר בצורה שונה בגלל עיכוב באישור, ותלונות לקוחות על חוסר עקביות מתחילות להצטבר.",
        },
      ],
    },
    {
      index: 4,
      situation_he:
        "עונת השיא בעיצומה. חלק מהיעדים תוקנו בהצלחה, וחלקם עדיין רחוקים מהתחזית המקורית. הדירקטוריון והמשקיעים ממתינים לסיכום רבעוני שיכלול גם השלכות קדימה.",
      event_he:
        "עדכון חדש\n\nיו\"ר הדירקטוריון מבקש מכם לסכם את האירוע כולו בישיבה אחת, כולל השלכות על תהליך התכנון והרכש לעונה הבאה.",
      decisionPrompt_he: "איך תבנו את הסיכום לדירקטוריון?",
      options: [
        {
          key: "full_transparency_with_process_change",
          label_he: "סיכום שקוף הכולל שינוי מוצע בתהליך הרכש העונתי",
          keywords_he: ["סיכום שקוף", "שינוי בתהליך הרכש", "המלצה קונקרטית קדימה"],
          deltas: { brand_perception: 2 },
          evidence_he: "בנה סיכום שקוף לדירקטוריון שכלל גם הצעה קונקרטית לשינוי בתהליך התכנון והרכש העונתי.",
          criteriaSignals: { communication: 5, realism: 4 },
        },
        {
          key: "minimize_impact_in_summary",
          label_he: "הצגת ההשפעה כמינימלית מול הדירקטוריון",
          keywords_he: ["למזער את הדיווח", "להציג כקטן", "לא להדגיש את הפער"],
          deltas: { brand_perception: -2 },
          evidence_he: "בחר להציג את ההשפעה כמינימלית מול הדירקטוריון, מעבר למה שהנתונים תמכו בו.",
          criteriaSignals: { communication: 1, realism: 1 },
        },
        {
          key: "propose_forecasting_investment",
          label_he: "הצעת השקעה בשיפור יכולות תחזית ביקוש",
          keywords_he: ["השקעה בתחזית ביקוש", "לשפר תהליך תכנון רכש", "כלי תחזית מדויקים יותר"],
          deltas: { margin: -1 },
          evidence_he: "הציע השקעה בשיפור יכולות תחזית הביקוש כדי להפחית את הסיכון לפער דומה בעתיד.",
          criteriaSignals: { diagnosis_before_action: 4, realism: 2 },
        },
      ],
    },
  ],
};

const scenarios: Scenario[] = [managerScenario, vpScenario];
export default scenarios;
