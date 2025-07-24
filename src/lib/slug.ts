import slugify from "slugify";

export function generateSlug(id: number | string, title: string): string {
  const slugTitle = slugify(title, {
    lower: true,
    strict: true,
    locale: "vi",
    trim: true,
  });

  return `${slugTitle}-${id}`;
}

export function extractIdFromSlug(slug: string): number | null {
  const match = slug.match(/-(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}

export function extractTitleFromSlug(slug: string): string | null {
  const match = slug.match(/^(.*)-\d+$/);
  if (!match) return null;

  return match[1].replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}
