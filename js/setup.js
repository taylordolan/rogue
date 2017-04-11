var board = [];
var health = 3;
var heroA = new Hero();
var heroB = new Hero();
var map;
var mapSize = 4;
var score = 0;
var turn = 0;

heroA.char = 'a';
heroB.char = 'b';

for (var i = 0; i < mapSize * mapSize; i++) {
  board[i] = [];
}
