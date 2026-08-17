"use server";

import { getStore } from "@/lib/store";

export type ContactActionResult = { ok: true } | { ok: false; error: string };

export async function submitContact(formData: FormData): Promise<ContactActionResult> {
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const organization = String(formData.get("organization") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const whatToTest = String(formData.get("whatToTest") ?? "").trim();
  const orgSize = String(formData.get("orgSize") ?? "").trim();

  if (!name) {
    return { ok: false, error: "נא למלא שם." };
  }
  if (!email) {
    return { ok: false, error: "נא למלא כתובת אימייל." };
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return { ok: false, error: "כתובת האימייל אינה תקינה." };
  }

  try {
    await getStore().addContactSubmission({
      id: crypto.randomUUID(),
      name,
      role: role || undefined,
      organization: organization || undefined,
      email,
      whatToTest: whatToTest || undefined,
      orgSize: orgSize || undefined,
    });
  } catch {
    return { ok: false, error: "משהו השתבש בשליחה. נסו שוב בעוד רגע." };
  }

  return { ok: true };
}
