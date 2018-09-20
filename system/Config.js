//console.log(process.env.INIT_CONFIG);

let INIT_CONFIG = require(process.env.INIT_CONFIG);



let ROOT_PATH = INIT_CONFIG.config.ROOT_PATH;
let http = require('http'),
  qs = require('querystring'),
  libs = require(`${ROOT_PATH}/system/helpers/libs`);


/**
 * @class Config
 * @constructor
 * @param {String} config file name
 */
class Config {

  constructor(file) {
    this.properties = {};


    if (!file) {
      return this; //code
    }

    let confArray = [];


    let data = libs.toString(file);


    /* remove comments*/
    data = data.replace(/(.*)\;.*\n/g, function (match, g1, offset, s) {

      let rest = '';
      if (match.charAt(0) !== ';') {
        let rest = '\n';
      }
      return g1 + rest;
    });

    /* insert content of imported files*/
    data = data.replace(/@IMPORT\(\'([A-Za-z\/\.]+)\'\)/g, function (match, gr1, index, original) {

      return Config.trimString(libs.toString(`${ROOT_PATH}/application/views/config/${gr1}`)) + "\n";

    });


    confArray = data.split('\n');

    let confOneLinePerItem = [];
    let itemUpToEq;

    for (let k = 0, j = -1; k < confArray.length; k++) {

      itemUpToEq = confArray[k].match(/^([A-Z]|[a-z]|\-)+\=/);

      if (!itemUpToEq) {
        confOneLinePerItem[j] += Config.trimString(confArray[k]);
      } else {
        j += 1;
        confOneLinePerItem[j] = Config.trimString(confArray[k]);

      }

    }



    for (let i = 0; i < confOneLinePerItem.length; i++) {



      let eqSign = confOneLinePerItem[i].indexOf("=");
      let property = confOneLinePerItem[i].substr(0, eqSign);
      let value = confOneLinePerItem[i].substr(eqSign + 1);
      let valueString = String(value);

      if (valueString.charAt(0) === "[") {
        try {
          this.properties[property] = JSON.parse(value);

        } catch (e) {
          console.log(e);
        }
        continue;
      }

      if (property === '' || value === undefined) {
        break;
      }

      this.properties[property] = value;
    }

  }






  /**
   * removes white spaces from the beginning and the end of the string
   * @param{string} s
   * @returns{string}
   */
  static trimString(s) {
    return s.replace(/^\s+|\s+$/g, "");
    // return s.replace(/^\s+/g, '').replace(/\s$/g,'');
  }



};


exports.Config = Config;
