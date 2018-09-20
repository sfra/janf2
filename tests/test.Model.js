const assert = require('assert'), path = require('path'), fs=require('fs'), ModelGeneral = require('../system/Model/Model.General').ModelGeneral,
modelFactory = require('../system/Model/modelFactory').modelFactory,
Sql = require('../system/Model/Sql').Sql,
Nosql = require('../system/Model/Nosql').Nosql,
Mongodb=require('../system/Model/Mongodb').Mongodb,
Route = require('../system/routing/Route').Route,
deepEqual = require('../tests/vendor/helpers').deepEqual;

describe('Model.General', () => {
    'use strict';
    let model = new ModelGeneral('fake');
  
    model.create([
      ['id', 'number'],
      ['name', 'string'],
      ['surname', 'string'],
      ['age', 'number']
    ], 'id');
  
    model.addRow({
      'id': 1,
      'name': 'Jan',
      'surname': 'Kowalski',
      'age': 20
    });
    model.addRow({
      'id': 2,
      'name': 'Kate',
      'surname': 'Nowak',
      'age': 45
    });
    model.addRow({
      'id': 3,
      'name': 'Jane',
      'surname': 'Fonda',
      'age': 80
    });
  
    it('validation', () => {
      assert.ok(model.validate({
        'id': 3,
        'name': 'Kate',
        'surname': 'Nowak'
      }));
    });
  
  
    it('get validation', () => {
      assert.equal(model.getName(), 'fake');
      assert.equal(model.getTableFields().surname, 'string');
      assert.equal(model.getTable()[1].age, 45);
  
    });
  
    it('crud tests', () => {
      assert.equal(model.find(2).name, 'Kate');
  
      assert.equal(model.parseFilter('!0>Adam')[5], 'Adam');
  
      assert.equal(model.filter({
        'age': '>22'
      }).length, 2);
  
  
      assert.ok(deepEqual({
        id: 'number',
        name: 'string',
        surname: 'string',
        age: 'number'
      }, model.buildModelGeneral('kopia').getTableFields()));
  
  
  
  
    });
  
  });
  
  
  describe('#Sql', () => {
    'use strict';
  
    let sql = new Sql({});
    it('#query', () => {
  
      sql.select('programmers').from('Microsoft').join('office', 'programmers.id', 'office.id').where(`office.city="Redmond"`);
      assert.equal(sql.getQuery(), 'SELECT programmers FROM Microsoft JOIN office ON programmers.id=office.office.id WHERE office.city="Redmond"');
  
    });
  });
  
  describe('#Nosql',()=>{
    let db = new Nosql();
    it('create a scheme',()=>{
      db.setDb('yanf2').from('cars').select({'year':{$gt: 2000}}).select({country: 'Germany'}).projection({model:1},{country: 1});
  
      assert.ok(
        deepEqual(db.queryScheme.find,
          [{year:{$gt: 2000}},{country: 'Germany'}])
          );
  });
  
  });
  
  
  describe('modelFactory', () => {
    'use strict';
    let DBConfig = JSON.parse(fs.readFileSync('../../config.json')).DBConfig;
  
    it('fetch data from database', () => {
  
      let db = modelFactory(DBConfig, 'Mysql');
  
  
      db.select('name, city').from('clients').where('name = ? AND id > ?', [
        ['John', '[A-Za-z]+'],
        ['2', '[0-9]+']
      ]);
  
      db.exec();
  
  
      db.emm.on('dbOK', () => {
        console.log('EXEC');
        assert.ok(deepEqual(db.row[0], {
          name: 'John',
          city: 'Los Angeles'
        }));
  
      });
  
      db.emm.on('dberror', (e) => {
        console.log(e);
  
  
      });
  
    });
  
  });
  
  describe('#Mongodb',()=>{
    it('make a query',()=>{
  
    });
  
  });


