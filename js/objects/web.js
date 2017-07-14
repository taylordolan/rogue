function Web() {

  Item.call(this);
  this.char = "/";
  this.type = "web";

  this.deploy = function(tile) {
    board[tile].push(this);
  }

  this.destroy = function() {
    board[this.tile()].splice(board[this.tile()].indexOf(this), 1);
  }
}
