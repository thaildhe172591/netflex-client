import slugify from "slugify";

export function generateSlug(id: number | string, title: string): string {
  const slugTitle = slugify(title, {
    lower: true,
    strict: true,
    locale: "vi",
    trim: true,
  });

  // Use double-dash as separator so IDs containing hyphens (GUIDs) are preserved
  return `${slugTitle}--${id}`;
}

export function extractIdFromSlug(slug: string): string | null {
  // New format: <slug>--<id>
  const newSep = slug.lastIndexOf("--");
  if (newSep !== -1) {
    return decodeURIComponent(slug.slice(newSep + 2));
  }

  // Legacy numeric suffix: <slug>-123
  const match = slug.match(/-(\d+)$/);
  return match ? match[1] : null;
}

export function extractTitleFromSlug(slug: string): string | null {
  const match = slug.match(/^(.*)-\d+$/);
  if (!match) return null;

  return match[1].replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}
