'use strict';
const path = require('path'),
  http = require('http'),
  https = require('https'),
  fs = require('fs'),
  INIT_CONFIG_FILE = path.normalize(`${__dirname}/application/config/init.config.js`),
  INIT_CONFIG = require(INIT_CONFIG_FILE),
  indexConfig = INIT_CONFIG.indexConfig,
  argv = process.argv,
  Route = require('./system/routing/Route').Route,
  copyProperties = require('./system/helpers/libs').copyProperties,
  optionsSSL = {
    key: null,
    cert: null
  };

process.env.INIT_CONFIG = INIT_CONFIG_FILE;







let protocol, port = INIT_CONFIG.config.APP_PORT,
  host = INIT_CONFIG.config.APP_HOST,
  currentController, argum = {},
  server, configJSON, appConfig = {};




copyProperties(INIT_CONFIG, appConfig);


if (argv[2] === '-help' || argv[2] === '--help' || argv[2] === 'help') {
  console.log(
    `USAGE node index.js [options]
    
    Options:
          -protocol             protocol of the server http or https (default [http])
          -port                 number of port (default 1339)
          -host                 default localhost
          -help, --help, help   this help
          -config               path to the config json file
    
    Example:
    node index.js protocol https port 8080

    then server will be listen on the url https://localhost:8080
          `);
  process.exit(0);
}


for (let i = 2, max = argv.length; i < max; i += 2) {
  console.log(argv[i]);
  if (argv[i].substr(0, 1) === '-') {
    argum[argv[i].substr(1)] = argv[i + 1];
  }
}

if (typeof argum.protocol === 'undefined') {
  protocol = 'http';
} else {
  protocol = argum.protocol;
}

if (typeof argum.port !== 'undefined') {
  port = parseInt(argum.port, 10);
}
if (typeof argum.host !== 'undefined') {
  host = argum.host;
}


if (argum.protocol === 'https') {
  server = https.createServer(optionsSSL, (req, res) => {
    serverCallback(req, res);
  });
} else {
  server = http.createServer((req, res) => {
    serverCallback(req, res);
  });
}


if (typeof argum.config !== 'undefined') {
  configJSON = JSON.parse(fs.readFileSync(argum.config));
  copyProperties(configJSON, appConfig);
}

fs.readFile(appConfig.ssl.key, 'utf8', (err, data) => {
  if (err) {
    console.log(err);
    return;
  }

  optionsSSL.key = data;
});

fs.readFile(appConfig.ssl.cert, 'utf8', (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  optionsSSL.cert = data;

});




const route = new Route();
if (appConfig.config.ROUTING.status) {
  route.addConfig(appConfig.config.ROUTING.file);
  //  setTimeout(()=>{console.log(route)},2000);

} else {
  route.applyRules = (url) => {
    return url;
  };
}



let serverCallback = (req, res) => {

  let url = null,
    currentControllerFile = null;
  const GET = {},
    POST = {},
    fileexten = (function () {

      const lastDot = req.url.lastIndexOf('.');
      return [lastDot > -1 ? true : false,
        req.url.substr(lastDot + 1)
      ];

    })();

  req.on('data', (data) => {
    //    console.log(data.toString('utf8'));
    let params = data.toString('utf8');

    let paramsArray = params.split('&');
    console.log('paramsArray');
    console.log(paramsArray);
    for (let i = 0, max = paramsArray.length; i < max; i++) {
      POST[paramsArray[i].split('=')[0]] = paramsArray[i].split('=')[1];
    }
    console.log('POST');
    console.log(POST);
  });



  (() => {
    /* parse traditional get request */
    let lastIndex = req.url.indexOf('?'),
      get = '';

    if (lastIndex < 0) {
      url = req.url;
    } else {
      url = req.url.substring(0, lastIndex);
      get = req.url.substr(lastIndex + 1).split('&');
      let arg = null,
        val = null;
      for (let i = 0, max = get.length; i < max; i++) {
        arg = get[i].split('=')[0];
        val = get[i].split('=')[1];
        GET[arg] = val;
      }
    }
  })();

  let routing = route.applyRules(url);
  (() => {
    /**routing  */

    if (!routing) {
      return;
    }

    if (typeof routing.reqVariables === 'undefined') {
      return;
    }

    for (let v in routing.reqVariables) {
      if (v !== 'controller' && v !== 'action') {
        GET[v] = routing.reqVariables[v];
      }
    }
    /** currentControllerFile  */
    currentControllerFile = require(`${__dirname}/application/controllers/${routing.reqVariables.controller}`);

    currentController = new currentControllerFile[routing.reqVariables.controller](req, res, routing.reqVariables.action || appConfig.config.DEFAULT_ACTION, appConfig, GET);

  })();

  if (routing) {
    return;
  }

  (() => {
    if (indexConfig.extToRequest[fileexten[1]] !== undefined) {

      res.setHeader('Content-Type', indexConfig.extToRequest[fileexten[1]]['Content-Type']);
    }
    if (url === '/' || url === '/index.html') {
      let dc = `${__dirname}/application/controllers/${INIT_CONFIG.config.DEFAULT_CONTROLLER}`;
      currentControllerFile = require(`${__dirname}/application/controllers/index`);

      currentController = new currentControllerFile[INIT_CONFIG.config.DEFAULT_CONTROLLER](req, res, appConfig.config.DEFAULT_ACTION, appConfig, GET);
    } else if (fileexten[0] && url.search('__system__') < 0) {


      try {
        res.writeHead('200', indexConfig.extToRequest[fileexten[1]]['Content-Type']);
      } catch (e) {
        if (e.message.match('Cannot read property \'.*\' of undefined')) {
          currentControllerFile = require(`${__dirname}/application/controllers/errorpage.js`);
          currentController = new currentControllerFile.errorpage(req, res, appConfig.config.DEFAULT_ACTION, appConfig, GET);
        }
      }

      try {

        res.end(fs.readFileSync(__dirname + indexConfig.extToRequest[fileexten[1]].addUrl + url));
        //      console.log(__dirname + indexConfig.extToRequest[fileexten[1]].addUrl + url);
      } catch (e) {
        res.end('/* empty k resource */');
      }


    } else {

      let urlArray = url.split('/');

      urlArray.shift();
      let [contr, act] = [urlArray.shift(), urlArray.shift()];

      /*release*/

      try {

        if (contr === '__system__') {

          currentControllerFile = require(`${__dirname}/system/JsController.js`);
          console.log('action:', act);
          currentController = new currentControllerFile.JsController(req, res, act.split('.')[0], appConfig, urlArray);

        } else if (contr !== undefined) {

          currentControllerFile = require(`${__dirname}/application/controllers/${contr}.js`);
          currentController = new currentControllerFile[contr](req, res, act, appConfig, GET);

        } else {

          currentControllerFile = require(`${__dirname}/application/controllers/${INIT_CONFIG.config.DEFAULT_CONTROLLER}.js`);
          currentController = new currentControllerFile[INIT_CONFIG.config.DEFAULT_CONTROLLER](req, res, appConfig.config.DEFAULT_ACTION, appConfig, GET);

        }
      } catch (e) {

        currentControllerFile = require(`${__dirname}/application/controllers/errorpage.js`);
        currentController = new currentControllerFile.errorpage(req, res, 'index', appConfig, GET);
        console.log('=====');
        console.log(contr, act);
        console.log(e);
        console.log('-----');
      }
    }
  })();


};

server.listen(port, host);
console.log(`Server running at ${protocol}://${host}:${port}/`);
