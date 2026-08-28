import { getStore, hasDatabase } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Leads arrive between requests, so this page must never be prerendered.
export const dynamic = "force-dynamic";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("he-IL", { dateStyle: "short", timeStyle: "short" });
}

export default async function AdminLeadsPage() {
  const leads = await getStore().listContactSubmissions();
  const durable = hasDatabase();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-mg-text mb-1">פניות מהאתר</h1>
      <p className="text-sm text-mg-text-secondary mb-6">
        כל מי שמילא את טופס &quot;צרו קשר&quot;. כל פנייה נשלחת גם ל-Make ברגע קבלתה, כך שהיא מגיעה לאדם
        גם בלי להיכנס למסך הזה.
      </p>

      {!durable && (
        <Card className="p-4 mb-6 bg-mg-sand border-[#e8d4ad]">
          <p className="text-sm text-mg-text">
            לא מחובר מסד נתונים. הפניות ברשימה הזו נשמרות בזיכרון השרת בלבד ונמחקות בכל פריסה מחדש או
            כשהשרת מתקרר.
          </p>
          <p className="text-sm text-mg-text-secondary mt-1">
            ההעתק שנשלח ל-Make אינו מושפע מכך — הוא הרשומה היחידה שנשמרת כרגע מחוץ לזיכרון.
          </p>
        </Card>
      )}

      {leads.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-mg-text-secondary">עדיין אין פניות.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <Card key={lead.id} className="p-4">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="font-medium text-mg-text">{lead.name}</span>
                <a href={`mailto:${lead.email}`} className="text-sm text-mg-teal hover:underline" dir="ltr">
                  {lead.email}
                </a>
                <span className="text-xs text-mg-text-secondary ms-auto ltr-num">{formatDate(lead.createdAt)}</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-2">
                {lead.organization && <Badge variant="neutral">{lead.organization}</Badge>}
                {lead.role && <Badge variant="mint">{lead.role}</Badge>}
                {lead.orgSize && (
                  <Badge variant="sand" className="ltr-num">
                    {lead.orgSize} עובדים
                  </Badge>
                )}
              </div>

              {lead.whatToTest && (
                <p className="text-sm text-mg-text-secondary whitespace-pre-line">{lead.whatToTest}</p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
