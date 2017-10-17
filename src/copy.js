/* global Clipboard $ */

const clipboard = new Clipboard('#copy');

const copyStatus = (className) => {
  $('#copy').addClass(className);
  setTimeout(() => { $('#copy').removeClass(className); }, 3500);
};

clipboard.on('success', (e) => {
  copyStatus('copy-ok');

  e.clearSelection();
});

clipboard.on('error', (e) => {
  copyStatus('copy-fail');

  /* eslint-disable no-console */
  console.error('Action:', e.action);
  console.error('Trigger:', e.trigger);
  /* eslint-enable no-console */
});
