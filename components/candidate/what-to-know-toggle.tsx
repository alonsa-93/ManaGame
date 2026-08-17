"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

export function WhatToKnowToggle() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:flex-1">
      <Button type="button" variant="secondary" size="lg" className="w-full" onClick={() => setOpen((v) => !v)}>
        <Info className="h-4 w-4" />
        מה חשוב לדעת?
      </Button>
      {open && (
        <div className="mt-3 rounded-mg-md border border-mg-border bg-mg-blue p-4 text-sm text-mg-text-secondary leading-relaxed">
          <p>הסימולציה כוללת מספר תורות. בכל תור תתארו במילים שלכם מה הייתם עושים.</p>
          <p className="mt-2">
            אין תשובה &quot;מושלמת&quot; אחת — ההחלטה נבחנת בתוך ההקשר שנוצר. המערכת עשויה להציג עדכונים חדשים
            שמשנים את המצב במהלך הדרך, בדיוק כמו במציאות.
          </p>
        </div>
      )}
    </div>
  );
}
