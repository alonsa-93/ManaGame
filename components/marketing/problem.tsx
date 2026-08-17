import { Card, CardContent } from "@/components/ui/card";

const cards = [
  {
    title: "כשהכול ברור",
    body: "קל לקבל החלטה.",
    tint: "bg-mg-mint",
  },
  {
    title: "כשהכול משתנה",
    body: "ההחלטה הופכת מורכבת.",
    tint: "bg-mg-sand",
  },
  {
    title: "כשאין תשובה נכונה",
    body: "כאן מתחיל שיקול הדעת.",
    tint: "bg-mg-mint",
  },
];

export default function Problem() {
  return (
    <section id="problem" className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-mg-text max-w-3xl">
        כי קל להישמע מנהל.
      </h2>

      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-mg-text-secondary">
        ראיון יכול להראות לנו איך אדם מספר על החלטות שקיבל בעבר. שאלה תיאורטית יכולה
        להראות לנו איך הוא חושב שהוא היה פועל בעתיד. אבל קבלת החלטות אמיתית מתרחשת
        בתנאים אחרים. המידע חלקי. הזמן מוגבל. המשאבים לא אינסופיים. בעלי העניין מושכים
        לכיוונים שונים. ולפעמים אין תשובה אחת שאפשר לסמן כ&quot;נכונה&quot;. דווקא שם מתחיל
        שיקול הדעת.
      </p>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Card key={card.title} className="rounded-mg-lg border-none">
            <CardContent className={`${card.tint} rounded-mg-lg h-full`}>
              <h3 className="text-lg font-semibold text-mg-text">{card.title}</h3>
              <p className="mt-2 text-mg-text-secondary leading-relaxed">{card.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
