const INIT_CONFIG = require(process.env.INIT_CONFIG);
const ROOT_PATH = INIT_CONFIG.config.ROOT_PATH;
const clone = require(`${ROOT_PATH}/system/helpers/libs`).clone;

/**
 * 
 * @returns {void}
 */
const simpleExtend = function (ob) {
    'use strict';
  let args = Array.prototype.slice.call(arguments);


  let max = args.length - 1;

 let getInst = function (o) {
    return o;
  };

  if (typeof args[max] === 'boolean') {

    if (args[max] === true) {
      getInst = clone;
    }

    max -= 1;
  }


  for (let obj = 1; obj < max + 1; obj++) {

    for (let prop in args[obj]) {

      if (args[obj].hasOwnProperty(prop.toString())) {
        ob[prop] = getInst(args[obj][prop]);
      }
    }

  }


};

exports.simpleExtend = simpleExtend;