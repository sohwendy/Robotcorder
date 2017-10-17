/* eslint-disable no-undef */

const { expect } = require('chai');
const sinon = require('sinon');
const { translator } = require('../../src/translator/robot-translator');

describe('robot-translator', () => {
  describe('generateOutput()', () => {
    let sandbox;
    before(() => { sandbox = sinon.sandbox.create(); });
    after(() => { sandbox.restore(); });

    it('works', () => {
      const stub = sandbox.stub(translator, '_generateEvents').returns(['a', 'b', 'c']);

      const result = translator.generateOutput([], 1, true, true);
      expect(result).to.equal('a\nb\nc');
    });
  });

  describe('generateFile()', () => {
    let sandbox;
    before(() => { sandbox = sinon.sandbox.create(); });
    after(() => { sandbox.restore(); });

    it('works', () => {
      const events = ['a', 'b', 'c'];
      sandbox.stub(translator, '_generateEvents').returns(events);

      const expected = '*** Settings ***' +
        '\nDocumentation     A test suite with a single test for some_title' +
        "\n...               Created by hats' Robotcorder" +
        '\nLibrary           Selenium2Library    timeout=10' +
        '\n\n*** Variables ***' +
        '\n${BROWSER}    chrome' +
        '\n${SLEEP}    3' +
        '\n\n*** Test Cases ***' +
        '\nsome_title test' +
        `\n    ${events.join('\n    ')}\n` +
        '\n    Close Browser';

      const result = translator.generateFile([{ title: 'some_title' }], 1, true, true);

      expect(result).to.equal(expected);
    });
  });

  describe('_generateEvents()', () => {
    it('works', () => {
      const list = [
        { type: 'url', value: 'some_value', path: 'some_path_url' },
        { type: 'button', path: 'some_path_button' }
      ];
      const expected = [
        'Open Browser    some_path_url    ${BROWSER}',
        'Click Button    some_path_button'
      ];

      const result = translator._generateEvents(list, 2, false, false);

      expect(result).to.be.deep.equal(expected);
    });

    it('events length exceeds length', () => {
      const list = [
        { type: 'url', value: 'some_value', path: 'some_path_url' },
        { type: 'button', path: 'some_path_button' }
      ];
      const expected = ['Open Browser    some_path_url    ${BROWSER}'];

      const result = translator._generateEvents(list, 1, false, false);

      expect(result).to.be.deep.equal(expected);
    });

    it('with verify', () => {
      const list = [
        { type: 'url', value: 'some_value', path: 'some_path_url' },
        { type: 'button', path: 'some_path_button' },
        { type: 'text', value: 'some_value', path: 'some_path_text' }
      ];
      const expected = [
        'Open Browser    some_path_url    ${BROWSER}',
        'Wait Until Page Contains Element    some_path_button',
        'Click Button    some_path_button',
        'Wait Until Page Contains Element    some_path_text',
        'Input Text    some_path_text    some_value'
      ];

      const result = translator._generateEvents(list, 3, false, true);

      expect(result).to.be.deep.equal(expected);
    });

    it('with demo', () => {
      const list = [
        { type: 'url', value: 'some_value', path: 'some_path_url' },
        { type: 'text', value: 'some_value', path: 'some_path_text' }
      ];
      const expected = [
        'Open Browser    some_path_url    ${BROWSER}',
        'Sleep    ${SLEEP}',
        'Input Text    some_path_text    some_value',
        'Sleep    ${SLEEP}'
      ];

      const result = translator._generateEvents(list, 3, true, false);

      expect(result).to.be.deep.equal(expected);
    });

    it('with demo & verify', () => {
      const list = [
        { type: 'url', value: 'some_value', path: 'some_path_url' },
        { type: 'button', path: 'some_path_button' },
        { type: 'text', value: 'some_value', path: 'some_path_text' }
      ];
      const expected = [
        'Open Browser    some_path_url    ${BROWSER}',
        'Sleep    ${SLEEP}',
        'Wait Until Page Contains Element    some_path_button',
        'Click Button    some_path_button',
        'Sleep    ${SLEEP}',
        'Wait Until Page Contains Element    some_path_text',
        'Input Text    some_path_text    some_value',
        'Sleep    ${SLEEP}'
      ];

      const result = translator._generateEvents(list, 3, true, true);

      expect(result).to.be.deep.equal(expected);
    });

    it('events length exceeds length', () => {
      const list = [
        { type: 'url', value: 'some_value', path: 'some_path_url' },
        { type: 'button', path: 'some_path_button' },
        { type: 'text', value: 'some_value', path: 'some_path_text' }
      ];
      const expected = [
        'Open Browser    some_path_url    ${BROWSER}',
        'Sleep    ${SLEEP}',
        'Wait Until Page Contains Element    some_path_button',
        'Click Button    some_path_button',
        'Sleep    ${SLEEP}'
      ];

      const result = translator._generateEvents(list, 2, true, true);

      expect(result).to.be.deep.equal(expected);
    });
  });

  describe('_generatePath()', () => {
    it('works for url', () => {
      const attr = { type: 'url', value: 'some_value', path: 'some_path' };
      const result = translator._generatePath(attr);
      expect(result).to.be.equal('Open Browser    some_path    ${BROWSER}');
    });

    it('works for keyword with value', () => {
      const attr = { type: 'text', value: 'some_value', path: 'some_path' };
      const result = translator._generatePath(attr);
      expect(result).to.be.equal('Input Text    some_path    some_value');
    });

    it('works for keyword without value', () => {
      const attr = { type: 'button', value: 'some_value', path: 'some_path' };
      const result = translator._generatePath(attr);
      expect(result).to.be.equal('Click Button    some_path');
    });
  });

  describe('_generateDemo()', () => {
    describe('returns a string when', () => {
      it('Demo = true ', () => {
        const result = translator._generateDemo(true);
        expect(result).to.be.equal('Sleep    ${SLEEP}');
      });
    });

    describe('returns an empty string when', () => {
      it('Demo = false ', () => {
        const result = translator._generateDemo(false);
        expect(result).to.be.equal('');
      });
    });
  });

  describe('_generateVerify()', () => {
    describe('returns a string when', () => {
      it('verify = true ', () => {
        const result = translator._generateVerify({ path: 'a' }, true);
        expect(result).to.be.equal('Wait Until Page Contains Element    a');
      });
    });

    describe('returns an empty string when', () => {
      it('verify = false ', () => {
        const result = translator._generateVerify({ path: 'a' }, false);
        expect(result).to.be.equal('');
      });

      it('attr.path is a string', () => {
        const result = translator._generateVerify({ }, true);
        expect(result).to.be.equal('');
      });
    });
  });
});
