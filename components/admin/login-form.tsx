"use client";

import { useActionState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { loginAction, type LoginResult } from "@/app/login/actions";

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState<LoginResult | null, FormData>(loginAction, null);

  return (
    <Card className="p-6 sm:p-8">
      <h1 className="text-lg font-semibold text-mg-text mb-1">כניסה לאזור הפנימי</h1>
      <p className="text-sm text-mg-text-secondary mb-5">ניהול תרחישים, סשנים ודוחות הערכה.</p>

      <form action={formAction} className="space-y-4">
        {state?.error && <Alert variant="error">{state.error}</Alert>}

        <input type="hidden" name="next" value={next} />

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-mg-text mb-1.5">
            סיסמה
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoFocus
            autoComplete="current-password"
            aria-invalid={Boolean(state?.error)}
          />
        </div>

        <Button type="submit" size="lg" loading={pending} className="w-full">
          כניסה
        </Button>
      </form>
    </Card>
  );
}
