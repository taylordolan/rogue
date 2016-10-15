var board = [];
var map;
var mapSize = 12;
var tiles;
var turn = 0;

for (var i = 0; i < mapSize * mapSize; i++) {
  board[i] = [];
}

function Item() {

  this.deployToRandomEmptyTile = function() {
    emptyTiles = [];
    for (var i=0; i<board.length; i++) {
      if (board[i].length === 0) {
        emptyTiles.push(board[i]);
      }
    }
    emptyTiles[Math.floor(Math.random()*emptyTiles.length)].push(this);
  }

  this.getTile = function() {
    for (var i = 0; i<board.length; i++) {
      for (var j = 0; j<board[i].length; j++) {
        if (board[i][j] == this) {
          return i;
        }
      }
    }
  }

  this.getCol = function() {
    for (var i=0; i<mapSize; i++) {
      if ((this.getTile() - i) % mapSize === 0) {
        return i;
      }
    }
  }

  this.getRow = function() {
    for (var i=1; i<=mapSize; i++) {
      if (this.getTile() < mapSize * i) {
        return i - 1;
      }
    }
  }

  this.setTile = function(tileNumber) {
    board[this.getTile()].pop(this);
    board[tileNumber].push(this);
  }

  this.moveRight = function() {
    if (this.getCol() < mapSize - 1) {
      this.setTile(this.getTile() + 1);
      turn++;
      renderBoard();
    }
  }

  this.moveLeft = function() {
    if (this.getCol() > 0) {
      this.setTile(this.getTile() - 1);
      turn++;
      renderBoard();
    }
  }

  this.moveUp = function() {
    if (this.getRow() > 0) {
      this.setTile(this.getTile() - mapSize);
      turn++;
      renderBoard();
    }
  }

  this.moveDown = function() {
    if (this.getRow() < mapSize - 1) {
      this.setTile(this.getTile() + mapSize);
      turn++;
      renderBoard();
    }
  }

  // to be used like this, for example: hero.moveWithOption("moveRight", "moveDown")
  this.moveWithOption = function(opt1, opt2) {
    if (Math.floor(Math.random() * 2) == 0) {
      this[opt1]();
    } else {
      this[opt2]();
    }
  }
}

var heroA = new Item();
heroA.char = 'a';
var heroB = new Item();
heroB.char = 'b';

function renderBoard() {
  map = document.getElementsByClassName("map")[0];
  map.innerHTML = '';
  for (var i=0; i<board.length; i++) {
    if (board[i].length !== 0) {
      map.innerHTML += board[i][0].char;
    }
    else if (i === heroA.getTile() - mapSize && turn % 2 === 0 || i === heroA.getTile() + mapSize && turn % 2 === 0) {
      map.innerHTML += '•';
    }
    else if (i === heroB.getTile() - mapSize && (turn + 1) % 2 === 0 || i === heroB.getTile() + mapSize && (turn + 1) % 2 === 0) {
      map.innerHTML += '•';
    }
    else if (i === heroA.getTile() - 1 && (turn + 1) % 2 === 0 || i === heroA.getTile() + 1 && (turn + 1) % 2 === 0) {
      map.innerHTML += '•';
    }
    else if (i === heroB.getTile() - 1 && turn % 2 === 0 || i === heroB.getTile() + 1 && turn % 2 === 0) {
      map.innerHTML += '•';
    }
    else if (board[i].length === 0) {
      map.innerHTML += '.';
    }
    if ((i + 1) % mapSize === 0) {
      map.innerHTML += '<br>';
    }
  }
}

window.addEventListener("load", function(){

  heroA.deployToRandomEmptyTile();
  heroB.deployToRandomEmptyTile();
  renderBoard();

  document.onkeydown = checkKey;
  function checkKey(e) {
    e = e || window.event;

    if (e.keyCode == '38') {
      if (turn%2 === 0) {
        heroA.moveUp();
      } else {
        heroB.moveUp();
      }
    }
    else if (e.keyCode == '40') {
      if (turn%2 === 0) {
        heroA.moveDown();
      } else {
        heroB.moveDown();
      }
    }
    else if (e.keyCode == '37') {
      if (turn%2 === 0) {
        heroB.moveLeft();
      } else {
        heroA.moveLeft();
      }
    }
    else if (e.keyCode == '39') {
      if (turn%2 === 0) {
        heroB.moveRight();
      } else {
        heroA.moveRight();
      }
    }
  }
});
