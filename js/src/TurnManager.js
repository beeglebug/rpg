var TurnManager = function() {

    this.clock = 0;
    this.increment = 1;

};

TurnManager.prototype.progress = function() {

    this.clock += this.increment;

    player.hydration -= 1;
    player.nutrition -= 1;

};