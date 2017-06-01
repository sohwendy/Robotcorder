'use strict';

const gaAccount = 'UA-88380525-1';

var host = chrome;
const storage = host.storage.local;

var _gaq = _gaq || [];
_gaq.push(['_setAccount', gaAccount]);
_gaq.push(['_trackPageview']);
(function() {
  var ga = document.createElement('script');
  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);
})();

function analytics(data) {
  if (gaAccount) { _gaq.push(data); }
}

function display(message) {
  if (message && message.message) {
    let field = document.querySelector('#textarea-script');
    field.value = message.message || '';
  }
}

function toggle(e){
  if (e.target.id === 'record') {
    document.getElementById('record').classList.add('hidden');
    document.getElementById('stop').classList.remove('hidden');
    document.getElementById('settings-panel').classList.add('disabled');
    $('#sortable').sortable('disable');
  } else if ((e.target.id == 'stop') || (e.target.id === 'scan')) {
    document.getElementById('stop').classList.add('hidden');
    document.getElementById('record').classList.remove('hidden');
    document.getElementById('settings-panel').classList.remove('disabled');
    $('#sortable').sortable('enable');
  } else if (e.target.id == 'settings') {
    document.getElementById('settings-panel').classList.toggle('hidden');
  }

  if ((e.canSave === false) || (e.target.id === 'record')) {
    document.getElementById('save').disabled = true
  } else if ((e.canSave == true) || (e.target.id == 'scan') || (e.target.id == 'stop')) {
    document.getElementById('save').disabled = false;
  }
}

function busy(e) {
  if (e.isBusy === true) {
    document.getElementById('scan').disabled = true;
    document.getElementById('record').disabled = true;
    document.getElementById('stop').disabled = true;
    document.getElementById('save').disabled = true;
  } else if (e.isBusy === false) {
    document.getElementById('scan').disabled = false;
    document.getElementById('record').disabled = false;
    document.getElementById('stop').disabled = false;
    document.getElementById('save').disabled = false;
  }
}

function operation(e) {
  toggle(e);
  let locators = $('#sortable').sortable('toArray', { attribute: 'id' });
  host.runtime.sendMessage({ operation: e.target.id, locators: locators }, display);

  analytics(['_trackEvent', e.target.id, '^-^']);
}

function settings() {
  let locators = $('#sortable').sortable('toArray', { attribute: 'id' });
  host.runtime.sendMessage({operation: 'locators', locators: locators});

  analytics(['_trackEvent', 'locators', '@_@']);
}

function info() {
  host.runtime.sendMessage({ operation: 'info' });

  analytics(['_trackEvent', 'info', 'ℹ️']);
}

function like() {
  analytics(['_trackEvent', 'like', '👍']);
}


document.addEventListener('DOMContentLoaded', () => {
  storage.get({ message: 'Record or Scan', operation: 'stop', canSave: false, isBusy: false, locators: [] }, (state) => {
    display({ message: state.message });
    toggle({ target: { id: state.operation }, canSave: state.canSave, isBusy: state.isBusy });
    let sortable = document.getElementById('sortable');
    state.locators.forEach((locator) => {
      let li = document.createElement('li');
      li.appendChild(document.createTextNode(locator));
      li.setAttribute('id', locator);
      li.setAttribute('class', 'ui-state-default');
      sortable.appendChild(li);
    });
  });

  document.getElementById('record').addEventListener('click', operation);
  document.getElementById('stop').addEventListener('click', operation);
  document.getElementById('save').addEventListener('click', operation);
  document.getElementById('scan').addEventListener('click', operation);
  document.getElementById('like').addEventListener('click', like);
  document.getElementById('info').addEventListener('click', info);
  document.getElementById('settings').addEventListener('click', toggle);

  $('#sortable').sortable({update: settings});
  $('#sortable').disableSelection();

}, false);

host.storage.onChanged.addListener((changes, namespace) => {
  for (let key in changes) {
    if (key == 'isBusy')  busy({isBusy: changes['isBusy'].newValue});
    if (key == 'message') display({message: changes['message'].newValue});
  }
});