/* global document chrome */

const host = chrome;
const storage = host.storage.local;

function update() {
  const values = document.getElementById('custom-locators').value;
  const array = values ? values.split(',') : ['for', 'name', 'id', 'title', 'href', 'class'];
  storage.set({ locators: array });
}

document.addEventListener('DOMContentLoaded', () => {
  storage.get({
    locators: []
  }, (state) => {
    document.getElementById('custom-locators').value = state.locators.join(',');
  });
  document.getElementById('update').addEventListener('click', update);
});

if (typeof exports !== 'undefined') exports.update = update;
