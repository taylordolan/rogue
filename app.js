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
      return true;
    }
  }

  this.moveLeft = function() {
    if (this.getCol() > 0) {
      this.setTile(this.getTile() - 1);
      return true;
    }
  }

  this.moveUp = function() {
    if (this.getRow() > 0) {
      this.setTile(this.getTile() - mapSize);
      return true;
    }
  }

  this.moveDown = function() {
    if (this.getRow() < mapSize - 1) {
      this.setTile(this.getTile() + mapSize);
      return true;
    }
  }

  // to be used like this, for example: hero.moveWithOption("moveRight", "moveDown")
  this.moveWithOption = function(array) {
    option = Math.floor(Math.random() * array.length);
    console.log(array[option]);
    this[array[option]]();
  }

  this.distanceToHeroLeft = function() {
    if (this.getCol() > 0) {
      return this.distanceToHero(this.getTile() - 1);
    }
  }

  this.distanceToHeroRight = function() {
    if (this.getCol() < mapSize - 1) {
      return this.distanceToHero(this.getTile() + 1);
    }
  }

  this.distanceToHeroUp = function() {
    if (this.getRow() > 0) {
      return this.distanceToHero(this.getTile() - mapSize);
    }
  }

  this.distanceToHeroDown = function() {
    if (this.getRow() < mapSize - 1) {
      return this.distanceToHero(this.getTile() + mapSize);
    }
  }


  this.distanceToHero = function(startTile) {
    var steps = 0;
    var found = false;
    lookedTiles = [];
    lookedTiles.push (startTile);

    function isHeroInTile(n) {
      if (board[n][0] === heroA || board[n][0] === heroB) {
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
      if (l && isHeroInTile(l)) {
        found = true;
      }
      if (l && !isInLookedTiles(l)) {
        lookedTiles.push(l);
      }
      if (r && isHeroInTile(r)) {
        found = true;
      }
      if (r && !isInLookedTiles(r)) {
        lookedTiles.push(r);
      }
      if (t && isHeroInTile(t)) {
        found = true;
      }
      if (t && !isInLookedTiles(t)) {
        lookedTiles.push(t);
      }
      if (b && isHeroInTile(b)) {
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

  this.pathfind = function() {
    var d = this.distanceToHero(this.getTile());
    var dl = this.distanceToHeroLeft();
    var dr = this.distanceToHeroRight();
    var du = this.distanceToHeroUp();
    var dd = this.distanceToHeroDown();
    var distances = [];
    var closer = [];

    if (dl && dl < d) {
      closer.push('moveLeft');
    }
    if (dr && dr < d) {
      closer.push('moveRight');
    }
    if (du && du < d) {
      closer.push('moveUp');
    }
    if (dd && dd < d) {
      closer.push('moveDown');
    }
    console.log(closer);
    this.moveWithOption(closer);
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
        if (heroA.moveUp()) {
          turn++;
          kobold.pathfind();
          renderBoard();
        }
      }
      else {
        if (heroB.moveUp()) {
          turn++;
          kobold.pathfind();
          renderBoard();
        }
      }
    }
    else if (e.keyCode == '40') {
      if (turn%2 === 0) {
        if (heroA.moveDown()) {
          turn++;
          kobold.pathfind();
          renderBoard();
        }
      }
      else {
        if (heroB.moveDown()) {
          turn++;
          kobold.pathfind();
          renderBoard();
        }
      }
    }
    else if (e.keyCode == '37') {
      if (turn%2 === 0) {
        if (heroB.moveLeft()) {
          turn++;
          kobold.pathfind();
          renderBoard();
        }
      }
      else {
        if (heroA.moveLeft()) {
          turn++;
          kobold.pathfind();
          renderBoard();
        }
      }
    }
    else if (e.keyCode == '39') {
      if (turn%2 === 0) {
        if (heroB.moveRight()) {
          turn++;
          kobold.pathfind();
          renderBoard();
        }
      }
      else {
        if (heroA.moveRight()) {
          turn++;
          kobold.pathfind();
          renderBoard();
        }
      }
    }
  }
});
