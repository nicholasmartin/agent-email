import { Organization, WithContext } from 'schema-dts';
import { SchemaOrg } from './SchemaOrg';

interface OrganizationSchemaProps {
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs?: string[];
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  contactPoint?: {
    telephone?: string;
    email?: string;
    contactType: string;
  }[];
}

/**
 * Schema.org Organization structured data component
 * Used for representing Agent Email as a business
 */
export function OrganizationSchema({
  name,
  url,
  logo,
  description,
  sameAs,
  address,
  contactPoint,
}: OrganizationSchemaProps) {
  const orgSchema: WithContext<Organization> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
    description,
  };

  if (sameAs && sameAs.length > 0) {
    orgSchema.sameAs = sameAs;
  }

  if (address) {
    orgSchema.address = {
      '@type': 'PostalAddress',
      ...address,
    };
  }

  if (contactPoint && contactPoint.length > 0) {
    orgSchema.contactPoint = contactPoint.map(point => ({
      '@type': 'ContactPoint',
      ...point,
    }));
  }

  return <SchemaOrg schema={orgSchema} />;
}
