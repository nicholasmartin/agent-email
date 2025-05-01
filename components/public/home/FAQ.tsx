"use client";

type AccordionProps = {
  items: Array<{
    question: string;
    answer: string;
  }>;
};

const Accordion = ({ items }: AccordionProps) => {
  return (
    <div className="divide-y rounded-xl border border-gray-100 bg-white shadow-lg overflow-hidden">
      {items.map((item, i: number) => (
        <details key={i} className="group [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-6 text-gray-800 font-medium hover:bg-gray-50 transition-colors duration-200">
            <h3 className="text-lg font-medium">{item.question}</h3>
            <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
              <svg
                className="h-5 w-5 text-indigo-600 transform transition duration-300 group-open:rotate-180"
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
            </div>
          </summary>
          <div className="px-6 pb-6 pt-2">
            <p className="text-gray-600">{item.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
};

export function FAQ() {
  return (
    <section id="faq" className="relative overflow-hidden bg-gray-900 py-20">
      {/* Background gradient elements */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-900 rounded-full mix-blend-screen filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-900 rounded-full mix-blend-screen filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-900 rounded-full mix-blend-screen filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Everything you need to know about Agent Email and how it can transform your welcome emails.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
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
