"use strict";

function _getInput(element) {
  let hash = null;
  let tag = element.tagName.toLowerCase();

  if (tag === "input") {
    switch (element.type){
      case "password":
        hash = {type: "text", value: '***'};
        break;
      case "radio":
        hash = {type: "radio", value: element.value};
        break;
      case "checkbox":
        hash = {type: "checkbox", value: element.checked};
        break;
      case "file":
        hash = {type: "file", value: element.value};
        break;
      case "email":
      case "tel":
      case "url":
      case "number":
      case "search":
      case "text":
      case "date":
      case "datetime-local":
      case "week":
      case "month":
      case "color":
        hash = {type: "text", value: element.value};
        break;
      case "submit":
      case "image":
      case "range":
      case "reset":
        hash = {type: element.type};
        break;
      case "hidden":
      default:
        break;
    }
  } else if (tag == "textarea") {
    hash = {type: "text", value: element.value};
  } else if (tag == "select") {
    hash = {type: "select", value: element.value};
  } else if (tag == "a") {
    hash = {type: "a", value: element.href};
  }
  return hash;
}

/* PathTree constructs an array of element and its parents
 Example
     <body>
       <div class="d">
         <span class="s" id="s1">
       </div>
     </body>

    [{"span": [{class: "s", {"id": "s1"}]},
     {"div": [{class: "d"}]},
     {"body", [{index: 0}]}]
*/
var PathTree = {
  // find the position of the element
  //return 0 if element does not have sibling tags
  _getIndex(element) {
    let found = false;
    let count = 0;
    let index = 0;
    let siblings = element.parentNode.childNodes;

    for (let i = 0; i < siblings.length; i++) {
      if (siblings[i] === element) { found = true; }
      if ((siblings[i].nodeType === 1) && (siblings[i].tagName === element.tagName)) {
        count++ ;
        !found ? index++ : '';
      }
    }
    return count > 1 ? index + 1 : 0;
  },

  // construct a prioritized non empty array of {key, value} object
  // key is the attribute type, value contains int for index, [] for className, string for others
  _buildAttributes(element, selectors) {
    let array = selectors.map((sel) => {
      let attr;
      if (sel === "className") {
        attr = element.className.length > 0 ? element.className.split(" ") : [];
      } else if (sel === "index") {
        attr = 1;
        // attr = this._getIndex(element);
      } else { //name, id, for, href, title
        attr = element.getAttribute(sel);
      }
      //[] is required to template string as key
      return attr  ? {[`${sel}`]: attr} : null;
    });
    return array.filter(n => n);
  },

  // traverse up the document tree to construct an array containing the element attributes
  build(element, attributesArray, pathList) {
    if (!element) return pathList;
    if (element.nodeType === 9) return pathList;

    let array = this._buildAttributes(element, attributesArray);
    pathList.push({[`${element.tagName.toLowerCase()}`]: array});
    return this.build(element.parentNode, attributesArray, pathList);
  }
};

var XPath = {
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

var Scan = {
  limit: 50000,

  parseNodes(array, root, attributesArray) {
    this.limit = this.limit - 1;
    if ((this.limit <= 0) || (root == undefined)) return [];

    let hash = _getInput(root);
    if (hash != null) {
      let pathTree = PathTree.build(root, attributesArray, []);
      Object.assign(hash, {
        xpath: XPath.build(pathTree, root, hash.type, attributesArray)
      });
      array.push(hash);
    }

    let children = root.childNodes;
    for (let i = 0; i < children.length; i++) {
      if (children[i].nodeType === 1) {
        this.parseNodes(array, children[i], attributesArray);
      }
    }
    return array;
  },

  parseNode(time, node, attributesArray) {
    if (node != undefined) {
      let hash = _getInput(node) || { type: "default" };
      let pathTree = PathTree.build(node, attributesArray, []);

      Object.assign(hash, {
        time: time,
        xpath: XPath.build(pathTree, node, hash.type)
      });

      return hash;
    }
    return {};
  }
};