var board = [];
var boardElement = document.getElementsByClassName("board")[0];
var boardSize = 11;
var health = 3;
var turn = 0;

for (var i = 0; i < boardSize * boardSize; i++) {
  board[i] = [];
}
