import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { isAuthEnabled } from "@/lib/auth/admin-session";
import { safeNextPath } from "@/lib/auth/safe-next-path";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "כניסה",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const destination = safeNextPath(next);

  // With no passphrase configured there is nothing to sign in to — sending the
  // operator to a login form that accepts nothing would just look broken.
  if (!isAuthEnabled()) redirect(destination);

  return (
    <div className="min-h-screen bg-mg-background flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo height={28} href={null} />
        </div>
        <LoginForm next={destination} />
        <p className="mt-6 text-center text-xs text-mg-text-secondary leading-relaxed">
          האזור הזה מכיל מידע על מועמדים. הגישה מוגבלת לצוות המעריך.
        </p>
      </div>
    </div>
  );
}
