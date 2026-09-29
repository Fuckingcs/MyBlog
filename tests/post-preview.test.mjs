import test from 'node:test';
import assert from 'node:assert/strict';
import { previewFromMarkdown } from '../src/lib/post-preview.mjs';

test('uses the first Markdown image and readable paragraph text', () => {
  const result = previewFromMarkdown('开头文字 ![配图](/images/a.png) 后文\n\n![第二张](/images/b.png)');
  assert.equal(result.image, '/images/a.png');
  assert.equal(result.excerpt, '开头文字 后文');
});

test('uses the gradient fallback when no image exists', () => {
  const result = previewFromMarkdown('## 小标题\n\n这是一段正文。');
  assert.equal(result.image, null);
  assert.equal(result.excerpt, '这是一段正文。');
});

test('skips code blocks and image alt text in the excerpt', () => {
  const result = previewFromMarkdown('```js\nsecret()\n```\n\n![不应显示](/images/a.png)\n\n阅读 [这篇文章](https://example.com)。');
  assert.equal(result.excerpt, '阅读 这篇文章。');
});
