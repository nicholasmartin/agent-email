"use client";

type AccordionProps = {
  items: Array<{
    question: string;
    answer: string;
  }>;
};

const Accordion = ({ items }: AccordionProps) => {
  return (
    <div className="divide-y rounded-md border">
      {items.map((item, i: number) => (
        <details key={i} className="group p-6 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900 dark:text-white font-medium">
            <h3 className="text-lg font-medium">{item.question}</h3>
            <svg
              className="h-5 w-5 transform transition duration-300 group-open:rotate-180"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </summary>
          <p className="mt-4 px-4 text-sm text-muted-foreground">{item.answer}</p>
        </details>
      ))}
    </div>
  );
};

export function FAQ() {
  return (
    <section id="faq" className="py-16 md:py-24 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Have questions? We've got answers.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-3xl py-12">
        <Accordion 
  items={[
    {
      question: "How does Agent Email work?",
      answer: "Agent Email automatically scrapes a lead's business website, analyzes their company information, and generates a personalized email using AI. You can either receive the email directly via our API or have it delivered to the lead's inbox."
    },
    {
      question: "Is any coding required to use Agent Email?",
      answer: "For API integration, minimal technical setup is needed to send your leads to our endpoint and receive personalized emails back. We are looking into integrating with providers like Make, n8n and Zapier to make it even easier."
    },
    {
      question: "Can I customize the email templates?",
      answer: "Yes! You can create your own prompt templates to control the tone, style, and structure of the AI-generated emails. Each company account can manage multiple templates."
    },
    {
      question: "What happens if website scraping fails?",
      answer: "If we cannot gather enough information from a lead's website, the job will fail gracefully, and you'll be notified. You won't be charged for failed scrapes, and we recommend manually reviewing those leads."
    },
    {
      question: "How secure is my data?",
      answer: "We take security seriously. All API requests require secure API keys, and lead information is encrypted at rest and in transit. We never share your data with third parties."
    },
    {
      question: "What are the usage limits during the free beta?",
      answer: "The beta period includes up to 100 processed leads. If you need a higher limit during your trial, please contact our team to discuss your needs."
    },
    {
      question: "Can I send emails from my own domain?",
      answer: "Yes, in future releases you’ll be able to connect your own SMTP settings to send branded emails directly from your company’s email address."
    },
    {
      question: "How do I monitor my API usage?",
      answer: "You can view your usage stats, job history, and email delivery reports through your Agent Email dashboard. API usage is also available via API endpoints if you prefer automation."
    }
  ]}
/>

        </div>
      </div>
    </section>
  );
}
