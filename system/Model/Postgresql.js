let ROOT_PATH = require(process.env.INIT_CONFIG).config.ROOT_PATH;
let Sql = require(ROOT_PATH + '/system/Model/Sql').Sql;

/**
 * @class Postgresql
 * @inherits Model
 * @constructor
 */
class Postgresql extends Sql {

  constructor(config) {
    super(config);
    let Client = require('pg').Client;


    this.client = new Client({
      user: this.config.username,
      host: this.config.host,
      database: this.config.database,
      password: this.config.password,
      port: 5432,
    });
    this.client.connect();
  
  
  }

   query(text){
    this.client.query(text, (err, result) => {
      if (err) {
        this.emm.emit('dberror');
      } else {
        this.row = result.rows;
        this.emm.emit('dbOK');
        this.client.end();

      }
    });

  }

}

exports.DB = Postgresql;