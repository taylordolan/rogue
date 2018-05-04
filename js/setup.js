var board = [];
var boardElement = document.getElementsByClassName("board")[0];
var boardSize = 9;
var health = maxHealth;
var healthElement;
var level = 0;
var maxHealth = 4;
var center = boardSize * boardSize / 2 - 0.5;
var tileElements = [];
var turn = 0;
var corners = [0, boardSize - 1, boardSize * boardSize - boardSize, boardSize * boardSize - 1]

for (var i = 0; i < boardSize * boardSize; i++) {
  board[i] = [];
}
