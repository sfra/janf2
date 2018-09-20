let INIT_CONFIG = require(process.env.INIT_CONFIG);
let ROOT_PATH = INIT_CONFIG.config.ROOT_PATH;
let helper=null;




class Htmlhelper{

    constructor(){

        if( !(this instanceof Htmlhelper) ){
            return new Htmlhelper(arguments);
        }

    
        this.fun = arguments[0][0];
        helper = require(`${ROOT_PATH}/application/helpers/${arguments[0][0]}`);
    
        let argWithoutFirst = [ ];
        let argNo = 0;
    
        while( true ){
            if( arguments[0][argNo + 1] === undefined ){
                break;
            }
            argWithoutFirst[argNo] = arguments[0][argNo + 1];
            argNo += 1;
        }
    }





    getHelperValue(){
        return helper[this.fun].apply(helper[this.fun], argWithoutFirst);
    }
}


exports.Htmlhelper = Htmlhelper;