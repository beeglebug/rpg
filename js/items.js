var Item = function(id) {
    this.id = id;
    this.name = '';
    this.components = [];
    this.properties = [];
    this.condition = 100;
    this.actions = [];
};

Item.prototype.addProperty = function(property) {
  
    // check exits?
    this.properties.push(property);
};

Item.prototype.hasProperty = function(property) {
    
    return this.properties.indexOf(property) >= 0;
    
};

var ItemAction = function(name) {
    this.name = name;
    this.requirements = [];
    this.result;
};

ItemAction.prototype.meetsRequirements = function(item) {
  
    var i, len, requirement;
    
    for(i = 0, len = this.requirements.length; i < len; i++) {
        
        requirement = this.requirements[i];
        
        if(!item.hasProperty(requirement)) {
            return false;
        }
        
    }
    
    return true;
};

var can = new Item('can');
var openCan = new Item('open-can');

open = new ItemAction('open');
open.requirements.push('piercing');
open.result = openCan;

can.actions.push(open);


var knife = new Item('knife');
knife.addProperty('edged')
knife.addProperty('piercing');

var Operation = function(input) {
    
    this.input = input;
    this.operator = null;
    this.output = null;
};

Operation.prototype.getActions = function() {
    
    var actions = [];
    
    this.input.actions.forEach(function(action) {
    
        if(action.meetsRequirements(this.operator)) {
            
            actions.push(action);
        }
        
    }.bind(this));
    
    return actions;
};



op = new Operation(can);
op.operator = knife;
var actions = op.getActions();
