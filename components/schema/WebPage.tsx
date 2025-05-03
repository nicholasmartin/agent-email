import { WebPage, WithContext } from 'schema-dts';
import { SchemaOrg } from './SchemaOrg';

interface WebPageSchemaProps {
  name: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  breadcrumb?: {
    name: string;
    item: string;
  }[];
}

/**
 * Schema.org WebPage structured data component
 * Used for general pages like the API documentation page
 */
export function WebPageSchema({
  name,
  description,
  url,
  image,
  datePublished,
  dateModified,
  breadcrumb,
}: WebPageSchemaProps) {
  const webPageSchema: WithContext<WebPage> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url,
  };

  if (image) {
    webPageSchema.image = image;
  }

  if (datePublished) {
    webPageSchema.datePublished = datePublished;
  }

  if (dateModified) {
    webPageSchema.dateModified = dateModified;
  }

  if (breadcrumb && breadcrumb.length > 0) {
    webPageSchema.breadcrumb = {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumb.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.item,
      })),
    };
  }

  return <SchemaOrg schema={webPageSchema} />;
}
