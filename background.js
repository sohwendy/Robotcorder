"use strict";

var host = chrome;

var list = [];
var script;
var storage = host.storage.local;
var content = host.tabs;
var icon = host.browserAction;
var maxLength = 5000;
var recordTab = 0;

storage.set({
  locators: ["for", "name", "id", "title", "href", "class"],
  operation: "stop",
  message: instruction,
  canSave: false,
  isBusy: false
});

host.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    let operation = request.operation;

    if (operation == "record") {
      icon.setIcon({path: logo[operation]});

      content.query(tab, (tabs) => {
        recordTab = tabs[0];
        list = [{type: "url", path: recordTab.url, time: 0, trigger: 'record', title: recordTab.title}];
        content.sendMessage(tabs[0].id, {operation: operation, locators: request.locators});
      });

      storage.set({message: statusMessage[operation], operation: operation, canSave: false});

    } else if (operation == "scan") {
      icon.setIcon({path: logo["action"]});

      content.query(tab, (tabs) => {
        recordTab = tabs[0];
        list = [{type: "url", path: recordTab.url, time: 0, trigger: 'scan', title: recordTab.title}];
        content.sendMessage(tabs[0].id, {operation: operation, locators: request.locators});
      });

      storage.set({message: statusMessage[operation], operation: "scan", canSave: true, isBusy: true});

    } else if (operation == "stop") {
      recordTab = 0;
      icon.setIcon({path: logo[operation]});

      script = RobotTranslator.generateEvents(list, maxLength);
      content.query(tab, (tabs) => {
        content.sendMessage(tabs[0].id, {operation: "stop"});
      });

      storage.set({message: script, operation: operation, canSave: true});

    } else if (operation == "save") {
      let file = RobotTranslator.generateFile(list);
      let blob = new Blob([file], {type: "text/plain;charset=utf-8"});
      host.downloads.download({
        url: URL.createObjectURL(blob),
        filename: 'test_script.robot'
      });

    } else if (operation == "locators") {
      storage.set({locators: request.locators});

    } else if (operation == "load") {
      storage.get({operation: "stop", locators: []}, (state) => {
        content.sendMessage(sender.tab.id, {operation: state.operation, locators: state.locators});
      });

    } else if (operation == "info") {
      host.tabs.create({ url: url });
      
    } if (operation == "action") {
      if (request.script) {
        selection(request.script);
        icon.setIcon({path: logo[operation]});
        setTimeout(() => { icon.setIcon({path: logo["record"] })}, 1000);
      }

      if (request.scripts) {
        icon.setIcon({path: logo["stop"]});
        list = request.scripts;
        script = RobotTranslator.generateEvents(list, maxLength);

        storage.set({message: script, operation: "stop", isBusy: false});
      }
    }
  }
);

function selection(item) {
  if (list.length == 0) {
    list.push(item);
    return;
  }

  let prevItem = list[list.length - 1];

  // console.log(Math.abs(item.time - prevItem.time), item.time, prevItem.trigger, item.trigger, item);

  if (Math.abs(item.time - prevItem.time) > 20) {
    list.push(item);
    return;
  }

  if (item.trigger == "click")
    return;

  if ((item.trigger == "change") && (prevItem.trigger == "click")) {
    list[list.length - 1] = item;
    return;
  }

  list.push(item);
}