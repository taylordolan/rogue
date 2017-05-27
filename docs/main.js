var board = [];
var boardElement = document.getElementsByClassName("board")[0];
var boardSize = 11;
var health = 3;
var score = 0;
var scoreElement = document.getElementsByClassName("score")[0];
var turn = 0;

for (var i = 0; i < boardSize * boardSize; i++) {
  board[i] = [];
}

function getColFromTile(n) {
  for (var i=0; i<boardSize; i++) {
    if ((n - i) % boardSize === 0) {
      return i;
    }
  }
}

function getRowFromTile(n) {
  for (var i=0; i<boardSize; i++) {
    if (n < boardSize * (i + 1)) {
      return i;
    }
  }
}

function isWall(tile) {
  if (board[tile]) {
    if (board[tile][0] && board[tile][0].char === "#") {
      return true;
    }
    else {
      return false;
    }
  }
}

function createRandomEnemy() {
  var flip = Math.floor(Math.random() * 2);
  if (flip) {
    ShipHunterFactory.createShipHunter();
  }
  else {
    HeroHunterFactory.createHeroHunter();
  }
  ShipHunterFactory.forEachShipHunter (function () {
    if(!this.getTile()) {
      this.deployToRandomEmptyCorner();
    }
  });
  HeroHunterFactory.forEachHeroHunter (function () {
    if(!this.getTile()) {
      this.deployToRandomEmptyCorner();
    }
  });
}

