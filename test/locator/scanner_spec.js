/* eslint-disable no-undef */

const { expect } = require('chai');
const sinon = require('sinon');
const { scanner } = require('../../src/locator/scanner');

describe('scanner', () => {
  let sandbox;
  beforeEach(() => { sandbox = sinon.sandbox.create(); });
  afterEach(() => { sandbox.restore(); });

  describe('parseNodes()', () => {
    it('undefined root', () => {
      const attr = ['href', 'id'];

      const result = scanner.parseNodes([], undefined, attr);

      expect(result).to.deep.equal([]);
    });

    describe('works', () => {
      let cStub;
      let lStub;
      let pStub;
      const node = { type: 'random' };
      const attr = ['href', 'id'];
      const root = {
        childNodes: [
          {
            nodeType: 1,
            childNodes: [
              { nodeType: 4 }
            ]
          }, {
            nodeType: 1,
            childNodes: [
              { nodeType: 3 },
              { nodeType: 5 },
              {
                nodeType: 1,
                childNodes: [
                  { nodeType: 17 }
                ]
              }
            ]
          }
        ]
      };

      beforeEach(() => {
        cStub = sandbox.stub().returns(node);
        pStub = sandbox.stub().returns(['a', 'b']);
        lStub = sandbox.stub().returns('some_path');
      });

      it('calls builder', () => {
        locator = { build: lStub };
        builder = { build: pStub };
        classifier = cStub;

        const result = scanner.parseNodes([], root, attr);

        expect(builder.build.calledWith(root, attr, [])).to.be.true;
      });

      it('calls locator', () => {
        locator = { build: lStub };
        builder = { build: pStub };
        classifier = cStub;

        const result = scanner.parseNodes([], root, attr);

        expect(locator.build.calledWith(['a', 'b'], root, node.type, attr)).to.be.true;
      });

      it('calls classifier', () => {
        locator = { build: lStub };
        builder = { build: pStub };
        classifier = cStub;

        const result = scanner.parseNodes([], root, attr);

        expect(classifier.calledWith(root)).to.be.true;
      });

      it('returns array', () => {
        const nodeList = [
          { type: 'root' },
          { type: 'child_a' },
          { type: 'child_b' },
          { type: 'grandchild_b' }
        ];
        const expected = [
          { type: 'root', path: 'some_root' },
          { type: 'child_a', path: 'some_child_a' },
          { type: 'child_b', path: 'some_child_b' },
          { type: 'grandchild_b', path: 'some_grandchild_b' }
        ];

        builder = { build: sandbox.stub().returns([]) };
        lStub.withArgs([], root, nodeList[0].type, attr).returns('some_root');
        lStub.withArgs([], root.childNodes[0], nodeList[1].type, attr).returns('some_child_a');
        lStub.withArgs([], root.childNodes[1], nodeList[2].type, attr).returns('some_child_b');
        lStub.withArgs([], root.childNodes[1].childNodes[2], nodeList[3].type, attr).returns('some_grandchild_b');

        locator = { build: lStub };

        classifier = sandbox.stub();
        classifier.withArgs(root).returns(nodeList[0]);
        classifier.withArgs(root.childNodes[0]).returns(nodeList[1]);
        classifier.withArgs(root.childNodes[1]).returns(nodeList[2]);
        classifier.withArgs(root.childNodes[1].childNodes[2]).returns(nodeList[3]);

        const result = scanner.parseNodes([], root, attr);

        expect(result).to.deep.equal(expected);
      });
    });
  });

  describe('parseNode()', () => {
    it('undefined node', () => {
      const time = '2055';
      const attr = ['href', 'id'];

      const result = scanner.parseNode(time, undefined, attr);

      expect(result).to.deep.equal({ });
    });

    describe('works', () => {
      let cStub;
      let lStub;
      let pStub;
      const node = { type: 'random' };
      const attr = ['href', 'id'];

      beforeEach(() => {
        cStub = sandbox.stub().returns(node);
        pStub = sandbox.stub().returns(['a', 'b']);
        lStub = sandbox.stub().returns('some_path');
      });

      it('calls builder', () => {
        locator = { build: lStub };
        builder = { build: pStub };
        classifier = cStub;

        const result = scanner.parseNode('2055', node, attr);

        expect(builder.build.calledWith(node, attr, [])).to.be.true;
      });

      it('calls locator', () => {
        locator = { build: lStub };
        builder = { build: pStub };
        classifier = cStub;

        const result = scanner.parseNode('2055', node, attr);

        expect(locator.build.calledWith(['a', 'b'], node, node.type)).to.be.true;
      });

      it('calls classifier', () => {
        locator = { build: lStub };
        builder = { build: pStub };
        classifier = cStub;

        const result = scanner.parseNode('2055', node, attr);

        expect(classifier.calledWith(node)).to.be.true;
      });

      it('returns array', () => {
        locator = { build: lStub };
        builder = { build: pStub };
        classifier = cStub;
        const pTime = '2055';

        const result = scanner.parseNode(pTime, node, attr);

        expect(result).to.be.deep.equal({ path: 'some_path', time: pTime, type: 'random' });
      });
    });
  });
});
