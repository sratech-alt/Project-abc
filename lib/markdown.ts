/**
 * markdown.ts — Turns Markdown from the database into HTML, at build time.
 *
 * The output is injected into the page, so it is locked down:
 * - raw HTML in the Markdown is shown as text, never executed;
 * - links and images may only point at safe addresses;
 * - a `# heading` becomes an <h2>, because every page already has its own <h1>.
 *
 * Code blocks and tables can be wider than the page, so they scroll sideways. A scrolling area has
 * to be reachable by keyboard, hence the tabindex on both.
 */
import { Marked, type Tokens } from 'marked';

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const SAFE_LINK = /^(https?:\/\/|mailto:|tel:|\/|#)/i;
const SAFE_IMAGE = /^(https:\/\/|\/)/i;
const EXTERNAL = /^https?:\/\//i;

const marked = new Marked({ gfm: true, breaks: false });

marked.use({
  renderer: {
    html(token: Tokens.HTML | Tokens.Tag) {
      return escapeHtml(token.text);
    },
    code({ text, escaped }: Tokens.Code) {
      return `<pre tabindex="0"><code>${escaped ? text : escapeHtml(text)}</code></pre>\n`;
    },
    heading({ tokens, depth }: Tokens.Heading) {
      const level = Math.max(2, depth);
      return `<h${level}>${this.parser.parseInline(tokens)}</h${level}>\n`;
    },
    link({ href, title, tokens }: Tokens.Link) {
      const text = this.parser.parseInline(tokens);
      if (!SAFE_LINK.test(href)) return text;
      const attrs = [`href="${escapeHtml(href)}"`];
      if (title) attrs.push(`title="${escapeHtml(title)}"`);
      if (EXTERNAL.test(href)) attrs.push('target="_blank"', 'rel="noopener noreferrer"');
      return `<a ${attrs.join(' ')}>${text}</a>`;
    },
    image({ href, title, text }: Tokens.Image) {
      if (!SAFE_IMAGE.test(href)) return escapeHtml(text);
      const attrs = [`src="${escapeHtml(href)}"`, `alt="${escapeHtml(text)}"`, 'loading="lazy"', 'decoding="async"'];
      if (title) attrs.push(`title="${escapeHtml(title)}"`);
      return `<img ${attrs.join(' ')} />`;
    },
  },
});

export function renderMarkdown(markdown: string): string {
  // Raw HTML is escaped above, so a literal <table> in the output can only have come from Markdown.
  return marked
    .parse(markdown, { async: false })
    .replace(/<table>/g, '<div class="table-scroll" tabindex="0" role="region" aria-label="Table"><table>')
    .replace(/<\/table>/g, '</table></div>');
}

/** Markdown with the formatting stripped — for excerpts, word counts and structured data. */
export function plainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, '')
    .replace(/[*_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
