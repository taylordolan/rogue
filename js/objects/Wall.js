function Wall() {
  this.char = "×";
  this.solid = true;
}

function generateWalls() {

  for (var i=0; i<board.length; i++) {
    var flip = Math.floor(Math.random() * 3);
    if (flip < 1 && board[i].length === 0) {
      board[i][0] = new Wall();
    }
  }
  renderBoard();
}
