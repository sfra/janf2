'use strict';
const assert = require('assert'),
  path = require('path'),
  fs = require('fs'),
  ModelGeneral = require('../system/Model/Model.General').ModelGeneral,
  modelFactory = require('../system/Model/modelFactory').modelFactory,
  Sql = require('../system/Model/Sql').Sql,
  Nosql = require('../system/Model/Nosql').Nosql,
  Mongodb = require('../system/Model/Mongodb').Mongodb,
  Route = require('../system/routing/Route').Route,
  deepEqual = require('../tests/vendor/helpers').deepEqual;



describe('#Route', () => {
  let route = new Route();

  it('create a propper rule', () => {
    assert.ok(route.addRule('/blog/dishes/{soups}/{nationality}', 3, 'dishes'));

  });

  it('create fake rule', () => {
    assert.equal(route.addRule('/blog/dishes/{soups}/{nat{ionality}'), false);

  });
  it('apply propper rule', () => {
    route.addRule('/blog/{user}/panel/', 0, 'test2');

    assert.equal(route.applyRules('/blog/john/panel/').reqVariables.user, 'john');


  });

});
