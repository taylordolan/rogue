var board = [];
var map;
var mapSize = 6;
var tiles;
var turn = 0;
var health = 3;
var score = 0;

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
    var emptyTiles = [];
    for (var i=0; i<board.length; i++) {
      if (board[i].length === 0) {
        emptyTiles.push(board[i]);
      }
    }
    emptyTiles[Math.floor(Math.random()*emptyTiles.length)].push(this);
  }

  this.deployToRandomEmptyCorner = function() {
    // list corners
    var corners = [
      0,
      mapSize - 1,
      mapSize * mapSize - 1,
      mapSize * mapSize - mapSize,
    ];
    console.log("corners = " + corners);
    var emptyCorners = [];
    for (var i=0; i<4; i++) {
      if (board[corners[i]].length == 0) {
        emptyCorners.push(board[corners[i]]);
      }
    }
    emptyCorners[Math.floor(Math.random()*emptyCorners.length)].push(this);
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
}

function Hero() {
  Item.call(this);

  this.moveSequence = function(d,t) {
    try {
      if (board[d][0].char == "k") {
        board[d][0].die();
        return true;
      }
    } catch (e) {
      try {
        if (board[t][0].char == "k") {
          board[t][0].die();
          this.setTile(d);
          return true;
        }
      } catch (e) {
        if (d) {
          this.setTile(d);
          return true;
        } else {
          return false;
        }
      }
    }
  }

  this.moveLeft = function() {
    var c = this.getCol();
    if (c > 0) {
      var d = this.getTile() - 1;
    }
    if (c > 1) {
      var t = this.getTile() - 2;
    }
    return this.moveSequence(d,t);
  }

  this.moveRight = function() {
    var c = this.getCol();
    if (c < mapSize-1) {
      var d = this.getTile() + 1;
    }
    if (c < mapSize-2) {
      var t = this.getTile() + 2;
    }
    return this.moveSequence(d,t);
  }

  this.moveUp = function() {
    var c = this.getCol();
    if (c > 0) {
      var d = this.getTile() - mapSize;
    }
    if (c > 1) {
      var t = this.getTile() - (mapSize*2);
    }
    return this.moveSequence(d,t);
  }

  this.moveDown = function() {
    var c = this.getRow();
    if (c < mapSize-1) {
      var d = this.getTile() + mapSize;
    }
    if (c < mapSize-2) {
      var t = this.getTile() + (mapSize*2);
    }
    return this.moveSequence(d,t);
  }
}

function Kobold (name) {
  Item.call(this);
  this.name = name;

  this.setTile = function(n) {
    if (board[n][0]) {
      console.log("hit!");
      health--;
    } else {
      board[this.getTile()].pop(this);
      board[n].push(this);
    }
  }

  // to be used like this, for example: hero.moveWithOption("moveRight", "moveDown")
  this.moveWithOption = function(array) {
    option = Math.floor(Math.random() * array.length);
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

    if (startTile === heroA.getTile() || startTile === heroB.getTile()) {
      return 0;
    }

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
    var closer = [];

    if (dl < d) {
      closer.push('moveLeft');
    }
    if (dr < d) {
      closer.push('moveRight');
    }
    if (du < d) {
      closer.push('moveUp');
    }
    if (dd < d) {
      closer.push('moveDown');
    }
    this.moveWithOption(closer);
  }

  this.die = function() {
    var killMe = this.name;
    board[this.getTile()].splice(board[this.getTile])
    KoboldFactory.allKobolds.splice(KoboldFactory.allKobolds.indexOf(this),1);
    score++;
  }
}

KoboldFactory = {
  createKobold: function () {
    var newKobold = {};
    Kobold.apply(newKobold, arguments);
    this.allKobolds.push(newKobold);
    return newKobold;
  },

  allKobolds: [],

  forEachKobold: function (action) {
    for (var i = 0; i < this.allKobolds.length; i++){
      action.call(this.allKobolds[i]);
    }
  }
};

var heroA = new Hero();
heroA.char = 'a';
var heroB = new Hero();
heroB.char = 'b';
KoboldFactory.createKobold("hi");

