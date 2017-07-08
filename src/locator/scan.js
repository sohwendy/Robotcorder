/* global PathTree Locator*/

function _getInput(element) {
  let hash = null;
  const tag = element.tagName.toLowerCase();

  if (tag === 'input') {
    switch (element.type) {
      case 'password':
        hash = { type: 'text', value: '***' };
        break;
      case 'radio':
        hash = { type: 'radio', value: element.value };
        break;
      case 'checkbox':
        hash = { type: 'checkbox', value: element.checked };
        break;
      case 'file':
        hash = { type: 'file', value: element.value };
        break;
      case 'email':
      case 'tel':
      case 'url':
      case 'number':
      case 'search':
      case 'text':
      case 'date':
      case 'datetime-local':
      case 'week':
      case 'month':
      case 'color':
        hash = { type: 'text', value: element.value };
        break;
      case 'submit':
      case 'image':
      case 'range':
      case 'reset':
        hash = { type: element.type };
        break;
      case 'hidden':
      default:
        break;
    }
  } else if (tag === 'textarea') {
    hash = { type: 'text', value: element.value };
  } else if (tag === 'select') {
    hash = { type: 'select', value: element.value };
  } else if (tag === 'a') {
    hash = { type: 'a', value: element.href };
  }
  return hash;
}

const Scan = {
  limit: 50000,

  parseNodes(array, root, attributesArray) {
    this.limit = this.limit - 1;
    if ((this.limit <= 0) || (root === undefined)) return [];

    const hash = _getInput(root);
    if (hash !== null) {
      const pathTree = PathTree.build(root, attributesArray, []);
      Object.assign(hash, {
        path: Locator.build(pathTree, root, hash.type, attributesArray)
      });
      array.push(hash);
    }

    const children = root.childNodes;
    for (let i = 0; i < children.length; i++) {
      if (children[i].nodeType === 1) {
        this.parseNodes(array, children[i], attributesArray);
      }
    }
    return array;
  },

  parseNode(time, node, attributesArray) {
    if (node !== undefined) {
      const hash = _getInput(node) || { type: 'default' };
      const pathTree = PathTree.build(node, attributesArray, []);

      Object.assign(hash, {
        time,
        path: Locator.build(pathTree, node, hash.type)
      });

      return hash;
    }
    return {};
  }
};
