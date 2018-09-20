'use strict';

const INIT_CONFIG = require(process.env.INIT_CONFIG);
const ROOT_PATH = INIT_CONFIG.config.ROOT_PATH;
const simpleExtend = require('../helpers/simpleExtend').simpleExtend;
const copyProperties = require('../helpers/libs').copyProperties;
/**
 * @class Model
 * @constructor
 */
class  Model {
    constructor(config) {

        this.config = {};
        
        copyProperties(config,this.config); 


    let events = require('events');
    this.emm = new events.EventEmitter();

    this.row = [ ];
    }

}


exports.Model = Model;
