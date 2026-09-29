export function remarkPublicImages({ base }) {
  const prefix = base === '/' ? '' : base.replace(/\/$/, '');

  return function transform(tree) {
    function visit(node) {
      if (node.type === 'image' && node.url.startsWith('/') && !node.url.startsWith('//')) {
        node.url = `${prefix}${node.url}`;
      }
      for (const child of node.children ?? []) visit(child);
    }
    visit(tree);
  };
}
