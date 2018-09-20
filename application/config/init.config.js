const config = { ROOT_PATH: `${__dirname}/../../`,
    VIEWS_PATH: `${__dirname}/../../application/views`,
    VIEWS_CONFIGS_PATH: `${__dirname}/../../application/views/config`,
    APP_HOST: '127.0.0.1',
    APP_PORT: 1339,
    DEFAULT_CONTROLLER : 'index',
    DEFAULT_ACTION : 'index',
    ROUTING: {
        status: true,
        file: `${__dirname}/routing.json`
    }    
};



const indexConfig = {
    extToRequest: {
        'css':
                { 'Content-Type': 'text/css', 'addUrl': '/application', 'ifempty': '/* empty resource */' },
        'ico':
                { 'Content-Type': 'image/x-icon', 'addUrl': '/application/resources/images', 'ifempty': '/* empty resource */' },
        'jpg':
                { 'Content-Type': 'image/jpeg', 'addUrl': '/application/resources/images', 'ifempty': '/* empty resource */' },
        'gif':
                { 'Content-Type': 'image/gif', 'addUrl': '/application/resources/images', 'ifempty': '/* empty resource */' },
        'js':
            { 'Content-Type': 'application/javascript', 'addUrl': '/application/resources/js', 'ifempty': '/* empty resource */' },
        'png' :
                { 'Content-Type': 'image/png', 'addUrl': '/application/resources/images', 'ifempty': '/* empty png*/' },
        'html' : { 'Content-Type': 'text/html', 'addUrl': '/application/resources/html', 'ifempty': '/* empty html*/'}

    }

};



const DBConfig = {
    //   adapter:'mysql',
    // host: 'localhost',
    // username: 'username', /* Put here */
    // password: 'secretphrae', /* proper  */
    // database: 'janf2'    /*  data    */
};


exports.config = config;
exports.indexConfig = indexConfig;
exports.DBConfig = DBConfig;

