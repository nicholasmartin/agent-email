# SEO Optimization Guide for New Content Pages

This document serves as a quick reference for ensuring all new content pages in the Agent Email project are properly optimized for search engines.

## Sitemap Integration

When creating a new content page, ensure it's added to the sitemap:

1. Open `next-sitemap.config.js` in the project root
2. Add your new page to the `additionalPaths` function:

```javascript
additionalPaths: async (config) => {
  return [
    // Existing paths
    { loc: '/', changefreq: 'daily', priority: 1.0 },
    { loc: '/api', changefreq: 'weekly', priority: 0.8 },
    
    // Add your new page
    { 
      loc: '/your-new-page-path', 
      changefreq: 'weekly',  // How often it changes
      priority: 0.8,         // Importance (0.0-1.0)
      lastmod: new Date().toISOString(),
    },
  ];
},
```

3. Run `npm run build` to regenerate the sitemap

## Structured Data Implementation

Each content page should include appropriate structured data:

1. **Regular Content Pages**:
   ```tsx
   import { WebPageSchema } from "@/components/schema/WebPage";
   
   // Inside your component
   <WebPageSchema
     name="Page Title"
     description="Page description"
     url={`${siteUrl}/your-page-path`}
     datePublished="YYYY-MM-DD"
     dateModified={new Date().toISOString().split('T')[0]}
     breadcrumb={[
       { name: 'Home', item: siteUrl },
       { name: 'Page Title', item: `${siteUrl}/your-page-path` },
     ]}
   />
   ```

2. **Blog Posts**:
   ```tsx
   import { BlogPostingSchema } from "@/components/schema/BlogPosting";
   
   <BlogPostingSchema
     name="Blog Post Title"
     description="Blog post description"
     url={`${siteUrl}/blog/post-slug`}
     datePublished="YYYY-MM-DD"
     dateModified={new Date().toISOString().split('T')[0]}
     author="Author Name"
     image={`${siteUrl}/images/blog/post-image.jpg`}
   />
   ```

3. **FAQ Pages**:
   ```tsx
   import { FAQPageSchema } from "@/components/schema/FAQPage";
   
   <FAQPageSchema
     faqs={[
       { 
         question: "Frequently asked question?", 
         answer: "Answer to the question." 
       },
       // Add more Q&A pairs
     ]}
   />
   ```

## Page Metadata Checklist

Each page should include proper Next.js metadata:

```tsx
export const metadata: Metadata = {
  title: "Page Title | Agent Email",
  description: "Compelling description under 160 characters",
  // Optional: page-specific keywords
  keywords: ["relevant", "keywords", "here"],
};
```

## Image Optimization

1. Always use Next.js Image component:
   ```tsx
   import Image from "next/image";
   
   <Image
     src="/path/to/image.jpg"
     alt="Descriptive alt text"
     width={800}
     height={600}
     priority={isHeroImage} // Set to true for above-the-fold images
   />
   ```

2. Include descriptive alt text for all images

## Content Structure Best Practices

1. Use proper heading hierarchy (h1 → h2 → h3)
2. Include target keywords in headings and first paragraph
3. Keep paragraphs short and scannable
4. Include internal links to other relevant content
5. Ensure content is accessible (proper contrast, focus states)

## Testing

Before publishing, verify:

1. Page appears in sitemap after build
2. Structured data validates in [Google's Rich Results Test](https://search.google.com/test/rich-results)
3. Page passes Core Web Vitals checks
4. All images have proper alt text
