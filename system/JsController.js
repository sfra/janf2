let Controller = require(require(process.env.INIT_CONFIG).config.ROOT_PATH + '/system/Controller').Controller;




let APP_HOST = require(process.env.INIT_CONFIG).config.APP_HOST;
/**
 * @class jsCotroller
 * @constructor
 * @inherits Controller.Controller
 */
    class JsController extends Controller {

        constructor(){
            this[this.act]();
        }

 



    //begin actions

    index(){

        /*        let view = new this._View.View('/sview.nhtml', '/config.conf', { "color": "#330033" });
         
         view.getCnf().properties.title = "main page";
         view.getCnf().properties.war = "<p>hello</p>";
         view.parse();
         this.res.end(view.render());
         */
    }


    socketWorker(){
        let view = new this._View.View('/../../system/jsTemplates/socketview.njs', null, { 'APP_HOST': APP_HOST, 'id': this._GET['id'] });
        view.parse();
 

        this.res.setHeader('Content-Type', 'application/javascript');
        this.res.end(view.render());
    }

    //end actions


 

}


exports.JsController = JsController;
