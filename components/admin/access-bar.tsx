import { isAuthEnabled } from "@/lib/auth/admin-session";
import { logoutAction } from "@/app/login/actions";
import { LogOut, ShieldAlert } from "lucide-react";

/**
 * Sign-out control, and — when no passphrase is configured — a standing warning
 * that this area is open to anyone with the URL.
 *
 * The warning is deliberately loud and not dismissible. An operator who does
 * not realise candidate reports are publicly readable cannot make an informed
 * decision about putting real candidates through the system.
 */
export function AccessBar() {
  if (!isAuthEnabled()) {
    return (
      <div className="bg-mg-coral border-b border-[#f0c9c3]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-2.5 flex items-start gap-2.5 text-[#9a4340]">
          <ShieldAlert className="h-4 w-4 mt-0.5 shrink-0" aria-hidden />
          <p className="text-xs leading-relaxed">
            <span className="font-semibold">האזור הזה אינו מוגן.</span> כל מי שמגיע לכתובת רואה דוחות
            מועמדים, ראיות ופניות. הגדירו <code className="font-mono" dir="ltr">ADMIN_PASSWORD</code> במשתני
            הסביבה כדי להפעיל את שכבת ההרשאות.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-mg-border bg-mg-surface">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-1.5 flex justify-end">
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-1.5 text-xs text-mg-text-secondary hover:text-mg-text transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden />
            יציאה
          </button>
        </form>
      </div>
    </div>
  );
}