// measures distance to between two tiles
function distanceFromTo(start, end) {
  var steps = 0;
  var found = false;
  lookedTiles = [];
  lookedTiles.push(start);

  if (start === end) {
    return steps;
  }

  function isDestination(n) {
    if (n === end) {
      return true;
    }
  }

  function isInLookedTiles(n) {
    for (var i = 0; i < lookedTiles.length; i++) {
      if (lookedTiles[i] === n) {
        return true;
      }
    }
  }

  function lookAdjacentTiles(n) {

    if (canMove("up", n)) {
      var up = n - boardSize;
    }
    if (canMove("down", n)) {
      var down = n + boardSize;
    }
    if (canMove("left", n)) {
      var left = n - 1;
    }
    if (canMove("right", n)) {
      var right = n + 1;
    }

    // TODO: I feel like this can be cleaned up by looping through an array?
    if (left && isDestination(left)) {
      found = true;
    }
    if (left && !isInLookedTiles(left)) {
      lookedTiles.push(left);
    }
    if (right && isDestination(right)) {
      found = true;
    }
    if (right && !isInLookedTiles(right)) {
      lookedTiles.push(right);
    }
    if (up && isDestination(up)) {
      found = true;
    }
    if (up && !isInLookedTiles(up)) {
      lookedTiles.push(up);
    }
    if (down && isDestination(down)) {
      found = true;
    }
    if (down && !isInLookedTiles(down)) {
      lookedTiles.push(down);
    }
  }

  // put it all together
  return (function() {
    for (var i=0; i<boardSize*boardSize; i++) {
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

// TODO: replace this with separate functions for canMoveUp(), etc.
function canMove(direction, start) {

  var up = start - boardSize;
  var down = start + boardSize;
  var left = start - 1;
  var right = start + 1;

  // is this tile in the first/last row/column?
  var inFirstCol = getColFromTile(start) === 0;
  var inLastCol = getColFromTile(start) === boardSize - 1;
  var inFirstRow = getRowFromTile(start) === 0;
  var inLastRow = getRowFromTile(start) === boardSize - 1;

  if (direction === "up") {
    if (!inFirstRow && !isWall(up)) {
      return true;
    }
    else return false;
  }
  else if (direction === "down") {
    if (!inLastRow && !isWall(down)) {
      return true;
    }
    else return false;
  }
  else if (direction === "left") {
    if (!inFirstCol && !isWall(left)) {
      return true;
    }
    else return false;
  }
  else if (direction === "right") {
    if (!inLastCol && !isWall(right)) {
      return true;
    }
    else return false;
  }
  else {
    console.log("bad direction passed to canMove()");
  }
}

function advanceTurn() {
  turn++;
  ShipHunterFactory.forEachShipHunter (function () {
    this.pathfind();
  });
  HeroHunterFactory.forEachHeroHunter (function () {
    this.pathfind();
  });
  if (turn && turn % 4 === 0) {
    createRandomEnemy();
  }
  renderBoard();
}

function renderBoard() {
  // reset score contents
  scoreElement.innerHTML = '';
  if (health < 1) {
    scoreElement.innerHTML += "0";
  }
  else {
    scoreElement.innerHTML += health;
  }
  for (var i=0; i<boardSize-3; i++) {
    scoreElement.innerHTML += "&nbsp;";
  }
  if (score < 10) {
    scoreElement.innerHTML += "&nbsp;";
  }
  scoreElement.innerHTML += score;
  scoreElement.innerHTML += "<br><br>";

  // reset board contents
  boardElement.innerHTML = '';
  if (health < 1) {
    for (var i=0; i<boardSize; i++) {
      for (var j=0; j<boardSize; j++) {
        boardElement.innerHTML += "x";
      }
      boardElement.innerHTML += "<br>";
    }
  } else {
    for (var i=0; i<board.length; i++) {
      // for tiles that are populated, render their letters
      if (board[i].length) {
        boardElement.innerHTML += board[i][0].char;
      }
      // on even numbered turns, put '•' above and below hero A
      else if (turn % 2 === 0 && (i === heroA.getTile() - boardSize || i === heroA.getTile() + boardSize)) {
        boardElement.innerHTML += '•';
      }
      // on odd numbered turns, put '•' above and below hero B
      else if (i === heroB.getTile() - boardSize && (turn + 1) % 2 === 0 || i === heroB.getTile() + boardSize && (turn + 1) % 2 === 0) {
        boardElement.innerHTML += '•';
      }
      // on odd numbered turns, put '•' to the left and right of hero A
      else if ((turn + 1) % 2 === 0 && (i === heroA.getTile() - 1 && (i + 1) % boardSize !== 0 || i === heroA.getTile() + 1 && i % boardSize !== 0)) {
        boardElement.innerHTML += '•';
      }
      // on odd numbered turns, put '•' to the left and right of hero B
      else if (turn % 2 === 0 && (i === heroB.getTile() - 1 && (i + 1) % boardSize !== 0 || i === heroB.getTile() + 1 && i % boardSize !== 0)) {
        boardElement.innerHTML += '•';
      }
      // put '.' on empty tiles
      else if (board[i].length === 0) {
        boardElement.innerHTML += '.';
      }
      // insert line breaks
      if ((i + 1) % boardSize === 0) {
        boardElement.innerHTML += '<br>';
      }
    }
  }
  boardElement.innerHTML += "<br><br>";
}

function HeroHunter (name) {

  Enemy.call(this);
  this.char = "h";
  this.target = function() {
    var distA = (distanceFromTo(this.getTile(), heroA.getTile()));
    var distB = (distanceFromTo(this.getTile(), heroB.getTile()));
    if (distA < distB) {
      return heroA.getTile();
    }
    else {
      return heroB.getTile();
    }
  }

  this.die = function() {
    board[this.getTile()].splice(board[this.getTile])
    HeroHunterFactory.allHeroHunters.splice(HeroHunterFactory.allHeroHunters.indexOf(this),1);
    score++;
  }
}

HeroHunterFactory = {

  createHeroHunter: function () {
    var newHeroHunter = {};
    HeroHunter.apply(newHeroHunter, arguments);
    this.allHeroHunters.push(newHeroHunter);
    return newHeroHunter;
  },

  allHeroHunters: [],

  forEachHeroHunter: function (action) {
    for (var i = 0; i < this.allHeroHunters.length; i++){
      action.call(this.allHeroHunters[i]);
    }
  }
};

function ShipHunter (name) {

  Enemy.call(this);
  this.char = "s";
  this.target = function() {
    return ship.getTile();
  }

  this.die = function() {
    board[this.getTile()].splice(board[this.getTile])
    ShipHunterFactory.allShipHunters.splice(ShipHunterFactory.allShipHunters.indexOf(this),1);
    score++;
  }
}

ShipHunterFactory = {

  createShipHunter: function () {
    var newShipHunter = {};
    ShipHunter.apply(newShipHunter, arguments);
    this.allShipHunters.push(newShipHunter);
    return newShipHunter;
  },

  allShipHunters: [],

  forEachShipHunter: function (action) {
    for (var i = 0; i < this.allShipHunters.length; i++){
      action.call(this.allShipHunters[i]);
    }
  }
};

function Wall() {
  this.char = "#";
  this.solid = true;
this.type = "wall";
}

function generateWalls() {

  for (var i = 0; i < board.length; i++) {
    if (board[i][0] && board[i][0].char === '#') {
      board[i] = [];
    }
  }

  function isCorner(n) {
    var a = 0;
    var b = boardSize - 1;
    var c = boardSize * boardSize - boardSize;
    var d = boardSize * boardSize - 1;
    var corners = [a, b, c, d];

    for (var i = 0; i < corners.length; i++) {
      if (n === corners[i]) {
        return true;
      }
    }
  }

  for (var i=0; i<board.length; i++) {
    var flip = Math.floor(Math.random() * 8);
    if (flip < 1 && board[i].length === 0 && !isCorner(i)) {
      board[i][0] = new Wall();
    }
  }
  if (!isMapOpen()) {
    generateWalls();
    return;
  }
  renderBoard();
}

function isMapOpen() {
  var notWalls = [];

  for (var i = 0; i < board.length; i++) {
    if (!board[i].length || board[i][0].char !== '#') {
      notWalls.push(i);
    }
  }

  var numberOfWalls = board.length - notWalls.length;

  function isConnected(startTile) {
    lookedTiles = [];
    lookedTiles.push(startTile);

    function isInLookedTiles(n) {
      for (var i=0; i<lookedTiles.length; i++) {
        if (lookedTiles[i] === n) {
          return true;
        }
      }
    }

    function lookAdjacentTiles(n) {

      if (getColFromTile(n) > 0 && !isWall(n-1)) {
        var l = n - 1;
      }
      if (getColFromTile(n) < boardSize - 1 && !isWall(n+1)) {
        var r = n + 1;
      }
      if (getRowFromTile(n) > 0 && !isWall(n-boardSize)) {
        var t = n - boardSize;
      }
      if (getRowFromTile(n) < boardSize - 1 && !isWall(n+boardSize)) {
        var b = n + boardSize;
      }
      if (!isInLookedTiles(l)) {
        lookedTiles.push(l);
      }
      if (!isInLookedTiles(r)) {
        lookedTiles.push(r);
      }
      if (!isInLookedTiles(t)) {
        lookedTiles.push(t);
      }
      if (!isInLookedTiles(b)) {
        lookedTiles.push(b);
      }
    }

    for (var i = 0; i < board.length; i++) {
      var temp = lookedTiles.length;
      for (var j = 0; j < temp; j++) {
        lookAdjacentTiles(lookedTiles[j]);
      }
    }

    return lookedTiles.length + numberOfWalls === board.length + 1;
  }

  var good = true;

  // for (var i = 0; i < notWalls.length; i++) {
  if (!isConnected(notWalls[0])) {
    good = false;
  }
  // }

  return good;
}

function Enemy (name) {

  Item.call(this);
  this.name = name;
  this.char = "e";
  this.type = "enemy";
  this.target = function() {
    return;
  }

  this.setTile = function(n) {
    if (board[n][0] && board[n][0].hasHealth) {
      health--;
    }
    else if (board[n][0] && board[n][0].solid) {
      return true;
    }
    else {
      board[this.getTile()].pop(this);
      board[n].push(this);
    }
  }

  // to be used like this, for example: hero.moveWithOption("moveRight", "moveDown")
  this.moveWithOption = function(array) {
    option = Math.floor(Math.random() * array.length);
    this[array[option]]();
  }

  this.pathfind = function() {

    // the 5 relevant tiles
    var here = this.getTile();
    var up = here - boardSize;
    var down = here + boardSize;
    var left = here - 1;
    var right = here + 1;

    // this array will be populated with moves that will advance toward the target
    var validMoves = [];

    // TODO: put this in a function isLeftCloser(), etc.
    if (canMove("up", here) && distanceFromTo(up, this.target()) < distanceFromTo(here, this.target())) {
      validMoves.push("moveUp");
    }
    if (canMove("down", here) && distanceFromTo(down, this.target()) < distanceFromTo(here, this.target())) {
      validMoves.push("moveDown");
    }
    if (canMove("left", here) && distanceFromTo(left, this.target()) < distanceFromTo(here, this.target())) {
      validMoves.push("moveLeft");
    }
    if (canMove("right", here) && distanceFromTo(right, this.target()) < distanceFromTo(here, this.target())) {
      validMoves.push("moveRight");
    }

    this.moveWithOption(validMoves);
  }

  this.die = function() {
    board[this.getTile()].splice(board[this.getTile])
    EnemyFactory.allEnemies.splice(EnemyFactory.allEnemies.indexOf(this),1);
    score++;
  }
}

EnemyFactory = {

  createEnemy: function () {
    var newEnemy = {};
    Enemy.apply(newEnemy, arguments);
    this.allEnemies.push(newEnemy);
    return newEnemy;
  },

  allEnemies: [],

  forEachEnemy: function (action) {
    for (var i = 0; i < this.allEnemies.length; i++){
      action.call(this.allEnemies[i]);
    }
  }
};

function Hero() {

  Item.call(this);
  this.hasHealth = true;

  this.setTile = function(n) {
    if (board[n][0] && board[n][0].type === "enemy") {
      board[n][0].die();
    }
    // TODO: need a isValidMovementTile() function;
    else if (!board[n][0] || board[n][0].type !== "wall") {
      board[this.getTile()].pop(this);
      board[n].push(this);
    }
  }
}

var heroA = new Hero();
var heroB = new Hero();
heroA.char = 'a';
heroB.char = 'b';

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
      boardSize - 1,
      boardSize * boardSize - 1,
      boardSize * boardSize - boardSize,
    ];
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
    for (var i=0; i<boardSize; i++) {
      if ((this.getTile() - i) % boardSize === 0) {
        return i;
      }
    }
  }

  this.getRow = function() {
    for (var i=1; i<=boardSize; i++) {
      if (this.getTile() < boardSize * i) {
        return i - 1;
      }
    }
  }

  this.setTile = function(n) {
    board[this.getTile()].pop(this);
    board[n].push(this);
  }

  this.moveRight = function() {
    if (this.getCol() < boardSize - 1) {
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
      this.setTile(this.getTile() - boardSize);
      return true;
    }
  }

  this.moveDown = function() {
    if (this.getRow() < boardSize - 1) {
      this.setTile(this.getTile() + boardSize);
      return true;
    }
  }
}

function Ship() {

  Item.call(this);

  this.deployToCenterTile = function() {
    destination = Math.floor(boardSize * boardSize / 2);
    board[destination].push(this);
  }

  this.char = '∆';
  this.solid = true;
  this.hasHealth = true;
}

var ship = new Ship();

window.addEventListener("load", function() {

  ship.deployToCenterTile();
  heroA.deployToRandomEmptyTile();
  heroB.deployToRandomEmptyTile();
  createRandomEnemy();
  generateWalls();
  renderBoard();

  document.onkeydown = checkKey;
  function checkKey(e) {

    e = e || window.event;
    var key = e.keyCode;
    var left = "37";
    var up = "38";
    var right = "39";
    var down = "40";

    // even turns
    if (turn % 2 === 0) {
      // heroA
      if (key == up) {
        if (canMove("up", heroA.getTile())) {
          heroA.moveUp();
          advanceTurn();
        }
      }
      else if (key == down) {
        if (canMove("down", heroA.getTile())) {
          heroA.moveDown();
          advanceTurn();
        }
      }
      // heroB
      else if (key == left) {
        if (canMove("left", heroB.getTile())) {
          heroB.moveLeft();
          advanceTurn();
        }
      }
      else if (key == right) {
        if (canMove("right", heroB.getTile())) {
          heroB.moveRight();
          advanceTurn();
        }
      }
    }

    // odd turns
    else if (turn % 2 === 1) {
      // heroB
      if (key == up) {
        if (canMove("up", heroB.getTile())) {
          heroB.moveUp();
          advanceTurn();
        }
      }
      else if (key == down) {
        if (canMove("down", heroB.getTile())) {
          heroB.moveDown();
          advanceTurn();
        }
      }
      // heroA
      else if (key == left) {
        if (canMove("left", heroA.getTile())) {
          heroA.moveLeft();
          advanceTurn();
        }
      }
      else if (key == right) {
        if (canMove("right", heroA.getTile())) {
          heroA.moveRight();
          advanceTurn();
        }
      }
    }
  }
});
