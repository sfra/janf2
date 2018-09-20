'use strict';

requirejs.config({
  baseUrl: '',

  paths: {
    'switchPage': ['/modules/switchPage'],
    'scroll': ['/modules/scroll'],
    '__ajax': ['/vendor/__ajax.require.module'],
    'index': ['/index']

  }


});

requirejs.onError = function (err) {
  console.log(err.requireType);
  console.log('modules: ' + err.requireModules);
  throw err;
};



require(['index', 'switchPage'], function (index, switchPage) {
  console.dir(switchPage);


});
