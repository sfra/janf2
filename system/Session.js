'use strict';
const fs = require('fs'),
  mysql = require('mysql'),
  clone = require('./helpers/libs').clone;

class Session {
  constructor(save, config = {}) {
    this.method = save.method;
    switch (this.method) {
      case 'file':
        this.handler = this.operateFile;
        this.socket = save.filename;
        break;
      case 'mysql':
        this.handler = this.operateMysql;
        this.socket = mysql.createConnection({
          host: save.config.host,
          user: save.config.user,
          password: save.config.password,
          database: save.config.database
        });
        break;
      default:
        break;
    }
  }

  operateFile(operation, matter) {
    switch (operation) {
      case append:
        fs.readFile(data.filepath, 'utf8', (err, matter) => {
          if (err) {
            console.error('[Error]');
            console.error(e);
            return;
          }


        });
        break;

      default:
        break;
    }

  }

  operateMysql(operation) {

  }
}
