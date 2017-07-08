"use strict";

var Locator = {
  build(pathTree, element, type) {
    let item = pathTree[0];
    let tag = Object.keys(item)[0];
    let path = '/' + item[tag].reduce((subpath, attr) => {
      return (subpath === "" ? this._getSubpath(subpath, attr, tag) : subpath);
    },"");

    if (!element) return path;
    if (this._found(["@id", "@for"], path)) return path;
    if (this._found(["@name"], path) && this._found(["select"], type)) return path;

    let {count, index} = this._getIndex(path, element);
    return ((count > 1) && (index > 1)) ? `xpath=(${path})[${index}]` : path;
  },

  _found(attributes, path){
    attributes.some((attr) => { return path.includes(attr); });
  },

  _getIndex(path, element){
    let index = 1; //1 - unique tag
    let count = 1; //1 - unique element

    let node;
    let nodes = document.evaluate('.' + path, document.body, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
    while (node = nodes.iterateNext()) {
      if (node === element) { index = count; }
      count ++;
    }
    return {count, index};
  },

  _concat(subpath, path) {
    return subpath + path;
  },

  _getSubpath(subpath, attr, tag) {
     if (attr.for != null) return `/${tag}[@for="${attr.for}"]`;
     if ((attr.class != null) && (attr.class.length > 0)) return `/${tag}[@class="${attr.class}"]`;
     if (attr.title != null) return `/${tag}[@title="${attr.title}"]`;
     if (attr.href != null) return `/${tag}[@href="${attr.href}"]`;
     if (attr.name != null) return `/${tag}[@name="${attr.name}"]`;
     if (attr.id != null) return `/${tag}[@id="${attr.id}"]`;
     if (attr.index != null) return `/${tag}`;
     return "";
  }
};
