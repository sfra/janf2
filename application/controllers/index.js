
let CONFIG = require(process.env.INIT_CONFIG).config;
let Controller = require(`${CONFIG.ROOT_PATH}/system/Controller`).Controller;


/**
 * @class index
 * @constructor
 * @inherits Controller
 */
class index extends Controller {

  constructor(req, res, act, appConfig, GET) {

    super(req, res, act, appConfig, GET);

    this.view = new this._View.View('/index.nhtml', '/index.conf');

    this[this.act]();

  }

  //begin actions

  index() {
    let content = this.getCache(30000);
    if (content) {
      this.res.end(content);
    } else {
      let view = new this._View.View('/index.nhtml', '/index.conf');

      content = view.parse();
      this.setCache(content);
      this.res.end(content);


    }
  }

  //end actions





}



exports.index = index;
