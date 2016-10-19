var board = [];
var map;
var mapSize = 12;
var tiles;
var turn = 0;

for (var i = 0; i < mapSize * mapSize; i++) {
  board[i] = [];
}

function getCol(n) {
  for (var i=0; i<mapSize; i++) {
    if ((n - i) % mapSize === 0) {
      return i;
    }
  }
}

function getRow(n) {
  for (var i=1; i<=mapSize; i++) {
    if (n < mapSize * i) {
      return i - 1;
    }
  }
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

  this.setTile = function(n) {
    board[this.getTile()].pop(this);
    board[n].push(this);
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

  this.distanceToHeroALeft = function() {
    if (this.getCol() > 0) {
      return distanceToHeroA(this.getTile() - 1);
    }
  }

  this.distanceToHeroARight = function() {
    if (this.getCol() < mapSize - 1) {
      return distanceToHeroA(this.getTile() + 1);
    }
  }

  this.distanceToHeroAUp = function() {
    if (this.getRow() > 0) {
      return distanceToHeroA(this.getTile() - mapSize);
    }
  }

  this.distanceToHeroADown = function() {
    if (this.getRow() < mapSize - 1) {
      return distanceToHeroA(this.getTile() + mapSize);
    }
  }

  this.distanceToHeroA = function() {
    var steps = 0;
    var found = false;
    lookedTiles = [];
    lookedTiles.push (this.getTile());

    function isHeroAInTile(n) {
      if (board[n][0] === heroA) {
        return true;
      }
    }

    function isInLookedTiles(n) {
      for (var i=0; i<lookedTiles.length; i++) {
        if (lookedTiles[i] === n) {
          return true;
        }
      }
    }

    function lookAdjacentTiles(n) {
      if (getCol(n) > 0) {
        var l = n - 1;
      }
      if (getCol(n) < mapSize - 1) {
        var r = n + 1;
      }
      if (getRow(n) > 0) {
        var t = n - mapSize;
      }
      if (getRow(n) < mapSize - 1) {
        var b = n + mapSize;
      }
      if (l && isHeroAInTile(l)) {
        found = true;
      }
      if (l && !isInLookedTiles(l)) {
        lookedTiles.push(l);
      }
      if (r && isHeroAInTile(r)) {
        found = true;
      }
      if (r && !isInLookedTiles(r)) {
        lookedTiles.push(r);
      }
      if (t && isHeroAInTile(t)) {
        found = true;
      }
      if (t && !isInLookedTiles(t)) {
        lookedTiles.push(t);
      }
      if (b && isHeroAInTile(b)) {
        found = true;
      }
      if (b && !isInLookedTiles(b)) {
        lookedTiles.push(b);
      }
    }

    // put it all together
    return (function() {
      for (var i=0; i<mapSize*mapSize; i++) {
        var temp = lookedTiles.length;
        for (var j=0; j<temp; j++) {
          lookAdjacentTiles(lookedTiles[j]);
        }
        steps++;
        if (found === true) {
          return steps;
        }
      }
    })()
  }
}

var heroA = new Item();
heroA.char = 'a';
var heroB = new Item();
heroB.char = 'b';
var kobold = new Item();
kobold.char = 'k';

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
  kobold.deployToRandomEmptyTile();
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
