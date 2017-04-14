function Ship() {

  Item.call(this);

  this.deployToCenterTile = function() {
    destination = Math.floor(boardSize * boardSize / 2);
    board[destination].push(this);
  }

  this.char = 's';
}

var ship = new Ship();
