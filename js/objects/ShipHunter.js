function ShipHunter (name) {

  Enemy.call(this);
  this.char = "s";
  this.avoids = ["wall", "enemy", "hero"];
  this.target = function() {
    return ship.tile();
  }

  this.die = function() {
    removeFromArray(board[this.tile()], this);
    removeFromArray(ShipHunterFactory.allShipHunters, this);
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
