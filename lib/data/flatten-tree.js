export function flattenTree(root) {
  const list = [];
  let index = 0;

  function collect(node) {
    if (node.level >= 0) {
      node.rowIndex = index++;
      list.push(node);
    }

    if (node.isOpen) {
      node.children?.forEach(collect);
    }
  }

  collect(root);
  return list;
}