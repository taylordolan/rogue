function Ship() {

  Item.call(this);
  this.char = "∆";
  this.hasHealth = true;
  this.type = "ship";

  this.deployToTile = function(tile) {
    board[tile].push(this);
  }
}

var ship = new Ship();
