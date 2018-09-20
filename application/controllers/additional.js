let CONFIG = require(process.env.INIT_CONFIG).config;
let Controller = require(CONFIG.ROOT_PATH + '/system/Controller').Controller;
let APP_URL = CONFIG.APP_URL;
let ROOT_PATH = CONFIG.ROOT_PATH;
let libs = require(ROOT_PATH + '/system/helpers/libs');
let upload = require(`${ROOT_PATH}/system/helpers/upload`);


/**
 * @class index
 * @constructor
 * @inherits Controller
 */
class additional extends Controller {

  constructor(req, res, act, appConfig, GET) {

    super(req, res, act, appConfig, GET);

    this.view = new this._View.View('/additional.nhtml', '/index.conf');




    this[this.act]();
  }


  index() {
    //begin actions
    let view = new this._View.View('/additional.nhtml', '/index.conf');
    //    console.log(view.getCnf().properties.js);
    view.getCnf().properties.js = `<script>sessionStorage.setItem('current','database');</script>` + view.getCnf().properties.js;
    view.getCnf().properties.css.push({
      href: '/resources/css/main.additional.css',
      rest: ''
    });


    this.res.end(view.parse());


  }

  get() {

    let view = new this._View.View('/additional.nhtml', '/index.conf');
    view.getCnf().properties.css.push({
      href: '/resources/css/main.additional.css',
      rest: ''

    });
    view.getCnf().properties.js = `<script>sessionStorage.setItem('current','get');</script>` + view.getCnf().properties.js;
    let viewGet = new this._View.View('/get.nhtml');

    viewGet.getCnf().properties.x = this._GET['x'];
    viewGet.getCnf().properties.y = this._GET['y'];
    view.getCnf().properties.content = viewGet.parse();




    this.res.end(view.parse());

  }

  upload() {


    let view = new this._View.View('/upload.nhtml', '/uploads.conf');
    view.getCnf().properties.content = `janf handles uploading files also<br />
      <form action="uploadHandler" enctype="multipart/form-data" method="post">
          <input type="file" id="photo" name="photo" />
          <input type="submit" value="save file" name="submit" />
      </form>`;



    this.res.end(view.parse());

  }

  uploadHandler() {

    let view = new this._View.View('/upload.nhtml', '/uploads.conf');

    upload.image(this.req, this.res, `${ROOT_PATH}/application/uploads/`, (dest) => {

      view.getCnf().properties.content = `The file has been uploaded to <br /><pre>${dest}</pre>
              <a href="/additional/upload">Let' us upload next file</a>`;

      this.res.end(view.parse());

    });

  }

}

//end actions


//execute action






exports.additional = additional;
