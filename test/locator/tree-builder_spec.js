const { expect } = require('chai');
const sinon = require('sinon');
const { builder } = require('../../src/locator/tree-builder');

describe('construct', () => {
  describe.skip('_getIndex()', () => {
    it('return 0 for only child', () => { });
    it('return count for last child', () => { });
    it('return count for 2nd child', () => { });
  });

  describe('_buildAttributes()', () => {
    const hash = {
      name: 'some_name',
      id: 'some_id',
      title: 'some_title',
      for: 'some_for',
      href: null
    };
    const element = {
      getAttribute: sel => hash[sel],
      className: 'class_a class_b'
    };

    it('builds for selectors only', () => {
      const selectors = ['className', 'index', 'id', 'for'];
      const expected = [
        { className: ['class_a', 'class_b'] },
        { index: 1 },
        { id: 'some_id' },
        { for: 'some_for' }
      ];
      const result = builder._buildAttributes(element, selectors);
      expect(result).to.deep.equal(expected);
    });

    it('excludes attribute with null value', () => {
      const selectors = ['index', 'className', 'id', 'href'];
      const expected = [
        { index: 1 },
        { className: ['class_a', 'class_b'] },
        { id: 'some_id' }
      ];
      const result = builder._buildAttributes(element, selectors);
      expect(result).to.deep.equal(expected);
    });

    it('excludes empty className', () => {
      element.className = '';
      const selectors = ['id', 'className', 'index'];
      const expected = [
        { id: 'some_id' },
        { className: [] },
        { index: 1 }
      ];
      const result = builder._buildAttributes(element, selectors);
      expect(result).to.deep.equal(expected);
    });
  });

  describe('build()', () => {
    let sandbox;
    before(() => { sandbox = sinon.sandbox.create(); });
    after(() => { sandbox.restore(); });

    it('works', () => {
      const stub = sandbox.stub(builder, '_buildAttributes');
      stub.onCall(0).returns([
        { className: ['class_a', 'class_b'] },
        { id: 'some_id_1' }
      ]);
      stub.onCall(1).returns([
        { className: ['class_c', 'class_d'] },
        { id: 'some_id_2' }
      ]);
      const attributesArray = ['id', 'className'];
      const expected = [
        {
          tag_a: [
            { className: ['class_a', 'class_b'] },
            { id: 'some_id_1' }
          ]
        }, {
          tag_b: [
            { className: ['class_c', 'class_d'] },
            { id: 'some_id_2' }
          ]
        }
      ];
      const element = {
        nodeType: 1,
        tagName: { toLowerCase: () => 'tag_a' },
        parentNode: {
          nodeType: 2,
          tagName: { toLowerCase: () => 'tag_b' },
          parentNode: {
            nodeType: 9
          }
        }
      };
      const result = builder.build(element, attributesArray, []);
      expect(result).to.deep.equal(expected);
    });
  });
});
