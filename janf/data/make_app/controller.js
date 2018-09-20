let ROOT_PATH=require(process.env.INIT_CONFIG).config.ROOT_PATH;
let Controller = require(ROOT_PATH + '/system/Controller').Controller;
let libs=require(ROOT_PATH+"/system/helpers/libs");

/**
 * @class %CONTROLLER%
 * @constructor
 * @inherits Controller.Controller
 */
    class %CONTROLLER% extends Controller {

        constructor(){
            this[this.act]();
        }

/*initial values*/
       

    //begin actions

    index(){
    }




    //end actions


    //execute action


}

%CONTROLLER%.prototype=Controller.Controller.prototype;
exports.%CONTROLLER% = %CONTROLLER%;