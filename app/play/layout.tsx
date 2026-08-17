import { Logo } from "@/components/brand/logo";

// Candidate experience shell: minimal chrome, no marketing nav — calm and
// focused per Master Spec §09 ("Candidate UX is the highest-priority
// product experience... the product must feel respectful").
export default function PlayLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-mg-background flex flex-col">
      <header className="py-6 px-5 sm:px-8">
        <Logo height={24} href={null} />
      </header>
      <main className="flex-1 px-5 sm:px-8 pb-16">{children}</main>
    </div>
  );
}
