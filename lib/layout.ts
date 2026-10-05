/**
 * layout.ts — Layout maths that doesn't need a browser.
 */

/**
 * Makes a list of cards tile a grid with no holes.
 *
 * Each card says how many columns it wants (`span`). Those values come from the database, so they
 * may not add up to full rows. Reading in order: when a card won't fit in what is left of a row,
 * the card before it is widened to finish that row; and the final card is widened to finish the last.
 * Spans are also clamped to 1…columns. The input is not modified.
 */
export function normalizeSpans<Item extends { span: number }>(items: Item[], columns = 3): Item[] {
  const result = items.map((item) => ({ ...item, span: Math.min(Math.max(Math.round(item.span) || 1, 1), columns) }));
  let used = 0;

  result.forEach((item, index) => {
    if (used + item.span > columns) {
      result[index - 1].span += columns - used;
      used = 0;
    }
    used = (used + item.span) % columns;
  });

  if (used !== 0 && result.length > 0) result[result.length - 1].span += columns - used;
  return result;
}
