"use strict";

var host = chrome;
var strategyList = [];

// var observer = new MutationObserver(recordMutate);

// var config = { attributes: true, characterData: true, subtree: true, childList: true};
//var config = { attributes: true, characterData: true, subtree: true };
//childList:	Set to true if additions and removals of the target node's child elements (including text nodes) are to be observed.
//attributes:	Set to true if mutations to target's attributes are to be observed.
//characterData	Set: to true if mutations to target's data are to be observed.
//subtree: Set to true if mutations to not just target, but also target's descendants are to be observed.
//attributeOldValue: Set to true if attributes is set to true and target's attribute value before the mutation needs to be recorded.
//characterDataOldValue: Set to true if characterData is set to true and target's data before the mutation needs to be recorded.
//attributeFilter: Set to an array of attribute local names (without namespace) if not all attribute mutations need to be observed.

host.runtime.sendMessage({operation: "load"});

host.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.operation == "record") {
      strategyList = request.locators || [];
      strategyList.push("index");
      document.addEventListener("change", recordChange, true);
      document.addEventListener("click", recordClick, true);
    }
    else if (request.operation == "stop") {
      document.removeEventListener("change", recordChange, true);
      document.removeEventListener("click", recordClick, true);
    }
    else if (request.operation == "scan") {
      strategyList = request.locators || [];
      strategyList.push("index");
      document.removeEventListener("change", recordChange, true);
      document.removeEventListener("click", recordClick, true);

      Scan.limit = 10000;
      let array = Scan.parseNodes([], document.body, strategyList);
      host.runtime.sendMessage({operation: "action", scripts: array});
    }
  }
);

function getTime(){
  return new Date().getTime();
}

function recordChange(event){
  let attr = Scan.parseNode(getTime(), event.target, strategyList);

  if (handleByChange(attr.type)) {
    Object.assign(attr, {trigger: "change"});
    host.runtime.sendMessage({operation: "action", script: attr});
  }
}

function recordClick(event){
  let attr = Scan.parseNode(getTime(), event.target, strategyList);

  if (!handleByChange(attr.type)) {
    Object.assign(attr, {trigger: "click"});
    host.runtime.sendMessage({operation: "action", script: attr});
  }
}

function handleByChange(type){
  return ["text", "file", "select"].some(n => type === n);
}