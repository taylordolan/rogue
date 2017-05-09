function ShipHunter (name) {

  Enemy.call(this);
  this.type = "enemy";
  this.char = "s";
  this.target = function() {
    return ship.getTile();
  }

  this.die = function() {
    board[this.getTile()].splice(board[this.getTile])
    ShipHunterFactory.allShipHunters.splice(ShipHunterFactory.allShipHunters.indexOf(this),1);
    score++;
  }
}

ShipHunterFactory = {

  createShipHunter: function () {
    var newShipHunter = {};
    ShipHunter.apply(newShipHunter, arguments);
    this.allShipHunters.push(newShipHunter);
    return newShipHunter;
  },

  allShipHunters: [],

  forEachShipHunter: function (action) {
    for (var i = 0; i < this.allShipHunters.length; i++){
      action.call(this.allShipHunters[i]);
    }
  }
};
