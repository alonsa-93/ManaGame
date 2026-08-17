import type { Domain } from "@/lib/scenario-schema";

export const DOMAINS: Domain[] = [
  {
    key: "supply-chain",
    name_he: "שרשרת אספקה ותפעול",
    name_en: "Supply Chain & Operations",
    icon: "Truck",
    description_he: "החלטות תפעול, ספקים, לוחות זמנים ותקציב חירום תחת אי-ודאות.",
  },
  {
    key: "finance",
    name_he: "כספים ותכנון פיננסי",
    name_en: "Finance & FP&A",
    icon: "Landmark",
    description_he: "תקציב, תזרים, השקעות והחלטות פיננסיות תחת לחץ זמן.",
  },
  {
    key: "product-rd",
    name_he: "מוצר ופיתוח",
    name_en: "Product & R&D",
    icon: "FlaskConical",
    description_he: "תעדוף פיצ'רים, חוב טכני, מועדי השקה ואיזון בין איכות למהירות.",
  },
  {
    key: "sales",
    name_he: "מכירות והכנסות",
    name_en: "Sales & Revenue",
    icon: "TrendingUp",
    description_he: "משא ומתן מול לקוחות, תמחור, יעדים רבעוניים ושימור לקוחות מרכזיים.",
  },
  {
    key: "healthcare",
    name_he: "מכשור רפואי ובריאות",
    name_en: "Medical Devices & Healthcare",
    icon: "HeartPulse",
    description_he: "רגולציה, בטיחות מטופלים ולוחות זמנים במערכת רגישה לסיכון.",
  },
  {
    key: "semiconductors",
    name_he: "ייצור מוליכים למחצה",
    name_en: "Semiconductor Manufacturing",
    icon: "Cpu",
    description_he: "תפוקה, תשואה (Yield), עצירות קו ייצור והחלטות הון עתירות סיכון.",
  },
  {
    key: "aviation-defense",
    name_he: "תעופה וביטחון",
    name_en: "Aviation & Defense",
    icon: "Plane",
    description_he: "תוכניות רב-שנתיות, בטיחות, ספקים ביטחוניים ורגישות תקציבית גבוהה.",
  },
  {
    key: "retail",
    name_he: "קמעונאות וצרכנות",
    name_en: "Retail & Consumer",
    icon: "ShoppingBag",
    description_he: "עונתיות, מלאי, חוויית לקוח ותחרות מחירים בשוק צרכני.",
  },
  {
    key: "people",
    name_he: "משאבי אנוש וניהול אנשים",
    name_en: "People & HR Leadership",
    icon: "Users",
    description_he: "עומס צוות, שימור עובדים מפתח, קונפליקטים ותקשורת ארגונית.",
  },
  {
    key: "cybersecurity",
    name_he: "אבטחת מידע ותגובה לאירועים",
    name_en: "Cybersecurity & Incident Response",
    icon: "ShieldAlert",
    description_he: "תגובה לאירוע אבטחה, תקשורת עם לקוחות ורגולציה תחת לחץ זמן קיצוני.",
  },
];

export function getDomain(key: string): Domain | undefined {
  return DOMAINS.find((d) => d.key === key);
}
