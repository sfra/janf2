'use strict';
const path=require('path');
const INIT_CONFIG = require(process.env.INIT_CONFIG);
const ROOT_PATH = INIT_CONFIG.config.ROOT_PATH;


/**
 * Produces Model
 * @param {object} config configuration object of database connection
 * @param {string} adapter if is not set, takes adapter from config
 * @returns {Model}
 */
let modelFactory = (config, adapter)=>{

    if( adapter === undefined ){
        (adapter = config.adapter);
    }
//    console.log('From modelFactory');
//    console.log(config); 

    try{
        let Inst = require(path.normalize(`${ROOT_PATH}/system/Model/${adapter}`)).DB;
        return new Inst(config);
    } catch( e ){
        console.log(`There is something wrong with ${adapter} model\n`,e);
        return null;
    }
    return null;
};

exports.modelFactory = modelFactory;