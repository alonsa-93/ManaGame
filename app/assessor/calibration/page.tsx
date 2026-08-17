import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export default function CalibrationPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-mg-text mb-1">כיול</h1>
      <p className="text-sm text-mg-text-secondary mb-6">
        כיול משמש לבדיקת עקביות בין הרצות שופט ולבחינת רגישות הרובריקה לאורך זמן.
      </p>
      <Card className="p-6">
        <div className="rounded-mg-md border border-mg-border">
          <EmptyState
            title="עדיין אין נתוני כיול להצגה."
            description="כשיצטברו מספיק סשנים שהושלמו, ניתוחי כיול יופיעו כאן."
          />
        </div>
      </Card>
    </div>
  );
}
