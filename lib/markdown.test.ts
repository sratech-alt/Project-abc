import { describe, expect, it } from 'vitest';
import { plainText, renderMarkdown } from './markdown';

describe('renderMarkdown', () => {
  it('renders ordinary Markdown', () => {
    const html = renderMarkdown('Some **bold** text.\n\n- one\n- two');
    expect(html).toContain('<strong>bold</strong>');
    expect(html).toContain('<li>one</li>');
  });

  it('shows raw HTML as text instead of running it', () => {
    const html = renderMarkdown('Before\n\n<script>alert(1)</script>\n\nInline <img src=x onerror=alert(1)> here');
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<img src=x');
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
  });

  it.each(['javascript:alert(1)', 'JAVASCRIPT:alert(1)', 'data:text/html,<b>x</b>', 'vbscript:x'])(
    'drops the address of an unsafe link (%s)',
    (href) => {
      const html = renderMarkdown(`[click me](${href})`);
      expect(html).not.toContain('href=');
      expect(html).toContain('click me');
    },
  );

  it.each(['https://example.com/a', 'http://example.com', 'mailto:a@b.co', 'tel:+9779764397139', '/#contact', '#section'])(
    'keeps a safe link (%s)',
    (href) => {
      expect(renderMarkdown(`[link](${href})`)).toContain(`href="${href}"`);
    },
  );

  it('opens external links in a new tab without leaking the opener, and internal links in place', () => {
    expect(renderMarkdown('[out](https://example.com)')).toContain('target="_blank" rel="noopener noreferrer"');
    expect(renderMarkdown('[in](/#contact)')).not.toContain('target=');
  });

  it('only allows images from https or the site itself', () => {
    expect(renderMarkdown('![A chart](https://cdn.example.com/chart.png)')).toContain(
      '<img src="https://cdn.example.com/chart.png" alt="A chart" loading="lazy"',
    );
    expect(renderMarkdown('![x](http://insecure.example.com/a.png)')).not.toContain('<img');
    expect(renderMarkdown('![x](javascript:alert(1))')).not.toContain('<img');
  });

  it('turns a top-level heading into an h2, because the page already has an h1', () => {
    const html = renderMarkdown('# Title\n\n## Section\n\n### Detail');
    expect(html).not.toContain('<h1');
    expect(html).toContain('<h2>Title</h2>');
    expect(html).toContain('<h2>Section</h2>');
    expect(html).toContain('<h3>Detail</h3>');
  });

  it('makes code blocks keyboard-scrollable and escapes their contents', () => {
    const html = renderMarkdown('```html\n<div class="a">&</div>\n```');
    expect(html).toContain('<pre tabindex="0"><code>');
    expect(html).toContain('&lt;div class=&quot;a&quot;&gt;&amp;&lt;/div&gt;');
  });

  it('wraps tables in a keyboard-scrollable region', () => {
    const html = renderMarkdown('| A | B |\n| --- | --- |\n| 1 | 2 |');
    expect(html).toContain('<div class="table-scroll" tabindex="0" role="region" aria-label="Table"><table>');
    expect(html).toContain('</table></div>');
  });

  it('returns an empty string for empty input', () => {
    expect(renderMarkdown('')).toBe('');
  });
});

describe('plainText', () => {
  it('strips formatting, links, images, code fences and HTML', () => {
    const text = plainText(
      '# Title\n\nSome **bold** and _italic_ with a [link](https://x.y) and `code`.\n\n```js\nignored();\n```\n\n- item\n\n<b>tag</b>',
    );
    expect(text).toBe('Title Some bold and italic with a link and code. item tag');
  });
});
