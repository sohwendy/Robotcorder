const map = {
  url: { keyword: 'Open Browser' },
  text: { keyword: 'Input Text', value: 'y' },
  file: { keyword: 'Choose File', value: 'y' },
  button: { keyword: 'Click Button' },
  a: { keyword: 'Click Link' },
  select: { keyword: 'Select From List By Value', value: 'y' },
  // radio:    {keyword: "Select Radio Button", value: "y"},
  default: { keyword: 'Click Element' }
};

const Translator = {
  generateEvents(list, length, demo, verify) {
    const events = [];
    let event = null;
    for (let i = 0; i < list.length && i < length; i++) {
      if (i > 0) {
        event = this._generateVerify(list[i], verify);
        event && events.push(event);
      }
      event = this._generatePath(list[i]);
      event && events.push(event);
      event = this._generateDemo(demo);
      event && events.push(event);
    }

    return events.join('\n');
  },

  generateFile(list, length, demo, verify) {
    let events = [];
    let event = null;
    for (let i = 0; i < list.length && i < length; i++) {
      if (i > 0) {
        event = this._generateVerify(list[i], verify);
        event && events.push(event);
      }
      event = this._generatePath(list[i]);
      event && events.push(event);
      event = this._generateDemo(demo);
      event && events.push(event);
    }
    events = events.reduce((a, b) => `${a}    ${b}\n`, '');

    return `${'*** Settings ***' +
      '\nDocumentation     A test suite with a single test for '}${list[0].title
      }\n...               Created by hats' Robotcorder` +
      '\nLibrary           Selenium2Library    timeout=10' +
      '\nSuite Teardown    Close All Browsers' +
      '\n\n*** Variables ***' +
      '\n${BROWSER}    chrome' +
      '\n${SLEEP}    3' +
      '\n\n*** Test Cases ***' +
      `\n${list[0].title} test` +
      `\n${events}`;
  },

  _generatePath(attr) {
    const type = map[attr.type] || map.default;
    let path = type.keyword;

    path += attr.type === 'url' ? `  ${attr.path}  \${BROWSER}` : `  ${attr.path}`;
    path += attr.value && type.value ? `  ${attr.value}` : '';

    return path;
  },

  _generateDemo(demo) {
    return demo ? 'Sleep    ${SLEEP}' : '';
  },

  _generateVerify(attr, verify) {
    return attr.path && verify ? `Wait Until Page Contains Element   ${attr.path}` : '';
  }
};
