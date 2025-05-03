import { SoftwareApplication, WithContext } from 'schema-dts';
import { SchemaOrg } from './SchemaOrg';

interface SoftwareApplicationSchemaProps {
  name: string;
  description: string;
  applicationCategory: string;
  operatingSystem?: string;
  offers?: {
    price: string;
    priceCurrency: string;
    priceValidUntil?: string;
  }[];
  aggregateRating?: {
    ratingValue: number;
    ratingCount: number;
  };
  url: string;
  image: string;
}

/**
 * Schema.org SoftwareApplication structured data component
 * Used for SaaS products like Agent Email
 */
export function SoftwareApplicationSchema({
  name,
  description,
  applicationCategory,
  operatingSystem = "Web",
  offers,
  aggregateRating,
  url,
  image
}: SoftwareApplicationSchemaProps) {
  const softwareApp: WithContext<SoftwareApplication> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    applicationCategory,
    operatingSystem,
    url,
    image,
  };

  if (offers && offers.length > 0) {
    softwareApp.offers = offers.map(offer => ({
      '@type': 'Offer',
      price: offer.price,
      priceCurrency: offer.priceCurrency,
      ...(offer.priceValidUntil && { priceValidUntil: offer.priceValidUntil }),
    }));
  }

  if (aggregateRating) {
    softwareApp.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: aggregateRating.ratingValue,
      ratingCount: aggregateRating.ratingCount,
    };
  }

  return <SchemaOrg schema={softwareApp} />;
}
