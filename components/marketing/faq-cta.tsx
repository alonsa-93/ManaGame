"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    q: "מה זה ManaGame?",
    a: "ManaGame היא פלטפורמת סימולציה דינמית לקבלת החלטות. היא מציבה משתמשים בתוך מצבים עסקיים משתנים ומאפשרת לבחון רצף החלטות, תגובות לשינויים והראיות שנוצרו לאורך הדרך.",
  },
  {
    q: "כמה זמן נמשכת סימולציה?",
    a: "בגרסת המיון, בדרך כלל 20–40 דקות, בהתאם לתרחיש.",
  },
  {
    q: "האם יש תשובה נכונה?",
    a: "לא במובן של שאלה אמריקאית שבה קיימת אפשרות אחת בלבד. ההחלטה נבחנת בתוך ההקשר שבו התקבלה ובהתאם לרובריקה ולתרחיש.",
  },
  {
    q: "האם AI נותן את הציון?",
    a: "ה-AI משמש כחלק משכבת הפרשנות והשיפוט. הציון אינו אמור להיות מספר שהמודל ממציא באופן חופשי. הציון מחושב באמצעות מנגנון אגרגציה דטרמיניסטי בהתאם לכללי המערכת.",
  },
  {
    q: "האם המועמד רואה את הציון?",
    a: "ברירת המחדל אינה לחשוף ציון במהלך הסימולציה, אלא אם מדיניות המוצר קובעת אחרת.",
  },
  {
    q: "האם ManaGame מחליטה אם להעסיק מועמד?",
    a: "לא. ManaGame מספקת מידע, ראיות והערכות מובנות. החלטת ההעסקה נשארת בידי הארגון והמעריך.",
  },
  {
    q: "האם אפשר לנסות את המערכת?",
    a: "כן. האתר כולל מיני-סימולציה שמאפשרת לחוות את העיקרון מבלי לעבור הערכה מלאה.",
  },
  {
    q: "האם המערכת מתאימה לכל תפקיד?",
    a: "התרחישים צריכים להיבנות בהתאם לתפקיד, לסביבה העסקית ולמטרות ההערכה.",
  },
  {
    q: "האם קיימת בדיקה אנושית?",
    a: "כן. מצבים חריגים, לא ברורים או כאלה שבהם הראיות אינן מספיקות יכולים לעבור לבדיקה אנושית.",
  },
];

function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
  id,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  id: string;
}) {
  const panelId = `${id}-panel`;
  const buttonId = `${id}-button`;

  return (
    <div className="border-b border-mg-border">
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-4 py-5 text-right text-lg font-semibold text-mg-text"
        >
          <span>{question}</span>
          <span
            aria-hidden
            className={`shrink-0 text-mg-text-secondary transition-transform duration-150 ${
              isOpen ? "rotate-45" : ""
            }`}
          >
            +
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!isOpen}
        className="pb-5 text-mg-text-secondary leading-relaxed text-lg"
      >
        {answer}
      </div>
    </div>
  );
}

export default function FaqCta() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      <section id="faq" className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
        <h2 className="text-3xl sm:text-4xl font-semibold text-mg-text max-w-3xl">
          שאלות נפוצות
        </h2>

        <div className="mt-10 max-w-3xl">
          {faqs.map((item, index) => (
            <FaqItem
              key={item.q}
              id={`faq-${index}`}
              question={item.q}
              answer={item.a}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </section>

      <section id="cta" className="mx-auto max-w-7xl px-5 sm:px-8 py-10">
        <div className="bg-mg-mint rounded-mg-xl py-16 px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold text-mg-text max-w-2xl mx-auto">
            רוצים לראות מה קורה כשהחלטה פוגשת מציאות?
          </h2>

          <p className="mt-6 max-w-2xl mx-auto text-mg-text-secondary leading-relaxed text-lg">
            התנסו במיני-סימולציה קצרה וראו כיצד החלטה אחת יכולה לשנות את נקודת הפתיחה של
            ההחלטה הבאה. אם תרצו לראות את המערכת בהקשר אמיתי, אפשר לקבוע הדגמה ולבחון יחד
            איזה סוג של החלטות הייתם רוצים לראות.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/experience">
              <Button size="lg">התנסו עכשיו</Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary" size="lg">
                קבעו הדגמה
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
