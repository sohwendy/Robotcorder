/* global chrome URL Blob */
/* global instruction filename statusMessage url tab logo translator */

const host = chrome;

let list = [];
let script;
const storage = host.storage.local;
const content = host.tabs;
const icon = host.browserAction;
const maxLength = 5000;
let recordTab = 0;
let demo = false;
let verify = false;

storage.set({
  locators: ['for', 'name', 'id', 'title', 'href', 'class'],
  operation: 'stop',
  message: instruction,
  demo: false,
  verify: false,
  canSave: false,
  isBusy: false
});

function selection(item) {
  if (list.length === 0) {
    list.push(item);
    return;
  }

  const prevItem = list[list.length - 1];

  if (Math.abs(item.time - prevItem.time) > 20) {
    list.push(item);
    return;
  }

  if (item.trigger === 'click') { return; }

  if ((item.trigger === 'change') && (prevItem.trigger === 'click')) {
    list[list.length - 1] = item;
    return;
  }

  list.push(item);
}

host.runtime.onMessage.addListener((request, sender, sendResponse) => {
  let { operation } = request;

  if (operation === 'record') {
    icon.setIcon({ path: logo[operation] });

    content.query(tab, (tabs) => {
      [recordTab] = tabs;
      list = [{
        type: 'url', path: recordTab.url, time: 0, trigger: 'record', title: recordTab.title
      }];
      content.sendMessage(tabs[0].id, { operation, locators: request.locators });
    });

    storage.set({ message: statusMessage[operation], operation, canSave: false });
  } else if (operation === 'pause') {
    icon.setIcon({ path: logo.pause });

    content.query(tab, (tabs) => {
      content.sendMessage(tabs[0].id, { operation: 'stop' });
    });
    storage.set({ operation: 'pause', canSave: false, isBusy: false });
  } else if (operation === 'resume') {
    operation = 'record';

    icon.setIcon({ path: logo[operation] });

    content.query(tab, (tabs) => {
      [recordTab] = tabs;
      content.sendMessage(tabs[0].id, { operation, locators: request.locators });
    });

    storage.set({ message: statusMessage[operation], operation, canSave: false });
  } else if (operation === 'scan') {
    icon.setIcon({ path: logo.action });

    content.query(tab, (tabs) => {
      [recordTab] = tabs;
      list = [{
        type: 'url', path: recordTab.url, time: 0, trigger: 'scan', title: recordTab.title
      }];
      content.sendMessage(tabs[0].id, { operation, locators: request.locators });
    });

    storage.set({
      message: statusMessage[operation], operation: 'scan', canSave: true, isBusy: true
    });
  } else if (operation === 'stop') {
    recordTab = 0;
    icon.setIcon({ path: logo[operation] });

    script = translator.generateOutput(list, maxLength, demo, verify);
    content.query(tab, (tabs) => {
      content.sendMessage(tabs[0].id, { operation: 'stop' });
    });

    storage.set({ message: script, operation, canSave: true });
  } else if (operation === 'save') {
    const file = translator.generateFile(list, maxLength, demo, verify);
    const blob = new Blob([file], { type: 'text/plain;charset=utf-8' });

    host.downloads.download({
      url: URL.createObjectURL(blob, { oneTimeOnly: true }),
      filename
    });
  } else if (operation === 'settings') {
    ({ demo, verify } = request);

    storage.set({ locators: request.locators, demo, verify });
  } else if (operation === 'load') {
    storage.get({ operation: 'stop', locators: [] }, (state) => {
      content.sendMessage(sender.tab.id, { operation: state.operation, locators: state.locators });
    });
  } else if (operation === 'info') {
    host.tabs.create({ url });
  } else if (operation === 'action') {
    if (request.script) {
      selection(request.script);
      icon.setIcon({ path: logo[operation] });
      setTimeout(() => { icon.setIcon({ path: logo.record }); }, 1000);
    }

    if (request.scripts) {
      icon.setIcon({ path: logo.stop });
      list = list.concat(request.scripts);
      script = translator.generateOutput(list, maxLength, demo, verify);

      storage.set({ message: script, operation: 'stop', isBusy: false });
    }
  }
});