function renderBoard() {
  map = document.getElementsByClassName("map")[0];
  map.innerHTML = '';
  if (health > 0) {
    map.innerHTML += health;
  } else {
    map.innerHTML += "0";
  }
  // map.innerHTML += "&nbsp";
  if (score > 9) {
    for (var i=0; i<mapSize-3; i++) {
      map.innerHTML += "&nbsp;";
    }
  } else {
    for (var i=0; i<mapSize-2; i++) {
      map.innerHTML += "&nbsp;";
    }
  }
  map.innerHTML += score + "<br><br>";
  if (health < 1) {
    for (var i=0; i<mapSize; i++) {
      for (var j=0; j<mapSize; j++) {
        map.innerHTML += "x";
      }
      map.innerHTML += "<br>";
    }
  } else {
    for (var i=0; i<board.length; i++) {
      // for tiles that are populated, render their letters
      if (board[i].length) {
        map.innerHTML += board[i][0].char;
      }
      // on even numbered turns, put '•' above and below hero A
      else if (turn % 2 === 0 && (i === heroA.getTile() - mapSize || i === heroA.getTile() + mapSize)) {
        map.innerHTML += '•';
      }
      // on odd numbered turns, put '•' above and below hero B
      else if (i === heroB.getTile() - mapSize && (turn + 1) % 2 === 0 || i === heroB.getTile() + mapSize && (turn + 1) % 2 === 0) {
        map.innerHTML += '•';
      }
      // on odd numbered turns, put '•' to the left and right of hero A
      else if ((turn + 1) % 2 === 0 && (i === heroA.getTile() - 1 && (i + 1) % mapSize !== 0 || i === heroA.getTile() + 1 && i % mapSize !== 0)) {
        map.innerHTML += '•';
      }
      // on odd numbered turns, put '•' to the left and right of hero B
      else if (turn % 2 === 0 && (i === heroB.getTile() - 1 && (i + 1) % mapSize !== 0 || i === heroB.getTile() + 1 && i % mapSize !== 0)) {
        map.innerHTML += '•';
      }
      // put '.' on empty tiles
      else if (board[i].length === 0) {
        map.innerHTML += '.';
      }
      // insert line breaks
      if ((i + 1) % mapSize === 0) {
        map.innerHTML += '<br>';
      }
    }
  }
  map.innerHTML += "<br><br>";
}

window.addEventListener("load", function(){

  heroA.deployToRandomEmptyTile();
  heroB.deployToRandomEmptyTile();
  KoboldFactory.forEachKobold (function () { // forEach abstraction
    this.deployToRandomEmptyCorner();
    this.char = "k";
  });
  renderBoard();

  document.onkeydown = checkKey;
  function checkKey(e) {
    e = e || window.event;

    if (e.keyCode == '38') {
      if (turn%2 === 0) {
        if (heroA.moveUp()) {
          turn++;
          KoboldFactory.forEachKobold (function () { // forEach abstraction
            console.log("about to move kobold from " + this.getTile());
            this.pathfind();
          });
        }
      }
      else {
        if (heroB.moveUp()) {
          turn++;
          KoboldFactory.forEachKobold (function () { // forEach abstraction
            console.log("about to move kobold from " + this.getTile());
            this.pathfind();
          });
        }
      }
    }
    else if (e.keyCode == '40') {
      if (turn%2 === 0) {
        if (heroA.moveDown()) {
          turn++;
          KoboldFactory.forEachKobold (function () { // forEach abstraction
            console.log("about to move kobold from " + this.getTile());
            this.pathfind();
          });
        }
      }
      else {
        if (heroB.moveDown()) {
          turn++;
          KoboldFactory.forEachKobold (function () { // forEach abstraction
            console.log("about to move kobold from " + this.getTile());
            this.pathfind();
          });
        }
      }
    }
    else if (e.keyCode == '37') {
      if (turn%2 === 0) {
        if (heroB.moveLeft()) {
          turn++;
          KoboldFactory.forEachKobold (function () { // forEach abstraction
            console.log("about to move kobold from " + this.getTile());
            this.pathfind();
          });
        }
      }
      else {
        if (heroA.moveLeft()) {
          turn++;
          KoboldFactory.forEachKobold (function () { // forEach abstraction
            console.log("about to move kobold from " + this.getTile());
            this.pathfind();
          });
        }
      }
    }
    else if (e.keyCode == '39') {
      if (turn%2 === 0) {
        if (heroB.moveRight()) {
          turn++;
          KoboldFactory.forEachKobold (function () { // forEach abstraction
            console.log("about to move kobold from " + this.getTile());
            this.pathfind();
          });
        }
      }
      else {
        if (heroA.moveRight()) {
          turn++;
          KoboldFactory.forEachKobold (function () { // forEach abstraction
            console.log("about to move kobold from " + this.getTile());
            this.pathfind();
          });
        }
      }
    }
    if (e.keyCode == '37' || e.keyCode == '38' || e.keyCode == '39' || e.keyCode == '40') {
      if (turn%2 === 0) {
        KoboldFactory.createKobold(turn);
        KoboldFactory.forEachKobold (function () { // forEach abstraction
          if(!this.getTile()) {
            this.deployToRandomEmptyCorner();
            this.char = "k";
          }
        });
      }
    }
    renderBoard();
  }
});
