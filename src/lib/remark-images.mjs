export function remarkPublicImages({ base }) {
  const prefix = base === '/' ? '' : base.replace(/\/$/, '');

  return function transform(tree) {
    const imageReferences = new Set();

    function collectImageReferences(node) {
      if (node.type === 'imageReference') imageReferences.add(node.identifier.toLowerCase());
      for (const child of node.children ?? []) collectImageReferences(child);
    }

    collectImageReferences(tree);

    function visit(node) {
      const isImageUrl = node.type === 'image'
        || (node.type === 'definition' && imageReferences.has(node.identifier.toLowerCase()));
      if (isImageUrl && node.url.startsWith('/') && !node.url.startsWith('//')) {
        node.url = `${prefix}${node.url}`;
      }
      for (const child of node.children ?? []) visit(child);
    }
    visit(tree);
  };
}
