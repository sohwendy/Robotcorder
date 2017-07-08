const { expect } = require('chai');
const sinon = require('sinon');
const { classifier } = require('../../src/locator/classifier');

describe('classifier', () => {
  describe('returns {text, value}', () => {
    it('input password', () => {
      const tag = 'input';
      const hType = 'password';
      const element = {
        tagName: { toLowerCase: () => tag },
        type: hType,
        value: 'password123'
      };
      const result = classifier(element);
      expect(result).to.deep.equal({ type: 'text', value: '***' });
    });

    it('input text', () => {
      const tag = 'input';
      const hType = 'text';
      const element = {
        tagName: { toLowerCase: () => tag },
        type: hType,
        value: 8
      };
      const result = classifier(element);
      expect(result).to.deep.equal({ type: hType, value: element.value });
    });

    it('textarea', () => {
      const tag = 'textarea';
      const element = {
        tagName: { toLowerCase: () => tag },
        value: 5
      };
      const result = classifier(element);
      expect(result).to.deep.equal({ type: 'text', value: element.value });
    });
  });

  describe('returns {radio, value}', () => {
    it('input radio', () => {
      const tag = 'input';
      const hType = 'radio';
      const element = {
        tagName: { toLowerCase: () => tag },
        type: hType,
        value: false
      };
      const result = classifier(element);
      expect(result).to.deep.equal({ type: hType, value: element.value });
    });
  });

  describe('returns {checkbox, value}', () => {
    it('input checkbox', () => {
      const tag = 'input';
      const hType = 'checkbox';
      const element = {
        tagName: { toLowerCase: () => tag },
        type: hType,
        checked: false
      };
      const result = classifier(element);
      expect(result).to.deep.equal({ type: hType, value: element.checked });
    });
  });

  describe('returns {file, value}', () => {
    it('input file', () => {
      const tag = 'input';
      const hType = 'file';
      const element = {
        tagName: { toLowerCase: () => tag },
        type: hType,
        value: 'some_file'
      };
      const result = classifier(element);
      expect(result).to.deep.equal({ type: hType, value: element.value });
    });
  });

  describe('returns {type}', () => {
    it('input file', () => {
      const tag = 'input';
      const hType = 'image';
      const element = {
        tagName: { toLowerCase: () => tag },
        type: hType
      };
      const result = classifier(element);
      expect(result).to.deep.equal({ type: hType });
    });
  });

  describe('returns { }', () => {
    it('input hidden', () => {
      const tag = 'input';
      const hType = 'hidden';
      const element = {
        tagName: { toLowerCase: () => tag },
        type: hType
      };
      const result = classifier(element);
      expect(result).to.be.null;
    });

    it('input random', () => {
      const tag = 'input';
      const hType = 'hidden';
      const element = {
        tagName: { toLowerCase: () => tag },
        type: hType
      };
      const result = classifier(element);
      expect(result).to.be.null;
    });
  });

  describe('returns {select, value}', () => {
    it('select', () => {
      const tag = 'select';
      const element = {
        tagName: { toLowerCase: () => tag },
        value: 'some_select'
      };
      const result = classifier(element);
      expect(result).to.deep.equal({ type: tag, value: element.value });
    });
  });

  describe('returns {a, value}', () => {
    it('a', () => {
      const tag = 'a';
      const element = {
        tagName: { toLowerCase: () => tag },
        href: 'some_href'
      };
      const result = classifier(element);
      expect(result).to.deep.equal({ type: tag, value: element.href });
    });
  });
});
