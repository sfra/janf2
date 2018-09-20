const ROOT_PATH = require(process.env.INIT_CONFIG).config.ROOT_PATH;
const Model = require(`${ROOT_PATH}/system/Model/Model`).Model;
const clone = require(`../helpers/libs`).clone;
/**
 * @class Nosql
 * @inherits Model
 * @constructor
 */
class Nosql extends Model {

    
    constructor(config) {
        super(config);
        this.queryScheme = {db: null, collection: null, find: [], projection:null, limit: null};   
    }
 

    setDb(name) {
        this.queryScheme.db = name;
        return this;
    }

    from(collection) {
        this.queryScheme.collection=collection;
        return this;
    }

    
    select(...crit) {
        crit.forEach(c=>{
            this.queryScheme.find.push(clone(c));
           
        });
        return this;
    }

    projection(obj) {
        this.queryScheme.projection=clone(obj);
        return this;
    }

    limit(nr) {
        this.queryScheme.limit = nr;
        return this;
    }

    getQuery(){
        return this.queryScheme;
    }

    exec() {

        return this.query(this.getQuery());
    }
    
    
    
//     this.exec=()=>  {
        
//         let query="SELECT "+this.queryScheme.select+" "+"FROM "+this.queryScheme.from+" "+this.queryScheme.join+" WHERE "+this.queryScheme.where+";";
        
//         //this.config.queryText = query.replace(/\'/,"'");  
//         this.config.queryText = query.replace(/\'/g,'"');  

//         return this.query(query);
//     }
    
}

exports.Nosql = Nosql;


