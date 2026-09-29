export function pageFor(posts, category, page, pageSize = 8) {
  const matching = posts
    .filter((post) => post.data.category === category)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  const pageCount = Math.max(1, Math.ceil(matching.length / pageSize));
  const start = (page - 1) * pageSize;

  return {
    items: matching.slice(start, start + pageSize),
    page,
    pageCount,
  };
}
