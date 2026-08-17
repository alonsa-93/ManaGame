import type { Metadata } from "next";
import { Hero } from "@/components/marketing/hero";
import Problem from "@/components/marketing/problem";
import Shift from "@/components/marketing/shift";
import HowItWorks from "@/components/marketing/how-it-works";
import TechnologyTeaser from "@/components/marketing/technology-teaser";
import ProcessOutcome from "@/components/marketing/process-outcome";
import EvidenceReview from "@/components/marketing/evidence-review";
import UseCases from "@/components/marketing/use-cases";
import SecurityTeaser from "@/components/marketing/security-teaser";
import PhilosophyTrust from "@/components/marketing/philosophy-trust";
import FaqCta from "@/components/marketing/faq-cta";

export const metadata: Metadata = {
  title: "ManaGame — החלטות שמנהלות מציאות",
  description:
    "ManaGame היא פלטפורמת סימולציה דינמית לקבלת החלטות. מועמדים ומנהלים מתמודדים עם מצבים עסקיים משתנים, והמערכת מתעדת החלטות, ראיות ותוצאות.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <Shift />
      <HowItWorks />
      <TechnologyTeaser />
      <ProcessOutcome />
      <EvidenceReview />
      <UseCases />
      <SecurityTeaser />
      <PhilosophyTrust />
      <FaqCta />
    </>
  );
}
