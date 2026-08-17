import { Card } from "@/components/ui/card";

export default function AssessorSettingsPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-mg-text mb-1">הגדרות</h1>
      <p className="text-sm text-mg-text-secondary mb-6">הרשאות גישה, התראות והעדפות תצוגה.</p>
      <Card className="p-6">
        <p className="text-sm text-mg-text-secondary">
          ניהול הרשאות ברמת הארגון ייקבע בהתאם למדיניות הגישה שתוגדר בפריסה הארגונית.
        </p>
      </Card>
    </div>
  );
}
