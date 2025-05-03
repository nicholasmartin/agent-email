/**
 * Base component for wrapping schema.org JSON-LD scripts
 */
export function SchemaOrg({ schema }: { schema: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}
