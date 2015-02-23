/**
 * instantiate an object with a unique id
 */
var ObjectWithId = function() {

    this.id = this._getId();

};

ObjectWithId.prototype._getId = function() {

    return ObjectWithId._currentId++;

};

ObjectWithId._currentId = 0;