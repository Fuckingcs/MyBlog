import test from 'node:test';
import assert from 'node:assert/strict';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { remarkPublicImages } from '../src/lib/remark-images.mjs';

test('prefixes public image paths for a GitHub project site', () => {
  const tree = unified().use(remarkParse).parse('![本地图](/images/a.png) ![远程图](https://example.com/b.png)');
  remarkPublicImages({ base: '/MyBlog' })(tree);
  const images = tree.children[0].children.filter((node) => node.type === 'image');
  assert.deepEqual(images.map((node) => node.url), ['/MyBlog/images/a.png', 'https://example.com/b.png']);
});
