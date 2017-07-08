/* global document chrome Scan*/

const host = chrome;
let strategyList = [];

/*
var observer = new MutationObserver(recordMutate);
var config = { attributes: true, characterData: true, subtree: true, childList: true};
var config = { attributes: true, characterData: true, subtree: true };
childList: Set to true to observe additions and removals of the target node's child elements (including text nodes).
attributes: Set to true if mutations to target's attributes are to be observed.
characterData: Set to true if mutations to target's data are to be observed.
subtree: Set to true if mutations to not just target, but also target's descendants are to be observed
attributeOldValue: true if recording attributes is set to true and target's attribute value before the mutation
characterDataOldValue: true if recording characterData is set to true and target's data before the mutation
attributeFilter: true if observing an array of attribute local names (without namespace) if not all attribute mutations
*/
host.runtime.sendMessage({ operation: 'load' });

function getTime() {
  return new Date().getTime();
}

function handleByChange(type) {
  return ['text', 'file', 'select'].some(n => type === n);
}

function recordChange(event) {
  const attr = Scan.parseNode(getTime(), event.target, strategyList);

  if (handleByChange(attr.type)) {
    Object.assign(attr, { trigger: 'change' });
    host.runtime.sendMessage({ operation: 'action', script: attr });
  }
}

function recordClick(event) {
  const attr = Scan.parseNode(getTime(), event.target, strategyList);

  if (!handleByChange(attr.type)) {
    Object.assign(attr, { trigger: 'click' });
    host.runtime.sendMessage({ operation: 'action', script: attr });
  }
}

host.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.operation === 'record') {
      strategyList = request.locators || [];
      strategyList.push('index');
      document.addEventListener('change', recordChange, true);
      document.addEventListener('click', recordClick, true);
    } else if (request.operation === 'stop') {
      document.removeEventListener('change', recordChange, true);
      document.removeEventListener('click', recordClick, true);
    } else if (request.operation === 'scan') {
      strategyList = request.locators || [];
      strategyList.push('index');
      document.removeEventListener('change', recordChange, true);
      document.removeEventListener('click', recordClick, true);

      Scan.limit = 10000;
      const array = Scan.parseNodes([], document.body, strategyList);
      host.runtime.sendMessage({ operation: 'action', scripts: array });
    }
  }
);
