function searchCurrentTile() {

    //console.log('searching');

    var table = house;
    
    table.forEach(function(item) {
    
        var check = randomIntBetween(0,100);
        
        if(check > item.chance) { return; }
        
        var loot;
        
        if(item.list) {
            
            loot = pickWeighted(item.list);
            console.log(loot);
            
        } else {
         
            loot = item;
            console.log(loot);
            
        }
        
    });
    
    //var item = pickWeighted(tinnedFood);
    //console.log(item);
    
}


var tinnedFood = [
  
    { name : 'tinned beans', weight : 5 },
    { name : 'tinned tuna', weight : 5 },
    { name : 'tinned chicken soup', weight : 5 }
    
];

var house = [

    { name : 'rags', chance : 70, quantity : [0,3] },
    { list : tinnedFood, chance : 50, quantity : [0,4] }

];


function pickWeighted(list) {

    var totalWeight = list.reduce(function(a,b){
        return a + b.weight;
    }, 0);
    
    var val = randomIntBetween(0, totalWeight - 1);
    
    var total = 0;
    
    for(var i = 0, len = list.length; i < len; i++) {
        total += list[i].weight;
        if(val < total) { return list[i]; }
    }
    
}
    
    
function randomIntBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};