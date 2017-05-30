function Ship() {

  Item.call(this);
  this.char = "∆";
  this.hasHealth = true;
  this.type = "ship";

  this.deployToCenterTile = function() {
    destination = Math.floor(boardSize * boardSize / 2);
    board[destination].push(this);
  }
}

var ship = new Ship();
