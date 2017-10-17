const url = 'https://github.com/sohwendy/Robotcorder';

const tab = { active: true, currentWindow: true };

const logo = {
  stop: '/assets/icon-stop.png',
  record: '/assets/icon-record.png',
  scan: '/assets/icon-stop.png',
  action: '/assets/icon-action.png'
};

const filename = 'test_script.robot';

const statusMessage = {
  stop: 'Stopped',
  record: 'Recording action...',
  scan: 'Scanning html document...'
};

const instruction = 'Robotcorder\n' +
  '\n' +
  'Generate your RobotFramework Test Script via\n' +
  '* Record user actions\n' +
  '* Scan the page for inputs\n' +
  '* Config the locators priorities that best suit your app\n' +
  '\n' +
  '\n' +
  'Automating test automation 🤗';

if (typeof module.exports !== 'undefined') {
  module.exports.url = url;
  module.exports.tab = tab;
  module.exports.logo = logo;
  module.exports.filename = filename;
  module.exports.statusMessage = statusMessage;
  module.exports.instruction = instruction;
};