const INIT_CONFIG = require(process.env.INIT_CONFIG),
  fs = require('fs'),
  ROOT_PATH = INIT_CONFIG.config.ROOT_PATH,
  path = require('path'),
  libs = require(`${ROOT_PATH}/system/helpers/libs`);


/**
 * @class Controller
 * @constructor
 * @param {Object} req request
 * @param {Object} res response
 *  @param {Object} appConfig configuration object
 * @param {Object} GET get parameters
 */
class Controller {

  constructor(req, res, act, appConfig, GET) {
    'use strict';
    this._Model = require(`${ROOT_PATH}/system/Model/Model`);
    this._View = require(`${ROOT_PATH}/system/View`);

    this.req = req;
    this.res = res;
    this.contr = __filename.substr(__filename.lastIndexOf('/') + 1);
    this._GET = {};
    this.appConfig = appConfig;
    this.hashDigest = 'diggest';

    if (act === undefined || act === '') {
      this.act = appConfig.config.DEFAULT_ACTION; //"index"
    } else {
      this.act = act;
    }


    this._GET = libs.clone(GET);

  }

  static get crypto() {
    return require('crypto');
  }
  static get libs() {
    require(`${ROOT_PATH }/system/helpers/libs`);
  }
  static get moment() {
    require('moment');
  }

  //   get req() {
  //       return this.req;
  //   }
  //   set req(data) {
  //     //this.req = data;
  //     }

  //     get res(){
  //         return this.res;
  //     }
  //     set res(data){
  //     //  this.res = data;
  //   }





  /** methods **/
  /**
   * Caches the page according to the request url
   * @param{String} data
   */
  setCache(data) {

    let hash = Controller.crypto.createHash('sha1').update(this.req.url);
    this.hashDigest = hash.digest('hex');

    fs.writeFile(path.normalize(`${ROOT_PATH}/application/cache/${this.hashDigest}`), data, function (err) {
      if (err) {
        console.log(err);
      } else {
        //        console.log('The page was cached!');
      }
    });

  }

  /**
   * retrieves the cache only if the cached file is not older than period
   * @param {Number} period time in miliseconds
   * returns {String}
   */
  getCache(period) {

    let hash = Controller.crypto.createHash('sha1').update(this.req.url);
    let out = false;
    let filepath = path.normalize(`${ROOT_PATH}/application/cache/${hash.digest('hex')}`);
    let dateOfMod;
    let dateNow = require('moment').utc().valueOf();
    //` console.log(filepath);
    try {

      dateOfMod = require('moment').utc(fs.statSync(filepath).mtime).valueOf();


      if (dateNow - dateOfMod < period) {
        out = libs.toString(filepath);
      }

      return out;

    } catch (e) {
      console.log('Error');
      console.log(e);
      return out;
    }



  }

  /**
   * gets the content of the page written in the file with chtml extension, located in application/contents folder
   * @param {String} a name if the file. If is undefined then the name controllerName.actionName.chtml is used
   * @returns {String} Content of the file
   */
  getContent(file) {

    if (file === undefined) {
      return libs.toString(`${ROOT_PATH}/application/contents/${this.contr}.${this.act}.chtml`);

    }
    return libs.toString(`${ROOT_PATH}/application/contents${file}`);
  }


  beginSession(res, appConfig) {}





}


exports.Controller = Controller;
