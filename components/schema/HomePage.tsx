import { SoftwareApplicationSchema } from './SoftwareApplication';
import { OrganizationSchema } from './Organization';
import { FAQPageSchema } from './FAQPage';

interface HomePageSchemaProps {
  siteUrl: string;
  faqItems?: {
    question: string;
    answer: string;
  }[];
}

/**
 * Combined schema for the homepage that includes multiple schema types
 */
export function HomePageSchema({ siteUrl, faqItems = [] }: HomePageSchemaProps) {
  // If we have FAQ items, render them as structured data
  if (faqItems.length > 0) {
    return (
      <>
        <SoftwareApplicationSchema
          name="Agent Email"
          description="AI-powered personalized welcome emails for B2B and SaaS companies. Increase engagement and conversion rates with tailored communication."
          applicationCategory="BusinessApplication"
          url={siteUrl}
          image={`${siteUrl}/opengraph-image.png`}
          offers={[
            {
              price: '49.00',
              priceCurrency: 'USD',
              priceValidUntil: new Date(
                new Date().setFullYear(new Date().getFullYear() + 1)
              ).toISOString(),
            },
          ]}
        />
        <OrganizationSchema
          name="Agent Email"
          url={siteUrl}
          logo={`${siteUrl}/logo.png`}
          description="Agent Email helps SaaS businesses generate personalized welcome emails using AI to increase engagement and conversion rates."
          sameAs={[
            'https://twitter.com/AgentEmail',
            'https://linkedin.com/company/agent-email',
          ]}
        />
        <FAQPageSchema faqs={faqItems} />
      </>
    );
  }

  // If no FAQ items, just render the software and organization schemas
  return (
    <>
      <SoftwareApplicationSchema
        name="Agent Email"
        description="AI-powered personalized welcome emails for B2B and SaaS companies. Increase engagement and conversion rates with tailored communication."
        applicationCategory="BusinessApplication"
        url={siteUrl}
        image={`${siteUrl}/opengraph-image.png`}
        offers={[
          {
            price: '49.00',
            priceCurrency: 'USD',
            priceValidUntil: new Date(
              new Date().setFullYear(new Date().getFullYear() + 1)
            ).toISOString(),
          },
        ]}
      />
      <OrganizationSchema
        name="Agent Email"
        url={siteUrl}
        logo={`${siteUrl}/logo.png`}
        description="Agent Email helps SaaS businesses generate personalized welcome emails using AI to increase engagement and conversion rates."
        sameAs={[
          'https://twitter.com/AgentEmail',
          'https://linkedin.com/company/agent-email',
        ]}
      />
    </>
  );
}
