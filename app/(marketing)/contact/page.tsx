import { ContactForm } from "@/components/marketing/contact-form";

export const metadata = {
  title: "צרו קשר — ManaGame",
  description: "בואו נשים את זה על שולחן ההחלטות.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 py-16 sm:py-24">
      <div className="mb-12 sm:mb-16 text-center">
        <h1 className="text-3xl sm:text-4xl font-semibold text-mg-text mb-5">
          בואו נשים את זה על שולחן ההחלטות.
        </h1>
        <p className="text-base sm:text-lg text-mg-text-secondary leading-relaxed max-w-2xl mx-auto">
          ספרו לנו קצת על התפקיד, הארגון והסביבה שבה הייתם רוצים לראות את ManaGame בפעולה. המטרה
          של השיחה הראשונה אינה להציג לכם מצגת. אנחנו רוצים להבין קודם: איזה סוג החלטות אתם רוצים
          לבחון, באיזה הקשר, ומה הייתם רוצים שהמעריך יוכל לראות שקשה לראות היום.
        </p>
      </div>

      <ContactForm />
    </div>
  );
}
