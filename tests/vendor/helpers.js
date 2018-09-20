
const generateRandomId=(nr,callback) => {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < nr; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    
    return text;

};
const deepEqual = (ob0,ob1)=>{
    let out = true;
    if(ob0 instanceof Array) {
        if(!(ob1 instanceof Array)){
            return false;
        }
        for(let i=0, max=ob0.length; i<max;i++) {
            out = out && deepEqual(ob0[i],ob1[i]);
        }
        return out; 
    }

    if(typeof ob0==='object'){
        if(!(typeof ob1=='object')){
            return false;
        }
        for(prop in ob0) {

            if(typeof ob1[prop]==='undefined') {
                return false;
            }
            out=out && deepEqual(ob0[prop],ob1[prop]);

        }
        return out;
    }
    return ob0===ob1;
};

exports.generateRandomId = generateRandomId;
exports.deepEqual = deepEqual;