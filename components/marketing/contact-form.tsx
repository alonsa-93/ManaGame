"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { submitContact } from "@/app/(marketing)/contact/actions";

const ORG_SIZES = ["1–50", "51–200", "201–1000", "1000+"];

const fieldClass = cn(
  "flex h-11 w-full rounded-mg-md border border-mg-border bg-white px-3.5 text-[15px] text-mg-text",
  "focus-visible:outline-none focus-visible:border-mg-teal focus-visible:ring-2 focus-visible:ring-mg-teal/20",
  "disabled:opacity-50 disabled:cursor-not-allowed"
);

const labelClass = "block text-sm font-medium text-mg-text mb-1.5";

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const formData = new FormData(e.currentTarget);
      const result = await submitContact(formData);
      if (result.ok) {
        setDone(true);
      } else {
        setError(result.error);
      }
    } catch {
      setError("משהו השתבש בשליחה. נסו שוב בעוד רגע.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-mg-lg border border-mg-border bg-mg-surface p-8 sm:p-10 text-center">
        <p className="text-lg font-medium text-mg-text">תודה. נחזור אליכם בקרוב.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {error && <Alert variant="error">{error}</Alert>}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            שם <span className="text-mg-error">*</span>
          </label>
          <Input id="name" name="name" required autoComplete="name" />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            אימייל <span className="text-mg-error">*</span>
          </label>
          <Input id="email" name="email" type="email" required autoComplete="email" dir="ltr" className="text-right" />
        </div>
        <div>
          <label htmlFor="role" className={labelClass}>
            תפקיד
          </label>
          <Input id="role" name="role" autoComplete="organization-title" />
        </div>
        <div>
          <label htmlFor="organization" className={labelClass}>
            ארגון
          </label>
          <Input id="organization" name="organization" autoComplete="organization" />
        </div>
      </div>

      <div>
        <label htmlFor="orgSize" className={labelClass}>
          גודל הארגון
        </label>
        <select id="orgSize" name="orgSize" defaultValue="" className={cn(fieldClass, "appearance-none")}>
          <option value="" disabled>
            בחרו טווח
          </option>
          {ORG_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="whatToTest" className={labelClass}>
          מה הייתם רוצים לבחון?
        </label>
        <textarea
          id="whatToTest"
          name="whatToTest"
          rows={5}
          className={cn(
            "flex w-full rounded-mg-md border border-mg-border bg-white px-3.5 py-3 text-[15px] text-mg-text placeholder:text-mg-text-secondary/70",
            "focus-visible:outline-none focus-visible:border-mg-teal focus-visible:ring-2 focus-visible:ring-mg-teal/20",
            "disabled:opacity-50 disabled:cursor-not-allowed resize-y"
          )}
        />
      </div>

      <div>
        <Button type="submit" size="lg" loading={submitting} className="w-full sm:w-auto">
          בואו נדבר
        </Button>
        <p className="mt-3 text-xs text-mg-text-secondary">
          לא מדובר בשיחת מכירה אוטומטית. נרצה להבין קודם מה אתם מנסים למדוד.
        </p>
      </div>
    </form>
  );
}
