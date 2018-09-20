'use strict';

let ROOT_PATH = require(process.env.INIT_CONFIG).config.ROOT_PATH;
let Sql = require(ROOT_PATH + '/system/Model/Sql').Sql;
let mySql = require('mysql');
/**
 * @class Mysql
 * @inherits Model
 * @constructor
 */
class Mysql extends Sql {
  constructor(config) {
    super(config);


    this.connection = mySql.createConnection({
      host: this.config.host,
      user: this.config.username,
      password: this.config.password,
      database: this.config.database
    });
  }
  query(text) {
    this.connection.query('USE ' + this.config.database,
      (err, row, fields) => {
        if (err) {
          this.emm.emit('dberror');
        } else {

          this.emm.emit('OK');
        }
      });


    let proc = this.connection.query(text, (err, row) => {
      if (err) {
        this.emm.emit('dberror');
        console.log(err);
      } else {
        this.row = row;
        this.emm.emit('dbOK');
      }
    });
    this.connection.end();
    return proc;

  }


}


exports.DB = Mysql;
