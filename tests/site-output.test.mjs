import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function builtPage(path) {
  return readFile(new URL(`../dist/${path}`, import.meta.url), 'utf8');
}

test('home introduces Hu and links to both sections', async () => {
  const html = await builtPage('index.html');
  assert.match(html, /胡某人/);
  assert.match(html, /北京科技大学/);
  assert.match(html, /强化学习/);
  assert.match(html, /href="\/essays\/"/);
  assert.match(html, /href="\/notes\/"/);
});

test('empty sections show their own titles and empty states', async () => {
  const essays = await builtPage('essays/index.html');
  const notes = await builtPage('notes/index.html');
  assert.match(essays, /随感/);
  assert.match(notes, /笔记/);
  assert.match(essays, /还没有文章/);
  assert.match(notes, /还没有文章/);
});
