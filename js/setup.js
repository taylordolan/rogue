var board = [];
var boardElement = document.getElementsByClassName("board")[0];
var boardSize = 11;
var maxHealth = 4
var health = maxHealth;
var healthElement;
var level = 1;
var tileElements = [];
var turn = 0;
var collectedFuel = 0;

for (var i = 0; i < boardSize * boardSize; i++) {
  board[i] = [];
}
