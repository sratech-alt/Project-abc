/**
 * highlight.ts — A tiny syntax highlighter for the hero code window.
 * Covers only what the three samples need (TypeScript, Java, YAML); not a general-purpose lexer.
 * Tokenizing is lossless: joining a line's token texts gives back the original line.
 */

export type Lang = 'ts' | 'java' | 'yaml';

export type TokenType = 'plain' | 'punct' | 'comment' | 'keyword' | 'string' | 'type' | 'func' | 'anno' | 'number' | 'key';

export type Token = { type: TokenType; text: string };

const KEYWORDS: Record<'ts' | 'java', ReadonlySet<string>> = {
  ts: new Set(['export', 'const', 'import', 'from', 'return', 'true', 'false', 'new', 'await', 'async', 'function']),
  java: new Set(['public', 'private', 'protected', 'class', 'final', 'void', 'return', 'new', 'static']),
};

// comment | string | annotation | number | identifier | whitespace | any other single character
const CODE_PATTERN =
  /(\/\/.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(@[A-Za-z_]\w*)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|(\s+)|([\s\S])/g;

function highlightCode(line: string, lang: 'ts' | 'java'): Token[] {
  const tokens: Token[] = [];
  for (const match of line.matchAll(CODE_PATTERN)) {
    const [text, comment, str, anno, num, ident, space] = match;
    if (comment) tokens.push({ type: 'comment', text });
    else if (str) tokens.push({ type: 'string', text });
    else if (anno) tokens.push({ type: 'anno', text });
    else if (num) tokens.push({ type: 'number', text });
    else if (space) tokens.push({ type: 'plain', text });
    else if (ident) {
      const after = line.slice(match.index + text.length);
      let type: TokenType = 'plain';
      if (KEYWORDS[lang].has(ident)) type = 'keyword';
      else if (/^[A-Z]/.test(ident)) type = 'type';
      else if (/^\s*\(/.test(after)) type = 'func';
      else if (lang === 'ts' && /^\s*:/.test(after)) type = 'key';
      tokens.push({ type, text });
    } else tokens.push({ type: 'punct', text });
  }
  return tokens;
}

const YAML_KEY_PATTERN = /^(\s*(?:-\s+)?)([A-Za-z_][\w-]*)(:)(?=\s|$)/;
// ${{ expression }} | comment | flow punctuation | plain text
const YAML_VALUE_PATTERN = /(\$\{\{.*?\}\})|(#.*$)|([[\],])|([^$#[\],]+|[\s\S])/g;

function highlightYaml(line: string): Token[] {
  const tokens: Token[] = [];
  let rest = line;
  const key = YAML_KEY_PATTERN.exec(line);
  if (key) {
    if (key[1]) tokens.push({ type: 'punct', text: key[1] });
    tokens.push({ type: 'key', text: key[2] }, { type: 'punct', text: key[3] });
    rest = line.slice(key[0].length);
  }
  for (const match of rest.matchAll(YAML_VALUE_PATTERN)) {
    const [text, expr, comment, punct] = match;
    if (expr) tokens.push({ type: 'anno', text });
    else if (comment) tokens.push({ type: 'comment', text });
    else if (punct) tokens.push({ type: 'punct', text });
    else tokens.push({ type: text.trim() ? 'string' : 'plain', text });
  }
  return tokens;
}

export function highlightLine(line: string, lang: Lang): Token[] {
  return lang === 'yaml' ? highlightYaml(line) : highlightCode(line, lang);
}

export function highlight(code: string, lang: Lang): Token[][] {
  return code.split('\n').map((line) => highlightLine(line, lang));
}
