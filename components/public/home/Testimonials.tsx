"use client";

type TestimonialCardProps = {
  quote: string;
  author: string;
  role: string;
  company: string;
};

const TestimonialCard = ({ quote, author, role, company }: TestimonialCardProps) => (
  <div className="rounded-lg border bg-card p-6 shadow-sm">
    <div className="mb-4 flex">
      {[...Array(5)].map((_, i: number) => (
        <svg
          key={i}
          className="h-5 w-5 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
    <p className="text-muted-foreground mb-4">"{quote}"</p>
    <div>
      <p className="font-semibold">{author}</p>
      <p className="text-xs text-muted-foreground">{role}, {company}</p>
    </div>
  </div>
);

export function Testimonials() {
  return (
    <section id="testimonials" className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              "Testimonials" <span className="text-yellow-600">(Coming Soon!)</span>
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              We're still in early development and don't have real customers yet! In the meantime, enjoy these totally made-up testimonials that we wish we had.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
          <TestimonialCard
            quote="This app is so amazing, my cat started using it and now she's filing her own taxes and investing in cryptocurrency. Game changer!"
            author="Imaginary McFakerson"
            role="Fictional User"
            company="Does Not Exist LLC"
          />
          <TestimonialCard
            quote="I was skeptical at first, but after using this app for 5 minutes, I grew 3 inches taller and found $20 in my pocket. Coincidence? I think not!"
            author="Totally Real Person"
            role="Chief Imagination Officer"
            company="Fantasy Enterprises"
          />
          <TestimonialCard
            quote="This app is still in development, but I'm from the future and can confirm it becomes the most downloaded app of 2026. Trust me, I'm definitely a time traveler."
            author="Dr. Not-Yet-A-Customer"
            role="Time Travel Consultant"
            company="Future Feedback Inc."
          />
        </div>
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 italic">
            * No actual customers were harmed in the making of these testimonials. We're working hard to build something awesome and would love your real feedback soon!
          </p>
        </div>
      </div>
    </section>
  );
}