const fs = require('fs');
/**
 * For a given path, gives content of a file 
 * @param {string} file
 * @returns {string}
 */

const toString = (file) => {
  'use strict';

  let buffConf = {
    buffString: '',
    LENGTH: 1,
    bytesRead: 1,
    pos: 0,
    fdr: fs.openSync(file, 'r')
  };
  let buff = new Buffer(buffConf.LENGTH);


  while ((buffConf.bytesRead = fs.readSync(buffConf.fdr, buff, 0, buffConf.LENGTH, buffConf.pos)) > 0) {
    buffConf.buffString += buff.toString('utf8');
    buffConf.pos += buffConf.bytesRead;

  }



  fs.closeSync(buffConf.fdr);

  return buffConf.buffString;
};

const clone = (org) => {
  'use strict';
  let copy = null;

  if (org instanceof Array) {
    copy = [];

    for (let i = 0, max = org.length; i < max; i++) {
      copy[i] = clone(org[i]);
    }

  } else if (typeof org === 'object') {
    copy = {};

    for (let i in org) {
      if (org.hasOwnProperty(i)) {
        copy[i] = clone(org[i]);
      }
    }

  } else {
    copy = org;
  }

  return copy;

};

const copyProperties = (src, dest) => {
  for (let prop in src) {
    dest[prop] = clone(src[prop]);
  }
}


const switchValues = (arr, key, value, key2, value2, other) => {
  'use strict';
  for (let i = 0, max = arr.length; i < max; i++) {
    if (arr[i][key] === value) {
      arr[i][key2] = value2;
    } else {
      arr[i][key2] = other;
    }

  }


};


const generateRandomId = (nr) => {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_';

  for (let i = 0; i < nr; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;

};

exports.toString = toString;
exports.clone = clone;
exports.copyProperties = copyProperties;
exports.switchValues = switchValues;
exports.generateRandomId = generateRandomId;
