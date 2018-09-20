'use strict';
const fs = require('fs'),
  namedRegExp = require('named-regexp-groups');
let rules;

class Route {
  constructor(rules = []) {
    this.rules = rules;
  }

  /**
   * get one rule
   * @param {String} rule
   * @param {String} the name of the rule
   * returns {Boolean} is true whenever rule is correct and false otherwise 
   ***/

  addConfig(file) {
    fs.readFile(file, 'utf8', (err, data) => {
      let dataJSON = JSON.parse(data);
      for (let i = 0, max = dataJSON.length; i < max; i++) {
        this.addRule(dataJSON[i].rule, dataJSON[i].priority,
          dataJSON[i].name);
      }
    });
  }


  addRule(rule, priority = 0, name = 'unnamed') {
    let inside = false;
    for (let i = 0, max = rule.length; i < max; i++) {
      if (inside) {
        if (rule[i] === '{') {
          return false; /* parentheses are nested */
        }

        if (rule[i] === '}') {
          inside = false;
        }
      }

      if (!inside) {
        if (rule[i] === '{') {
          inside = true;
        }
      }
    }

    if (inside) {
      return false;
    }

    this.rules.push({
      rule,
      priority
    });
    return true;
  }

  /**
   * apply the rule to the url
   * @param {String} rule
   * @param {String} url
   * returns {Object} consisting of string containing base address and an object consisting of get variables and its values 
   **/
  applyRule(rule, url) {

    let ruleRegular = '',
      reqVariables = {},
      places = [],
      regRuleVariables, regRuleText = '',
      applied = false;


    if (url.indexOf('.') > 0) {
      return false;
    }
    console.log(rule.rule);

    //       console.log(regRuleVariables);
    regRuleText = rule.rule.replace(/\[([^\]]*)\]/g, (match, group) => {
      places.push({
        group,
        preserve: true
      });
      return `([^/]*)`;
    });


    regRuleText = regRuleText.replace(/\{([^\}]*)\}/g, (match, group) => {
      places.push(group);
      return `([^/]*)`;
    });



    let parsedUrl = url.replace((new RegExp(regRuleText, 'g')), function (match, group) {
      applied = true;

      let out = match;
      for (let i = 0, max = places.length; i < max; i++) {
        if (places[i].preserve) {
          reqVariables[places[i].group] = arguments[i + 1];
        } else {
          reqVariables[places[i]] = arguments[i + 1];
          out.replace(places[i].split('_')[1] + '/', '');
        }

      }
      return out;
    });


    if (!applied) {
      return false;
    }

    for (let v in reqVariables) {
      if (v.match('var_')) {
        reqVariables[v.split('_')[1]] = reqVariables[`value_${v.split('_')[1]}`];
        delete(reqVariables[v]);
        delete(reqVariables[`value_${v.split('_')[1]}`]);
      }

    }


    parsedUrl = parsedUrl.replace(new RegExp(/\/\//, 'g'), '\\');
    return {
      path: parsedUrl,
      reqVariables: reqVariables
    };
  }


  applyRules(url, rules = this.rules) {
    let rulesOrd = rules.sort((r0, r1) => {
      return r0.priority - r1.priority;
    });
    let currentApplication;
    for (let i = 0, max = rulesOrd.length; i < max; i++) {
      currentApplication = this.applyRule(rulesOrd[i], url);
      if (currentApplication) {
        return currentApplication;
      }
    }
  }



}


exports.Route = Route;
/** 
    rules
    /blog/soups
    '/blog/{pageName}/'-> blog {page: pageName}


**/
