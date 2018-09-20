let INIT_CONFIG = require(process.env.INIT_CONFIG).config;

let ROOT_PATH = INIT_CONFIG.ROOT_PATH;
let VIEWS_PATH = INIT_CONFIG.VIEWS_PATH;
let VIEWS_CONFIGS_PATH = INIT_CONFIG.VIEWS_CONFIGS_PATH;
let fs = require('fs'),
  Config = require(ROOT_PATH + '/system/Config').Config;
let libFile = require(ROOT_PATH + '/system/helpers/libs');
let Htmlhelper = require(`${ROOT_PATH}/system/Htmlhelper`);
let COMMON_PROPERTIES = require(`${ROOT_PATH}/application/views/common/properties`).properties;
const simpleExtend = require('./helpers/simpleExtend').simpleExtend;
const assert = require('assert');
/**
 * @class View
 * @constructor
 * @param {String} view file name
 * @param {String} config file name
 * @param {Array} additional configuration properties
 */



class View {

  constructor(vw, conf) {

    let data;
    let cnf = {
      'properties': COMMON_PROPERTIES
    };

    try {
      fs.lstatSync(vw);
    } catch (e) {
      vw = VIEWS_PATH + vw;
    }

    try {
      fs.lstatSync(conf);
    } catch (e) {

      if (conf !== undefined) {

        conf = VIEWS_CONFIGS_PATH + conf;
      }

    }


    simpleExtend(cnf.properties,(new Config(conf)).properties);
    

    data = libFile.toString(vw);

    /**
     * Replaces fields from data by appropriate properties from cnf file
     * @method parse
     * @return {string}
     */
    this.parse = () => {


      for (let prop in cnf.properties) {
        let curr = cnf.properties[prop];

        if (typeof curr === 'object') {

          while (true) {

            let beg = data.indexOf(`[[${prop}`);

            if (beg === -1) {
              break;
            }

            let ed = data.indexOf(`${prop}]]`);

            let piece = data.substring(beg + 2 + prop.length, ed); //piece for replacement
            let pieceOut = '';
            let index = 0; // start of the iteration on current object



            for (let pprop in curr) {
              if (index === curr.length){
                break; // stop replacement if the end of the object is reached
              }
                
              pieceOut += `\n${piece}`;

              for (let subprop in curr[pprop]) {
              
                pieceOut = pieceOut.replace(`{${subprop}}`, curr[pprop][subprop]);
                
              }

              index += 1;


              pieceOut = this.replaceConditionals(pieceOut, curr, pprop, index);


            }

            data = data.slice(0, beg) + pieceOut + data.slice(ed + 2 + prop.length, data.length);

          }
        } else {

          while (data.indexOf(`@{${prop}}@`) > -1) {
            data = data.replace(`@{${prop}}@`, cnf.properties[prop]);
          }

        }

      }
      //console.log(data);

      data = this.replaceHTMLhelper(data);
      data = this.removeUnusedMarkers(data);

      return data;

    };
    
    //end parse
    
    this.getCnf = function () {
      return cnf;
    };
    
    this.setCnf = function (_cnf) {
      cnf= libFile.clone(_cnf);
    };
    
    this.render = function () {
      return data;
    };
  }
  //end of the constuctor

  /* methods */

  execute() {


  }

  /* checks if there exists any conditional and execute it */
  replaceConditionals(text, curr, pprop, index) {

    return text.replace(/\@\{\s*if\s(\!?[A-Za-z0-9]*)\s(\S*)\s([A-Za-z0-9#]*)\s?\{(.*)\}\s*\}@/g,
      (match, left, rel, right, body, offset, s) => {
        assert.equal(index,index);
        assert.equal(rel,rel);
        assert.equal(right,right);
        assert.equal(body,body);
        assert.equal(offset,offset);
        assert.equal(s,s);
        let value;

        if (curr[pprop][left.replace('!', '')]) {
          value = curr[pprop][left.replace('!', '')];
        }

        //            console.log('[[[[[[[[[]]]]]]]]]');
        //            console.log(curr);    
        //            console.log(rel);
        //                console.log(match,left, rel, right, body, index, value);
        //                return this.execute[rel](left, rel, right, body, index, value);
        return '';
      });

  }




  replaceHTMLhelper(data) {

    return data.replace(/@\{HTMLhelper\s([A-Za-z]*)\((.*)\)\}@/g, function (match, hlp, arg) {

      let argArray = '';
      try {
        argArray = JSON.parse(arg);
        argArray = [argArray];
      } catch (e) {
        console.log('================');

        console.log(e);

        argArray = arg.split(',');
      }


      let hp = Htmlhelper.Htmlhelper.apply(Htmlhelper.Htmlhelper, [hlp].concat(argArray));
      return hp.getHelperValue();

    });

  }



  removeUnusedMarkers(text) {
    return text.replace(/@\{[^\{]*\}@/g,'');
    //return text.replace(/\[\[[^\[]*\]\]/g, '<!-- removed -->').replace(/@\{[^@]*\}@/g, '<!-- removed -->');
  }

  




}















exports.View = View;
