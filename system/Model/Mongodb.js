'use strict';

const INIT_CONFIG = require(process.env.INIT_CONFIG);
const ROOT_PATH = INIT_CONFIG.config.ROOT_PATH; 

const Nosql = require(`${ROOT_PATH}/system/Model/Nosql`).Nosql;
const clone = require(`${ROOT_PATH}/system/helpers/libs`).clone;
const copyProperties = require(`${ROOT_PATH}/system/helpers/libs`).copyProperties;


const MongoClient = require('mongodb').MongoClient;
/**
 * @class Mongodb
 * @inherits Nosql
 * @constructor
 */
class Mongodb extends Nosql {

    constructor(config) {
        super(config);
       
    this.url = `mongodb://${this.config.host}:27017/`;
    
    this.database = config.database;
    }




    query(obj){
         let findObj = {};
        
        
        
        for(let i=0, max=obj.find.length; i<max;i++) {
           copyProperties(obj.find[i],findObj);
       }

       let projection = null;
       if(this.queryScheme.projection!==null) {

            projection = this.queryScheme.projection;
       } else {
            projection={};
           for(let prop in findObj) {
                projection.prop = 1;   
           }

        }
       
        console.log('projection');
        console.log(projection);


        MongoClient.connect(this.url, { useNewUrlParser: true },(err, db)=> {
            if (err) {
                this.emm.emit('dberror');
            };
            let dbo = db.db(this.database);
            //Exclude the _id field from the result:
            dbo.collection(this.queryScheme.collection).find(findObj).toArray((err, result)=> {
              if (err) {

                this.emm.emit('dberror');
              } else {
                  let response =[];
                  response.filter((row)=>{
                     let out ={};
                    for(let prop in projection){
                        if(projection.prop===1) {
                            out.prop=row.prop;
                        }
                    }
                                   
                  });

              //   for(prop in projection) {
                //       if(projection.prop===1) {
                //         response.prop=
                //       }
                //   }
                  this.row = result;
                  this.emm.emit('dbOK');
                  console.log('result');
                  console.log(result);
              }

              db.close();
            });
          
          });
        


        

    }
}

exports.DB = Mongodb;