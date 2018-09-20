/* global describe, it */

'use strict';

process.env.INIT_CONFIG = `${__dirname}/../application/config/init.config`;

const Config = require('../system/Config').Config;
const assert = require('assert'),
  path = require('path'),
  generateRandomId = require('../tests/vendor/helpers').generateRandomId,
  deepEqual = require('../tests/vendor/helpers').deepEqual;
const fs = require('fs'),
  config = new Config('../application/views/config/main.conf'),
  Controller = require('../system/Controller').Controller,
  View = require('../system/View').View,
  randomText = generateRandomId(20),
  index = new Controller({
    url: generateRandomId(20)
  }, {}, 'index', 'tested', {}, randomText, 'html');



//      process.exit();

/** give an appropriate path **/

describe('Controller', () => {

  index.setCache(randomText);

  describe('#setCache', () => {

    it('The page should be cashed', () => {
      fs.exists(`../application/cache/${index.hashDigest}`, function (data) {
        assert.equal(data, true);
      });
    });


    it('The original page and cashed one should be equal', () => {

      fs.readFile(`../application/cache/${index.hashDigest}`, 'utf8', (err, data) => {
        assert.equal(data, randomText);
      });
    });
  });

  describe('#getCache', () => {
    it('content should===content', () => {
      assert.equal(index.getCache(30000), randomText);
    });
  });



});



describe('View', () => {
  'use strict';
  let view = new View('/index.nhtml', '/index.conf');

  it('#constructor', () => {
    assert.equal(typeof view.parse, 'function');
  });
  it('#parse', () => {
    console.log(view.parse());
    assert.equal(view.parse().substr(0, 15), '<!doctype html>');
    assert.ok(view.parse().match(`<script src='/require.js' data-main='/main.js'></script>`).index > 0);

  });

  it('#removeUnusedMarkers', () => {
    assert.equal(view.removeUnusedMarkers('abcd@{var0}@efgh@{var1}@ij'), 'abcdefghij');
  });

  it('#getView', () => {
    assert.equal(view.getCnf().properties.css[1].href, '/resources/css/main_lt700.css');
  });

});


describe('Config', () => {

  it('configs should be equal', () => {
    let data = fs.readFileSync('./data/config.json', 'utf8');
    assert.ok(deepEqual(JSON.parse(data), config.properties));

  });

  it('trim', () => {
    assert.ok('Hello world' === Config.trimString('   Hello world '));
  });

  it('subpage menu value', () => {

    assert.equal(config.properties.subpagemenu[3].href, '/subpage/databasesocket');
  });
});









// });
// */
