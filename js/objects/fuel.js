function Fuel() {

  Item.call(this);
  this.char = "f";
  this.avoids = ["wall"];
  this.type = "fuel";

  this.deployToTile = function(tile) {
    board[tile].push(this);
  }

  this.destroy = function() {
    collectedFuel++;
    removeFromArray(board[this.tile()], this);
  }
}
