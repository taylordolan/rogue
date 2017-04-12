var board = [];
var boardElement = document.getElementsByClassName("board")[0];
var boardSize = 4;
var health = 3;
var score = 0;
var scoreElement = document.getElementsByClassName("score")[0];
var turn = 0;

for (var i = 0; i < boardSize * boardSize; i++) {
  board[i] = [];
}
