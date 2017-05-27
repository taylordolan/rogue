function Hero() {

  Item.call(this);
  this.hasHealth = true;

  this.setTile = function(n) {
    if (board[n][0] && board[n][0].type === "enemy") {
      board[n][0].die();
    }
    // TODO: need a isValidMovementTile() function;
    else if (!board[n][0] || board[n][0].type !== "wall") {
      board[this.getTile()].pop(this);
      board[n].push(this);
    }
  }
}

var heroA = new Hero();
var heroB = new Hero();
heroA.char = 'a';
heroB.char = 'b';
