/**
 * instantiate an object with a unique id
 */
var ObjectWithId = function() {

    this.id = this.__getId();

};

ObjectWithId.prototype.__getId = function() {

    return ObjectWithId.__currentId++;

};

ObjectWithId.__currentId = 0;