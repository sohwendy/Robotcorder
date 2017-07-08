/* eslint-disable no-undef */

const { expect } = require('chai');
const sinon = require('sinon');
const { locator } = require('../../src/locator/xpath-locator');

describe('xpath-locator', () => {
  describe('build()', () => {
    it('works with id', () => {
      const tree = [{ span: [{ id: 'some_id' }] }];
      const result = locator.build(tree, null, 'span');
      expect(result).to.equal('//span[@id="some_id"]');
    });

    it('works with for', () => {
      const tree = [{ span: [{ for: 'some_for' }] }];
      const result = locator.build(tree, null, 'span');
      expect(result).to.equal('//span[@for="some_for"]');
    });

    it('works with element', () => {
      const tree = [{ span: [{ for: 'some_for' }] }];
      const result = locator.build(tree, 'some_element', 'span');
      expect(result).to.equal('//span[@for="some_for"]');
    });

    it('works with name & select', () => {
      const tree = [{ select: [{ name: 's' }] }];
      const result = locator.build(tree, 'select', 'select');
      expect(result).to.equal('//select[@name="s"]');
    });

    describe('works with index', () => {
      const tree = [{ some_tag: [{ title: 's' }] }];

      beforeEach(() => { sandbox = sinon.sandbox.create(); });
      afterEach(() => { sandbox.restore(); });

      it('count > 1 && index > 1', () => {
        sandbox.stub(locator, '_getIndex').returns({ count: 4, index: 2 });
        const result = locator.build(tree, 'href', 'href');
        expect(result).to.equal('xpath=(//some_tag[@title="s"])[2]');
      });

      it('count <= 1', () => {
        sandbox.stub(locator, '_getIndex').returns({ count: 4, index: 1 });
        const result = locator.build(tree, 'href', 'href');
        expect(result).to.equal('//some_tag[@title="s"]');
      });

      it('index <= 1', () => {
        sandbox.stub(locator, '_getIndex').returns({ count: 1, index: 2 });
        const result = locator.build(tree, 'href', 'href');
        expect(result).to.equal('//some_tag[@title="s"]');
      });
    });
  });

  describe('_found()', () => {
    it('return true', () => {
      const attributes = ['@id', '@for'];
      const path = '//input[@id="happy"]';

      const result = locator._found(attributes, path);

      expect(result).to.be.true;
    });

    it('return false', () => {
      const attributes = ['@id', '@for'];
      const path = '//input[@name="happy"]';

      const result = locator._found(attributes, path);

      expect(result).to.be.false;
    });
  });

  describe('_getIndex()', () => {
    beforeEach(() => { sandbox = sinon.sandbox.create(); });
    afterEach(() => { sandbox.restore(); });
    let counter = 0;
    let max = 0;
    const iter = {
      iterateNext: () => {
        counter += 1;
        return counter >= max ? 0 : counter;
      }
    };

    it('returns max count, and index 1', () => {
      counter = 0;
      max = 3;
      const expected = { count: max, index: 1 };
      sandbox.stub(document, 'evaluate').returns(iter);

      const result = locator._getIndex('c', 'c');

      expect(result).to.be.deep.equal(expected);
    });

    it('returns max count and an index of 3', () => {
      counter = 0;
      max = 5;
      const expected = { count: max, index: 3 };
      sandbox.stub(document, 'evaluate').returns(iter);

      const result = locator._getIndex('c', expected.index);

      expect(result).to.be.deep.equal(expected);
    });
  });

  describe('_getSubpath()', () => {
    it('works for for attribute', () => {
      const attr = { for: 'hi' };
      const result = locator._getSubpath('', attr, 'some_tag');
      expect(result).to.equal('/some_tag[@for="hi"]');
    });

    it('works for class attribute', () => {
      const attr = { class: 'hi' };
      const result = locator._getSubpath('', attr, 'some_tag');
      expect(result).to.equal('/some_tag[@class="hi"]');
    });

    it('works for title attribute', () => {
      const attr = { title: 'hi' };
      const result = locator._getSubpath('', attr, 'some_tag');
      expect(result).to.equal('/some_tag[@title="hi"]');
    });

    it('works for href attribute', () => {
      const attr = { href: 'hi' };
      const result = locator._getSubpath('', attr, 'some_tag');
      expect(result).to.equal('/some_tag[@href="hi"]');
    });

    it('works for name attribute', () => {
      const attr = { name: 'hi' };
      const result = locator._getSubpath('', attr, 'some_tag');
      expect(result).to.equal('/some_tag[@name="hi"]');
    });

    it('works for id attribute', () => {
      const attr = { id: 'hi' };
      const result = locator._getSubpath('', attr, 'some_tag');
      expect(result).to.equal('/some_tag[@id="hi"]');
    });

    it('works for index attribute', () => {
      const attr = { index: 'hi' };
      const result = locator._getSubpath('', attr, 'some_tag');
      expect(result).to.equal('/some_tag');
    });

    it('return empty for invalid tag', () => {
      const attr = { };
      const result = locator._getSubpath('', attr, 'some_tag');
      expect(result).to.equal('');
    });
  });
});
