import test from 'node:test';
import assert from 'node:assert/strict';
import { pageFor } from '../src/lib/pagination.mjs';

const posts = Array.from({ length: 9 }, (_, index) => ({
  id: `essay-${index + 1}`,
  data: { category: 'essays', date: new Date(2026, 0, index + 1) },
})).concat({ id: 'note', data: { category: 'notes', date: new Date(2026, 0, 31) } });

test('returns eight newest posts on the first page', () => {
  const result = pageFor(posts, 'essays', 1);
  assert.equal(result.pageCount, 2);
  assert.equal(result.items.length, 8);
  assert.equal(result.items[0].id, 'essay-9');
  assert.equal(result.items[7].id, 'essay-2');
});

test('returns the remaining post on the second page', () => {
  const result = pageFor(posts, 'essays', 2);
  assert.deepEqual(result.items.map((post) => post.id), ['essay-1']);
});

test('keeps notes separate and makes one empty first page', () => {
  assert.deepEqual(pageFor(posts, 'notes', 1).items.map((post) => post.id), ['note']);
  const empty = pageFor(posts, 'missing', 1);
  assert.equal(empty.pageCount, 1);
  assert.deepEqual(empty.items, []);
});
