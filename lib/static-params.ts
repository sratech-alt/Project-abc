/**
 * static-params.ts — A static export needs every dynamic route (`/blog/[slug]`) to list at least
 * one page to generate. When a content table is empty there are none, and the build would fail.
 * So an empty list is padded with one reserved value, and the page shows "not found" for it.
 * The value starts with an underscore, which real slugs can't (see isValidSlug), so it can never
 * collide with content.
 */
export const EMPTY_ROUTE = '_empty';

export function withPlaceholder<Key extends string = 'slug'>(params: Record<Key, string>[], key = 'slug' as Key): Record<Key, string>[] {
  return params.length > 0 ? params : [{ [key]: EMPTY_ROUTE } as Record<Key, string>];
}
