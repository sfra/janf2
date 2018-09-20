let clone = require('../helpers/libs').clone;

/**
 * class ModelGeneral
 * @constructor
 * @param {String} name name of the model
 */

/** 
     * name of the model
     * @type {string}
     */ 
let _name;
/**
 * Contains pairs fieldName.itsType
 * @type {Object}
 */
let tableFields = {};
/**
 * the name for the main key
 * @type {string}
 */
let _id = null;
/* contains a list of objects field.(its type)*/

let table = [];
class ModelGeneral {
  
  constructor(name) {


    
    _name = name;
    /**
     * Defines fields of the model and their types
     * method create
     * @param	{Array[Array[2]]}	fields	[field,its type]
     * @param	{Object}	id		indicates main key
     * @returns	{Object}			tableFields
     */
    this.create = (fields, id)=> {
      for (let i = 0; i < fields.length; i++) {
        tableFields[fields[i][0]] = fields[i][1];

        if (fields[i][0] === id) {
          _id = id;
        }
      }
      return tableFields;
    };
    

    /**
     * Object containing two filtering functions
     * @type {Object}
     */
    this.filterOne = {

      unary: function (cond, field) {
        
        if (cond[1] === 'undefined') {
          return field === cond[2];
        }

        switch (cond[2]) {
          case '<':
            return field < cond[3];
          case '>':
            return field > cond[3];
          case '>=':
            return field >= cond[3];
          case '<=':
            return field <= cond[3];
         }




      },
      binary: function (cond, field0, field1) {
      

        switch (cond) {
          case '<':
            return field0 < field1;
          case '>':
            return field0 > field1;
          case '<=':
            return field0 <= field1;
          case '>=':
            return field0 >= field1;
          case '=':
            return field0 === field1;

        }

      }




    };
  }
  /**
   * Checks if the types of row match the types given in table array
   * @param	{Object}	row	Description
   * @returns	{bool}		true if row fulfills the types from table array
   */
  validate(row) {

    let out = true;

    for (let i in row) {
      out = out && (typeof row[i]) === tableFields[i];

    }

    return out;
  }

  addRow(row, validate) {

    for (let field in row) {

      if (!tableFields.hasOwnProperty(field)) {
        throw `The field ${field} does not exist in ${_name}`;
      }

    }


    if (validate && !this.validate(row)) {
      throw `Fields do not match appropriate types of model`;
    }

    table.push(clone(row));


  }

  /**
   * Returns row with a given _id
   * @param	{string}	id	value of _id
   * @returns	{Object}		row with the given _id
   */
  find(id) {
    for (let i = 0; i < table.length; i++) {

      if (table[i][_id] === id) {
        return table[i];
      }

    }
    return null;

  }
  /**
   * Takes an object of the form {field0:string0,field1:string1,...,fieldn:stringn}, where fields are taken form fields, and strings contain the conditions
   * @param	{Object}	filteringObject	object filtering fields
   * @returns	{Object[]}	Array of rows that validate conditions
   */
  filter(filteringObject) {

    let out = [];
    
    let filteringArray = [];
    for (let i = 0; i < table.length; i++) {

      for (let fltr in filteringObject) {

        for (let f in table[i]) {
          filteringArray = this.parseFilter(filteringObject[fltr]);

          if (tableFields[fltr] === 'number') {
            filteringArray[3] = parseFloat(filteringArray[3]);
          }

          if (f === fltr &&
            filteringArray[4] === undefined &&
            this.filterOne.unary(filteringArray, table[i][f])
          ) {
            if (filteringArray[1] !== '!') {
              out.push(table[i]);
            }


          } else if (table[i][f] === fltr && filteringArray[4] !== undefined && this.filterOne.binary(filteringArray[2])) {
            //code
          }
        }

      }

    }

    return out;
  }

  getName() {
    return _name;
  }

  getTableFields() {
    return tableFields;
  }
  getTable() {
    return table;
  }


  /**
   * Creates a new model with the same fields as current
   * @param	{string}	name	name of the created model
   * @returns	{Object}			generated model
   */
  buildModelGeneral(name) {
    let out = new ModelGeneral(name);

    let fields = [];
    for (let i in tableFields) {
      fields.push([i, tableFields[i]]);

    }

    out.create(fields, _id);
    return out;

  }



 




/**
 * parses a string from filtering object, and returns array of tokens
 * @param	{string}	fltr	condition to be parsed
 * @returns	{Array}			array of tokens
 */
  parseFilter(fltr){
  let re=/^(\!)?([^A-Za-z0-9]*)([A-Za-z0-9]+)([^A-Za-z0-9])?([A-Za-z0-9]*)$/;
  let out=fltr.match(re);
  return out;
}

  /**
   * Creates new template for a data.
   * @param	{Array[string[2]]}	fields	array of arrays [[field0:type0],[field1:type1],...,[fieldn:typen]]
   * @param	{string}	id		label for id
   * @returns	{Object}			tableFields
   */
  create(fields, id) {
    for (let i = 0; i < fields.length; i++) {
      tableFields[fields[i][0]] = fields[i][1];

      if (fields[i][0] === id) {
        _id = id;
      }
    }
    return tableFields;
  }



}




















exports.ModelGeneral = ModelGeneral;