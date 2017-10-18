/* global document $ chrome */

const gaAccount = 'UA-88380525-1';

const host = chrome;
const storage = host.storage.local;
const debug = false;

/*eslint-disable */
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
/*eslint-enable */

function logger(data) {
  if (debug) document.getElementById('textarea-log').value = data;
}

function analytics(data) {
  if (gaAccount) _gaq.push(data);
  logger(data);
}

function display(message) {
  if (message && message.message) {
    const field = document.querySelector('#textarea-script');
    field.value = message.message || '';
  }
}

function show(array, visible) {
  array.forEach((id) => {
    const element = document.getElementById(id);
    visible ? element.classList.remove('hidden') : element.classList.add('hidden');
  });
}

function enable(array, isEnabled) {
  array.forEach((id) => {
    const element = document.getElementById(id);
    isEnabled ? element.classList.remove('disabled') : element.classList.add('disabled');
  });
}

function toggle(e) {
  logger(e.target.id);
  if (e.target.id === 'record') {
    show(['stop', 'pause'], true);
    show(['record', 'resume', 'scan'], false);
    enable(['settings-panel'], false);

    $('#sortable').sortable('disable');
  } else if (e.target.id === 'pause') {
    show(['resume', 'stop'], true);
    show(['record', 'scan', 'pause'], false);
    enable(['settings-panel'], false);

    $('#sortable').sortable('disable');
  } else if (e.target.id === 'resume') {
    show(['pause', 'stop'], true);
    show(['record', 'scan', 'resume'], false);
    enable(['settings-panel'], false);

    $('#sortable').sortable('disable');
  } else if ((e.target.id === 'stop') || (e.target.id === 'scan')) {
    show(['record', 'scan'], true);
    show(['resume', 'stop', 'pause'], false);
    enable(['settings-panel'], true);

    $('#sortable').sortable('enable');
  } else if (e.target.id === 'settings') {
    analytics(['_trackEvent', 'settings', '⚙️']);
    document.getElementById('settings-panel').classList.toggle('hidden');
  }

  if ((e.canSave === false) || (e.target.id === 'record')) {
    document.getElementById('save').disabled = true;
  } else if ((e.canSave === true) || (e.target.id === 'scan') || (e.target.id === 'stop')) {
    document.getElementById('save').disabled = false;
  }
  if (e.demo) { document.getElementById('demo').checked = e.demo; }
  if (e.verify) { document.getElementById('verify').checked = e.verify; }
}

function busy(e) {
  if ((e.isBusy === true) || (e.isBusy === false)) {
    ['scan', 'record', 'stop', 'save', 'save', 'resume'].forEach((id) => {
      document.getElementById(id).disabled = e.isBusy;
    });
  }
}

function operation(e) {
  toggle(e);
  const locators = $('#sortable').sortable('toArray', { attribute: 'id' });
  host.runtime.sendMessage({ operation: e.target.id, locators }, display);

  analytics(['_trackEvent', e.target.id, '^-^']);
}

function settings(e) {
  const locators = $('#sortable').sortable('toArray', { attribute: 'id' });
  const demo = document.getElementById('demo').checked;
  const verify = document.getElementById('verify').checked;
  host.runtime.sendMessage({ operation: 'settings', locators, demo, verify });
  analytics(['_trackEvent', 'setting', e.target.id]);
}

function info() {
  host.runtime.sendMessage({ operation: 'info' });

  analytics(['_trackEvent', 'info', 'ℹ️']);
}

function like() {
  analytics(['_trackEvent', 'like', '👍']);
}

document.addEventListener('DOMContentLoaded', () => {
  storage.get({
    message: 'Record or Scan',
    operation: 'stop',
    canSave: false,
    isBusy: false,
    demo: false,
    verify: false,
    locators: []
  }, (state) => {
    display({ message: state.message });
    toggle({
      target: { id: state.operation },
      canSave: state.canSave,
      isBusy: state.isBusy,
      demo: state.demo,
      verify: state.verify
    });
    setTimeout(() => {
      const sortable = document.getElementById('sortable');
      state.locators.forEach((locator) => {
        const li = document.createElement('li');
        li.appendChild(document.createTextNode(locator));
        li.setAttribute('id', locator);
        li.setAttribute('class', 'ui-state-default');
        sortable.appendChild(li);
      });
    }, 200);
  });

  debug ? document.getElementById('textarea-log').classList.remove('hidden') : 0;

  ['record', 'resume', 'stop', 'pause', 'save', 'scan'].forEach((id) => {
    document.getElementById(id).addEventListener('click', operation);
  });

  ['demo', 'verify'].forEach((id) => {
    document.getElementById(id).addEventListener('change', settings);
  });

  document.getElementById('like').addEventListener('click', like);
  document.getElementById('info').addEventListener('click', info);
  document.getElementById('settings').addEventListener('click', toggle);

  $('#sortable').sortable({ update: settings });
  $('#sortable').disableSelection();
}, false);

host.storage.onChanged.addListener((changes, _) => {
  for (const key in changes) {
    if (key === 'isBusy') busy({ isBusy: changes.isBusy.newValue });
    if (key === 'message') display({ message: changes.message.newValue });
  }
});
