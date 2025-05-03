import { BlogPosting, WithContext } from 'schema-dts';
import { SchemaOrg } from './SchemaOrg';

interface BlogPostingSchemaProps {
  name: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  author: string;
  image?: string;
  keywords?: string[];
}

/**
 * Schema.org BlogPosting structured data component
 * Used for blog posts and content articles
 */
export function BlogPostingSchema({
  name,
  description,
  url,
  datePublished,
  dateModified,
  author,
  image,
  keywords,
}: BlogPostingSchemaProps) {
  const blogPostingSchema: WithContext<BlogPosting> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: name,
    description,
    url,
    datePublished,
    dateModified,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Agent Email',
      logo: {
        '@type': 'ImageObject',
        url: `${url.split('/').slice(0, 3).join('/')}/logo.png`,
      },
    },
  };

  if (image) {
    blogPostingSchema.image = image;
  }

  if (keywords && keywords.length > 0) {
    blogPostingSchema.keywords = keywords.join(', ');
  }

  return <SchemaOrg schema={blogPostingSchema} />;
}
