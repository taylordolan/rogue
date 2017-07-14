function Fuel() {

  Item.call(this);
  this.char = "f";
  this.avoids = ["wall"];
  this.type = "fuel";

  this.deploy = function() {

    var emptyTiles = [];
    var farTiles = [];
    var otherFuelTile;
    var realFarTiles = [];
    var shipTile = ship.tile();

    for (var i = 0; i < board.length; i++) {
      if (!board[i].length) {
        emptyTiles.push(i);
      }
      else if (board[i][0].type === "fuel") {
        otherFuelTile = i;
      }
    }

    for (var j = 0; j < emptyTiles.length; j++) {
      if (this.distanceFromTo(shipTile, emptyTiles[j]) === 6) {
        farTiles.push(emptyTiles[j]);
      }
    }

    if (otherFuelTile) {
      for (var k = 0; k < farTiles.length; k++) {
        if (this.distanceFromTo(otherFuelTile, farTiles[k]) > 9) {
          realFarTiles.push(farTiles[k]);
        }
      }
      board[realFarTiles[Math.floor(Math.random()*realFarTiles.length)]].push(this);
    } else {
      board[farTiles[Math.floor(Math.random()*farTiles.length)]].push(this);
    }
  }

  this.destroy = function() {
    board[this.tile()].splice(board[this.tile]);
  }
}

var fuelA = new Fuel();
var fuelB = new Fuel();
