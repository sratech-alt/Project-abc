import { describe, expect, it } from 'vitest';
import { codeSamples } from './code-samples';
import { highlight, highlightLine, type Token } from './highlight';

const typeOf = (tokens: Token[], text: string) => tokens.find((token) => token.text === text)?.type;

describe('highlight', () => {
  it.each(codeSamples.map((sample) => [sample.file, sample] as const))('is lossless for %s', (_file, sample) => {
    const rebuilt = highlight(sample.code, sample.lang)
      .map((line) => line.map((token) => token.text).join(''))
      .join('\n');
    expect(rebuilt).toBe(sample.code);
  });

  it('returns no tokens for an empty line', () => {
    expect(highlightLine('', 'java')).toEqual([]);
  });

  it('classifies Java annotations, keywords, types, calls and strings', () => {
    const tokens = highlightLine('  @KafkaListener(topics = "inventory.reserved")', 'java');
    expect(typeOf(tokens, '@KafkaListener')).toBe('anno');
    expect(typeOf(tokens, '"inventory.reserved"')).toBe('string');

    const declaration = highlightLine('  public Order place(CreateOrder command) {', 'java');
    expect(typeOf(declaration, 'public')).toBe('keyword');
    expect(typeOf(declaration, 'Order')).toBe('type');
    expect(typeOf(declaration, 'place')).toBe('func');
    expect(typeOf(declaration, 'command')).toBe('plain');
  });

  it('classifies TypeScript comments, object keys and numbers', () => {
    expect(highlightLine('// One team. Every layer of the stack.', 'ts')).toEqual([
      { type: 'comment', text: '// One team. Every layer of the stack.' },
    ]);
    const tokens = highlightLine('    api: springBoot({ java: 21, style: "event-driven" }),', 'ts');
    expect(typeOf(tokens, 'api')).toBe('key');
    expect(typeOf(tokens, 'springBoot')).toBe('func');
    expect(typeOf(tokens, '21')).toBe('number');
    expect(typeOf(tokens, '"event-driven"')).toBe('string');
  });

  it('classifies YAML keys, list items and ${{ }} expressions', () => {
    const tokens = highlightLine('        run: docker build -t app:${{ github.sha }} .', 'yaml');
    expect(typeOf(tokens, 'run')).toBe('key');
    expect(typeOf(tokens, '${{ github.sha }}')).toBe('anno');

    const item = highlightLine('      - uses: actions/checkout@v4', 'yaml');
    expect(typeOf(item, 'uses')).toBe('key');
    expect(typeOf(item, ' actions/checkout@v4')).toBe('string');

    const flow = highlightLine('    branches: [main]', 'yaml');
    expect(typeOf(flow, '[')).toBe('punct');
    expect(typeOf(flow, 'main')).toBe('string');
  });
});
