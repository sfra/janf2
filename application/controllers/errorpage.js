let CONFIG = require(process.env.INIT_CONFIG).config;
let Controller = require(CONFIG.ROOT_PATH + '/system/Controller').Controller;
let APP_HOST = CONFIG.APP_HOST;
let ROOT_PATH = CONFIG.ROOT_PATH;
let libs = require(ROOT_PATH + '/system/helpers/libs');
let upload = require(`${ROOT_PATH}/system/helpers/upload`);


/**
 * @class index
 * @constructor
 * @inherits Controller
 */
class errorpage extends Controller {

  constructor(req, res, contr, act, GET, initData, mimetype) {
    
    super(req, res, contr, act, GET, initData, mimetype);

    this.view = new this._View.View('/additional.nhtml', '/index.conf');

    

    this[this.act]();

  }

  //begin actions

  index() {
    let view = new this._View.View('/errorpage.nhtml','/index.conf');

    view.getCnf().properties.css.push({href:'resources/css/main.additional.css', rest: ''});
    view.getCnf().properties.content ='Sorry, this page does not exists';

    this.res.end(view.parse());


    }


  

}
  
  //end actions


  //execute action






exports.errorpage = errorpage;