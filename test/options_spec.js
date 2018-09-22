/* eslint-disable no-undef */

const sinon = require('sinon');
const options = require('../src/options');

describe('options', () => {
  let sandbox;
  beforeEach(() => { sandbox = sinon.sandbox.create(); });
  afterEach(() => { sandbox.restore(); });

  describe('update', () => {
    it('set value into storage', () => {
      const value = 'a,b,c.d:f';
      const locators = value.split(',');
      sandbox.stub(document, 'getElementById').withArgs('custom-locators').returns({ value });

      const { storage: { local } } = chrome;
      const mock = sandbox.mock(local);
      mock.expects('set').once().withArgs({ locators });

      options.update();
      mock.verify();
    });

    it('reset value in storage', () => {
      const value = '';
      const locators = ['for', 'name', 'id', 'title', 'href', 'class'];
      sandbox.stub(document, 'getElementById').withArgs('custom-locators').returns({ value });

      const { storage: { local } } = chrome;
      const mock = sandbox.mock(local);
      mock.expects('set').once().withArgs({ locators });

      options.update();
      mock.verify();
    });
  });
});
