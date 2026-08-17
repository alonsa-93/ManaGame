import { Building2, ClipboardCheck, UserCheck, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const cases = [
  {
    icon: Building2,
    title: "ארגונים",
    body: "ארגונים שרוצים לראות קבלת החלטות בתוך סביבה מורכבת, ולא להסתמך רק על רושם ראשוני או על תשובה אחת.",
  },
  {
    icon: ClipboardCheck,
    title: "מעריכים",
    body: "מעריכים שרוצים לקבל חומר מובנה יותר לשיחה מקצועית: רצף החלטות, הקשר, ראיות, תוצאות ושאלות המשך.",
  },
  {
    icon: UserCheck,
    title: "מועמדים",
    body: "מועמדים שרוצים הזדמנות להראות איך הם חושבים ופועלים, ולא רק כמה טוב הם יודעים לדבר על עצמם.",
  },
  {
    icon: GraduationCap,
    title: "פיתוח מנהיגות",
    body: "ארגונים שרוצים להשתמש באותו עולם סימולציה לא רק לצורך הערכה, אלא גם כתשתית לתחקור, למידה ופיתוח.",
  },
];

const roles = ["שרשרת אספקה", "כספים", "מוצר ו-R&D", "תפעול", "מכירות"];
const industries = ["תעופה וביטחון", "מכשור רפואי", "מוליכים למחצה", "צרכנות"];

export default function UseCases() {
  return (
    <section id="use-cases" className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-mg-text max-w-3xl">
        למי ManaGame נועדה?
      </h2>

      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cases.map(({ icon: Icon, title, body }) => (
          <Card key={title}>
            <CardContent>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-mg-md bg-mg-mint">
                <Icon className="h-5 w-5 text-mg-teal" aria-hidden />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-mg-text">{title}</h3>
              <p className="mt-2 text-mg-text-secondary leading-relaxed">{body}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-20">
        <h3 className="text-xl font-semibold text-mg-text">תפקידים ותעשיות</h3>

        <div className="mt-5 flex flex-wrap gap-2">
          {roles.map((role) => (
            <Badge key={role} variant="neutral">
              {role}
            </Badge>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {industries.map((industry) => (
            <Badge key={industry} variant="neutral">
              {industry}
            </Badge>
          ))}
        </div>

        <p className="mt-6 text-xs text-mg-text-secondary">
          כל התרחישים במערכת הם דוגמאות להמחשה (Illustrative scenario), אלא אם צוין אחרת.
        </p>
      </div>
    </section>
  );
}
