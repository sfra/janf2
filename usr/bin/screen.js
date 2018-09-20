'use strict';
const colors = require('colors/safe');
exports.print = (text,file)=>{
    console.log('[file: ',colors.red(file));
    console.dir(text);
    console.log('file]');
};