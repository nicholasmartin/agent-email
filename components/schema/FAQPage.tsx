import { FAQPage, WithContext } from 'schema-dts';
import { SchemaOrg } from './SchemaOrg';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQPageSchemaProps {
  faqs: FAQItem[];
  mainEntity?: boolean;
}

/**
 * Schema.org FAQPage structured data component
 * Used for FAQ sections on the homepage and other pages
 */
export function FAQPageSchema({ faqs, mainEntity = true }: FAQPageSchemaProps) {
  const faqSchema: WithContext<FAQPage> = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return <SchemaOrg schema={faqSchema} />;
}
