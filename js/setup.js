var board = [];
var boardElement = document.getElementsByClassName("board")[0];
var boardSize = 7;
var collectedFuel = 0;
var health = maxHealth;
var healthElement;
var level = 0;
var maxHealth = 4;
var start = boardSize * boardSize / 2 - 0.5;
// var startB = boardSize * boardSize / 2 + (boardSize / 2) - 1;
var tileElements = [];
var turn = 0;

for (var i = 0; i < boardSize * boardSize; i++) {
  board[i] = [];
}
