function Web() {

  Item.call(this);
  this.char = "/";
  this.type = "web";

  this.deploy = function(tile) {
    board[tile].push(this);
  }

  this.destroy = function() {
    removeFromArray(board[this.tile()], this);
  }
}
