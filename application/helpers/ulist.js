let  ulist= (lst)=> {

  'use strict';


  let out='<ul>\n';

    while ( lst.length !=0 ) {
      out+=`<li>"${lst.shift()}</li>`;
      }  
        
    return `${out}</ul>\n`;
    
};


exports.ulist=ulist;