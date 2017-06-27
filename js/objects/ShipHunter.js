function ShipHunter (name) {

  Enemy.call(this);
  this.char = "s";
  this.avoids = ["wall", "enemy", "fuel"];
  this.target = function() {
    return ship.tile();
  }

  this.die = function() {
    board[this.tile()].splice(board[this.tile])
    ShipHunterFactory.allShipHunters.splice(ShipHunterFactory.allShipHunters.indexOf(this),1);
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
