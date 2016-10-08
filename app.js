var map;
var board = [];
var tiles;

for (var i = 0; i < 16; i++) {
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
    if (this.getTile() === 0 || this.getTile() % 4 === 0) {
      return 0;
    } else if (this.getTile() === 1 || this.getTile() === 5 || this.getTile() === 9 || this.getTile() === 13) {
      return 1;
    } else if (this.getTile() === 2 || this.getTile() === 6 || this.getTile() === 10 || this.getTile() === 14) {
      return 2;
    } else if (this.getTile() === 3 || this.getTile() === 7 || this.getTile() === 11 || this.getTile() === 15) {
      return 3;
    }
  }

  this.getRow = function() {
    if (this.getTile() >= 0 && this.getTile() <= 3) {
      return 0;
    } else if (this.getTile() >= 4 && this.getTile() <= 7) {
      return 1;
    } else if (this.getTile() >= 8 && this.getTile() <= 11) {
      return 2;
    } else if (this.getTile() >= 12 && this.getTile() <= 15) {
      return 3;
    }
  }

  this.setTile = function(tileNumber) {
    board[this.getTile()].pop(this);
    board[tileNumber].push(this);
    renderBoard();
  }

  this.moveRight = function() {
    if (this.getCol() < 3) {
      this.setTile(this.getTile() + 1);
    }
    renderBoard();
  }

  this.moveLeft = function() {
    if (this.getCol() > 0) {
      this.setTile(this.getTile() - 1);
    }
    renderBoard();
  }

  this.moveUp = function() {
    if (this.getRow() > 0) {
      this.setTile(this.getTile() - 4);
    }
    renderBoard();
  }

  this.moveDown = function() {
    if (this.getRow() < 3) {
      this.setTile(this.getTile() + 4);
    }
    renderBoard();
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

var hero = new Item();

function renderBoard() {
  var tiles = document.getElementsByClassName("tile");
  for (var i=0; i<tiles.length; i++) {
    while (tiles[i].firstChild) {
      tiles[i].removeChild(tiles[i].firstChild);
    }
  }
  for (var i=0; i<board.length; i++) {
    if (board[i][0] == hero) {
      tiles[i].innerText = "@";
    }
  }
}

window.addEventListener("load", function(){

  hero.deployToRandomEmptyTile();
  renderBoard();

  document.onkeydown = checkKey;
  function checkKey(e) {
    e = e || window.event;

    if (e.keyCode == '38') {
      hero.moveUp();
    }
    else if (e.keyCode == '40') {
      hero.moveDown();
    }
    else if (e.keyCode == '37') {
      hero.moveLeft();
    }
    else if (e.keyCode == '39') {
      hero.moveRight();
    }
  }
});
