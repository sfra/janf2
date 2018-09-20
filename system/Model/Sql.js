let ROOT_PATH = require(process.env.INIT_CONFIG).config.ROOT_PATH;
let Model = require(ROOT_PATH + '/system/Model/Model').Model;

/**
 * @class Sql
 * @inherits Model
 * @constructor
 */


class Sql extends Model {
    constructor(config){
        super(config);
        /**
         * Parts of the prepared sql query
         * @type {Object}
         */
            this.queryScheme={select:'*', from:'', where:'TRUE', join:''};

    }

        select(names){
        if( names===undefined ){
            names='*';
        }
        
        if (this.queryScheme.select!=='*') {
            this.queryScheme.select+=`, ${names}`;
            return this;
        }
        this.queryScheme.select=names;
        return this;
    }
    
    //basicTable=source.split(",")[0].replace(/^\s+|\s+$/g, "");
        from(source){
        
        this.queryScheme.from=source;
        return this;
    }
/**
 * in text replaces ? by rep only if rep match re where [rep,re] is an element of the Array replacement
 * @param {string} text string for preparation
 * @param {Array} replacement array of the form [[rep_0,re_0],[rep1,re_1],...,[rep_0,re_n]]
 * @returns {Sql}
 */
    where(text,replacement){
        let qmPosition;
        let index=0;
        let re;

        while( (qmPosition=text.search('\\?'))>-1 ){
  
            re=new RegExp(`^${replacement[index][1]}$`);
            if( replacement[index][1]!==undefined && replacement[index][0].match(re)===null ){
                return this;
            }


            text=`${text.substring(0,qmPosition)}'${(replacement[index])[0]}'${text.substring(qmPosition+1)}`;
            index+=1;
        }
        
        this.queryScheme.where=text;
        return this;
    }
   
    /**
     * Summary
     * @param {String} joinedTable the table which will be joined
     * @param {String} existingColumn the column in the base table
     * @param {String} joinedColumn the column in the joined table
     * @returns {Sql}  chained object
     */
    join(joinedTable, existingColumn, joinedColumn){
       
        this.queryScheme.join=`JOIN ${joinedTable} ON ${existingColumn}=${joinedTable}.${joinedColumn}`;
        
        return this;
    
    }
    
    getQuery(){
        const query=`SELECT ${this.queryScheme.select} FROM ${this.queryScheme.from} ${this.queryScheme.join} WHERE ${this.queryScheme.where}`;
        this.config.queryText = query.replace(/\'/g,'"');
        return query;
    }
    exec(){
        return this.query(this.getQuery());
    }    
    
}


exports.Sql = Sql;