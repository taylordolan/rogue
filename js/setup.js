var board = [];
var map;
var mapSize = 4;
var tiles;
var turn = 0;
var health = 3;
var score = 0;

for (var i = 0; i < mapSize * mapSize; i++) {
  board[i] = [];
}

var heroA = new Hero();
heroA.char = 'a';
var heroB = new Hero();
heroB.char = 'b';
