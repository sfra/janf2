let CONFIG = require(process.env.INIT_CONFIG).config;
let Controller = require(CONFIG.ROOT_PATH + '/system/Controller').Controller;
let APP_HOST = CONFIG.APP_HOST;
let ROOT_PATH = CONFIG.ROOT_PATH;
let libs = require(ROOT_PATH + '/system/helpers/libs');
let upload = require(`${ROOT_PATH}/system/helpers/upload`);
let modelFactory = require(`${ROOT_PATH}/system/Model/modelFactory`).modelFactory;


/**
 * @class index
 * @constructor
 * @inherits Controller
 */
class databases extends Controller {


  constructor(req, res, act, appConfig, GET) {


    super(req, res, act, appConfig, GET);

    this.view = new this._View.View('/additional.nhtml', '/index.conf');



    this[this.act]();

  }

  //begin actions
  mysql() {
    const view = new this._View.View('/databases.nhtml', '/index.conf'), contentView = new this._View.View('/mysql.nhtml');


    view.getCnf().properties.database = 'MySql';
    // console.log(this.appConfig);
    const queryView = new this._View.View('/results.nhtml');
    let db = modelFactory(this.appConfig.DBConfig, 'Mysql');
    
    db =db.from('clients').where('name = ? AND id > ?', [
      ['John', '[A-Za-z]+'],
      ['2', '[0-9]+']
    ]);

    db.exec();



    db.emm.on('dbOK', () => {

      queryView.getCnf().properties.results = db.row;


      view.getCnf().properties.content = contentView.parse();
      view.getCnf().properties.result = queryView.parse();

      this.res.end(view.parse());


    });

    db.emm.on('dberror', (e) => {
      view.getCnf().properties.result = `Something wrong with connection happened.<br />.
            Error: ${e}`;

      this.res.end(view.parse());

    });


    view.getCnf().properties.css.push({
      href: 'resources/css/main.additional.css',
      rest: ''
    });




  }


  postgresql() {
    const view = new this._View.View('/databases.nhtml', '/index.conf');
    view.getCnf().properties.database = 'Postgresql';
    view.getCnf().properties.content = 'This page contains the results from Postgresql database';

    let queryView = new this._View.View('/results.nhtml');
    let db = modelFactory(this.appConfig.DBConfig, 'Postgresql');
    db.query('SELECT * FROM shops');
    db.exec();

    db.emm.on('dbOK', () => {
      queryView.getCnf().properties.results = db.row;
      view.getCnf().properties.result = queryView.parse();
      this.res.end(view.parse());

    });

    db.emm.on('dberror', (e) => {
      view.getCnf().properties.result = `Something wrong with connection happened.<br />.
                Error: ${e}`;

      this.res.end(view.parse());

    });


    view.getCnf().properties.css.push({
      href: 'resources/css/main.additional.css',
      rest: ''
    })




  }

  mongodb() {
    let view = new this._View.View('/databases.nhtml', '/index.conf');
    view.getCnf().properties.database = 'MongoDb';
    let queryView = new this._View.View('/resultsMongo.nhtml');
    let db = modelFactory(this.appConfig.DBConfig, 'Mongodb');

    view.getCnf().properties.database ='Mongodb';
    db.select({country: 'Germany'}).from('cars').projection({_id:1, model:1,year:1});
    
 
    db.exec();

    db.emm.on('dbOK',()=>{
      queryView.getCnf().properties.results=db.row;
      console.log('db.row');
      console.log(db.row);
      view.getCnf().properties.content='Results from mongo';
      view.getCnf().properties.result = queryView.parse();
      this.res.end(view.parse());
    });


  }







}



//end actions


//execute action






exports.databases = databases;
