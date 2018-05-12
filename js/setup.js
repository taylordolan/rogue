var board = [];
var boardElement = document.getElementsByClassName("board")[0];
var boardSize = 6;
var healthElement;
var level = 0;
var maxHealth = 4;
var center = Math.floor(boardSize * boardSize / 2);
var tileElements = [];
var turn = 0;
var corners = [0, boardSize - 1, boardSize * boardSize - boardSize, boardSize * boardSize - 1];
var score = 0;

for (var i = 0; i < boardSize * boardSize; i++) {
  board[i] = [];
}
