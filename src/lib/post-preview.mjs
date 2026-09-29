import { unified } from 'unified';
import remarkParse from 'remark-parse';

function inlineText(node) {
  if (node.type === 'text' || node.type === 'inlineCode') return node.value;
  if (node.type === 'image' || node.type === 'imageReference') return '';
  return (node.children ?? []).map(inlineText).join('');
}

export function previewFromMarkdown(markdown) {
  const tree = unified().use(remarkParse).parse(markdown);
  const definitions = new Map();
  /** @type {string | null} */
  let image = null;
  let excerpt = '';
  let heading = '';

  function collectDefinitions(node) {
    if (node.type === 'definition') definitions.set(node.identifier.toLowerCase(), node.url);
    for (const child of node.children ?? []) collectDefinitions(child);
  }

  collectDefinitions(tree);

  function visit(node) {
    if (node.type === 'image' && image === null) image = node.url;
    if (node.type === 'imageReference' && image === null) {
      image = definitions.get(node.identifier.toLowerCase()) ?? null;
    }
    if (node.type === 'paragraph' && !excerpt) {
      excerpt = inlineText(node).replace(/\s+/g, ' ').trim();
    }
    if (node.type === 'heading' && !heading) {
      heading = inlineText(node).replace(/\s+/g, ' ').trim();
    }
    for (const child of node.children ?? []) visit(child);
  }

  visit(tree);
  return { image, excerpt: (excerpt || heading).slice(0, 180) };
}
