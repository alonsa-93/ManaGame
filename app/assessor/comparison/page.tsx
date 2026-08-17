import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";

export default function ComparisonPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-mg-text mb-1">השוואה</h1>
      <p className="text-sm text-mg-text-secondary mb-6">
        השוואה בין מועמדים אינה דירוג. היא כלי לבחינת הבדלים התנהגותיים בתוך אותו תרחיש.
      </p>

      <Card className="p-6 mb-6">
        <div className="rounded-mg-md border border-mg-border">
          <EmptyState
            title="בחירת ההשוואה תהיה זמינה כאן."
            description="ברגע שיהיו לפחות שני סשנים שהושלמו על אותו תרחיש, ניתן יהיה לבחור אותם להשוואה."
          />
        </div>
      </Card>

      <Alert variant="info" title="כלל ההשוואה (D7 / Seed)">
        השוואת ציון תהליך אפשרית כאשר זהות ה-D7 מתקיימת. השוואת ציון תוצאה אפשרית רק כאשר גם זהות ה-Seed מתקיימת. אם
        ה-Seed שונה בין הריצות, ציון התוצאה לא יוצג כהשוואה ישירה — &quot;הריצות מבוססות על Seed שונה ולכן ציון
        התוצאה אינו מוצג כהשוואה ישירה.&quot; ציון התהליך עשוי להישאר ניתן להשוואה בהתאם לכללי המערכת.
      </Alert>
    </div>
  );
}
