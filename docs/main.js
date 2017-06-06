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

function colFromTile(n) {
  for (var i=0; i<boardSize; i++) {
    if ((n - i) % boardSize === 0) {
      return i;
    }
  }
}

function rowFromTile(n) {
  for (var i=0; i<boardSize; i++) {
    if (n < boardSize * (i + 1)) {
      return i;
    }
  }
}

// assumes walls are the only solid object
// right now this function is used in testing valid move destinations,
// so targets like enemies, heroes, and ships can't be solid.
function isWall(n) {
  return board[n].length > 0 && typeof board[n][0]["solid"] !== "undefined"
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
    if(!this.tile()) {
      this.deployToRandomEmptyEdge();
    }
  });
  HeroHunterFactory.forEachHeroHunter (function () {
    if(!this.tile()) {
      this.deployToRandomEmptyEdge();
    }
  });
}

function isAdjacent(a, b) {

  // is a tile in the first/last row/column?
  var inFirstCol = colFromTile(a) === 0;
  var inLastCol = colFromTile(a) === boardSize - 1;
  var inFirstRow = rowFromTile(a) === 0;
  var inLastRow = rowFromTile(a) === boardSize - 1;
  var adjacentTiles = [];
  var adjacent = false;

  if (!inFirstCol) {
    adjacentTiles.push(a - 1);
  }
  if (!inLastCol) {
    adjacentTiles.push(a + 1);
  }
  if (!inFirstRow) {
    adjacentTiles.push(a - boardSize);
  }
  if (!inLastRow) {
    adjacentTiles.push(a + boardSize);
  }

  for (var i = 0; i < adjacentTiles.length; i++) {
    if (b === adjacentTiles[i]) {
      adjacent = true;
    }
  }

  return adjacent;
}

function advanceTurn() {
  turn++;
  ShipHunterFactory.forEachShipHunter (function () {
    this.pathfind();
  });
  HeroHunterFactory.forEachHeroHunter (function () {
    this.pathfind();
  });
  if (turn && turn % 8 === 0) {
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
      else if (turn % 2 === 0 && (i === heroA.tile() - boardSize || i === heroA.tile() + boardSize)) {
        boardElement.innerHTML += '•';
      }
      // on odd numbered turns, put '•' above and below hero B
      else if (i === heroB.tile() - boardSize && (turn + 1) % 2 === 0 || i === heroB.tile() + boardSize && (turn + 1) % 2 === 0) {
        boardElement.innerHTML += '•';
      }
      // on odd numbered turns, put '•' to the left and right of hero A
      else if ((turn + 1) % 2 === 0 && (i === heroA.tile() - 1 && (i + 1) % boardSize !== 0 || i === heroA.tile() + 1 && i % boardSize !== 0)) {
        boardElement.innerHTML += '•';
      }
      // on odd numbered turns, put '•' to the left and right of hero B
      else if (turn % 2 === 0 && (i === heroB.tile() - 1 && (i + 1) % boardSize !== 0 || i === heroB.tile() + 1 && i % boardSize !== 0)) {
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
  this.avoids = ["wall", "ship", "enemy", "fuel"];
  this.target = function() {
    var distA = (this.distanceFromTo(this.tile(), heroA.tile()));
    var distB = (this.distanceFromTo(this.tile(), heroB.tile()));
    if (distA < distB) {
      return heroA.tile();
    }
    else {
      return heroB.tile();
    }
  }

  this.die = function() {
    board[this.tile()].splice(board[this.tile])
    HeroHunterFactory.allHeroHunters.splice(HeroHunterFactory.allHeroHunters.indexOf(this),1);
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
  this.avoids = ["wall", "hero", "enemy", "fuel"];
  this.target = function() {
    return ship.tile();
  }

  this.die = function() {
    board[this.tile()].splice(board[this.tile])
    ShipHunterFactory.allShipHunters.splice(ShipHunterFactory.allShipHunters.indexOf(this),1);
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
    else {
      board[this.tile()].pop(this);
      board[n].push(this);
    }
  }

  // to be used like this, for example: hero.moveWithOption("moveRight", "moveDown")
  this.moveWithOption = function(array) {
    option = Math.floor(Math.random() * array.length);
    this[array[option]]();
  }

  this.moveRandomly = function() {
    var here = this.tile();
    var randomMoves = [];
    if (this.canMove("up", here)) {
      randomMoves.push("moveUp");
    }
    if (this.canMove("down", here)) {
      randomMoves.push("moveDown");
    }
    if (this.canMove("left", here)) {
      randomMoves.push("moveLeft");
    }
    if (this.canMove("right", here)) {
      randomMoves.push("moveRight");
    }
    this.moveWithOption(randomMoves);
  }

  this.pathfind = function() {

    // the 5 relevant tiles
    var here = this.tile();
    var up = here - boardSize;
    var down = here + boardSize;
    var left = here - 1;
    var right = here + 1;

    // this array will be populated with moves that will advance toward the target
    var validMoves = [];

    if (this.canMove("up", here) && this.distanceFromTo(up, this.target()) < this.distanceFromTo(here, this.target())) {
      validMoves.push("moveUp");
    }
    if (this.canMove("down", here) && this.distanceFromTo(down, this.target()) < this.distanceFromTo(here, this.target())) {
      validMoves.push("moveDown");
    }
    if (this.canMove("left", here) && this.distanceFromTo(left, this.target()) < this.distanceFromTo(here, this.target())) {
      validMoves.push("moveLeft");
    }
    if (this.canMove("right", here) && this.distanceFromTo(right, this.target()) < this.distanceFromTo(here, this.target())) {
      validMoves.push("moveRight");
    }

    if (validMoves.length) {
      this.moveWithOption(validMoves);
    }
    else {
      this.moveRandomly();
    }
  }

  this.die = function() {
    board[this.tile()].splice(board[this.tile])
    EnemyFactory.allEnemies.splice(EnemyFactory.allEnemies.indexOf(this),1);
  }
}

function Fuel() {

  Item.call(this);
  this.char = "f";
  this.type = "fuel";

  this.deploy = function() {

    var emptyTiles = [];
    var farTiles = [];
    var otherFuelTile;
    var realFarTiles = [];
    var shipTile = ship.tile();

    for (var i = 0; i < board.length; i++) {
      if (!board[i].length) {
        emptyTiles.push(i);
      }
      else if (board[i][0].type === "fuel") {
        otherFuelTile = i;
      }
    }

    for (var j = 0; j < emptyTiles.length; j++) {
      if (this.distanceFromTo(shipTile, emptyTiles[j]) === 6) {
        farTiles.push(emptyTiles[j]);
      }
    }

    if (otherFuelTile) {
      for (var k = 0; k < farTiles.length; k++) {
        if (this.distanceFromTo(otherFuelTile, farTiles[k]) > 9) {
          realFarTiles.push(farTiles[k]);
        }
      }
      board[realFarTiles[Math.floor(Math.random()*realFarTiles.length)]].push(this);
    } else {
      board[farTiles[Math.floor(Math.random()*farTiles.length)]].push(this);
    }
  }

  this.destroy = function() {
    board[this.tile()].splice(board[this.tile]);
    score++;
  }
}

var fuelA = new Fuel();
var fuelB = new Fuel();

function Hero() {

  Item.call(this);
  this.hasHealth = true;
  this.avoids = ["wall", "ship"];
  this.type = "hero";

  this.setTile = function(n) {

    if (player.moveThroughWalls) {
      this.avoids = ["ship"];
    }

    if (board[n][0] && board[n][0].type === "enemy") {
      board[n][0].die();
    }

    else if (player.moveThroughWalls && this.moveThroughWalls(n)) {
      return
    }

    else if (player.lunge && this.lunge(n)) {
      return
    }

    else if (board[n][0] && board[n][0].type === "fuel") {
      board[n][0].destroy();
      board[this.tile()].pop(this);
      board[n].push(this);
    }

    else if (!this.shouldAvoid(n)) {
      board[this.tile()].pop(this);
      board[n].push(this);
    }

    if (score === 2) {
      this.avoids = ["wall"];
    }
  }

  this.lunge = function(n) {

    var here = this.tile();

    if (n === here - boardSize && isAdjacent(n, n - boardSize)) {
      var target = n - boardSize;
    }
    else if (n === here + boardSize && isAdjacent(n, n + boardSize)) {
      var target = n + boardSize;
    }
    else if (n === here + 1 && isAdjacent(n, n + 1)) {
      var target = n + 1;
    }
    else if (n === here - 1 && isAdjacent(n, n - 1)) {
      var target = n - 1;
    }

    if (target) {
      if (board[target][0] && board[target][0].type === "enemy") {
        board[target][0].die();
        board[this.tile()].pop(this);
        board[n].push(this);
        return true;
      }
    }
    else return false;
  }

  this.moveThroughWalls = function(n) {

    var here = this.tile();

    if (n === here - boardSize && isAdjacent(n, n - boardSize)) {
      var target = n - boardSize;
    }
    else if (n === here + boardSize && isAdjacent(n, n + boardSize)) {
      var target = n + boardSize;
    }
    else if (n === here + 1 && isAdjacent(n, n + 1)) {
      var target = n + 1;
    }
    else if (n === here - 1 && isAdjacent(n, n - 1)) {
      var target = n - 1;
    }

    if (board[n][0] && board[n][0].type === "wall") {
      this.setTile(target);
      return true;
    }
    else return false;
  }

  this.deployNearShip = function() {
    var here = ship.tile();
    var up = here - boardSize;
    var down = here + boardSize;
    var left = here - 1;
    var right = here + 1;
    var upLeft = up - 1;
    var upRight = up + 1;
    var downLeft = down - 1;
    var downRight = down + 1;
    var nearShip = [up, down, left, right, upLeft, upRight, downLeft, downRight];
    var nearShipAndEmpty = [];

    for (var i = 0; i < nearShip.length; i++) {
      if (!board[nearShip[i]].length) {
        nearShipAndEmpty.push(nearShip[i]);
      }
    }

    board[nearShipAndEmpty[Math.floor(Math.random()*nearShipAndEmpty.length)]].push(this);
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

  this.deployToRandomEmptyEdge = function() {

    var edges = [];
    for (var i = 0; i < board.length; i++) {
      if (
        colFromTile(i) === 0 ||
        colFromTile(i) === boardSize - 1 ||
        rowFromTile(i) === 0 ||
        rowFromTile(i) === boardSize - 1
      ) {
        edges.push(i);
      }
    }

    var emptyEdges = [];
    for (var i = 0; i < edges.length; i++) {
      if (board[edges[i]].length === 0) {
        emptyEdges.push(board[edges[i]]);
      }
    }

    emptyEdges[Math.floor(Math.random()*emptyEdges.length)].push(this);
  }

  this.tile = function() {
    for (var i = 0; i<board.length; i++) {
      for (var j = 0; j<board[i].length; j++) {
        if (board[i][j] == this) {
          return i;
        }
      }
    }
  }

  this.col = function() {
    for (var i=0; i<boardSize; i++) {
      if ((this.tile() - i) % boardSize === 0) {
        return i;
      }
    }
  }

  this.row = function() {
    for (var i=1; i<=boardSize; i++) {
      if (this.tile() < boardSize * i) {
        return i - 1;
      }
    }
  }

  this.setTile = function(n) {
    board[this.tile()].pop(this);
    board[n].push(this);
  }

  this.moveRight = function() {
    if (this.col() < boardSize - 1) {
      this.setTile(this.tile() + 1);
      return true;
    }
  }

  this.moveLeft = function() {
    if (this.col() > 0) {
      this.setTile(this.tile() - 1);
      return true;
    }
  }

  this.moveUp = function() {
    if (this.row() > 0) {
      this.setTile(this.tile() - boardSize);
      return true;
    }
  }

  this.moveDown = function() {
    if (this.row() < boardSize - 1) {
      this.setTile(this.tile() + boardSize);
      return true;
    }
  }

  this.shouldAvoid = function(n) {

    var avoid = false;
    if (this.avoids) {
      for (var i = 0; i < this.avoids.length; i++) {
        if (board[n][0] && board[n][0].type === this.avoids[i]) {
          avoid = true;
        }
      }
    }
    return avoid;
  }

  // TODO: replace this with separate functions for canMoveUp(), etc.
  this.canMove = function(direction, start) {

    var up = start - boardSize;
    var down = start + boardSize;
    var left = start - 1;
    var right = start + 1;

    if (direction === "up") {
      if (isAdjacent(start, up) && !this.shouldAvoid(up)) {
        return true;
      }
      else return false;
    }
    else if (direction === "down") {
      if (isAdjacent(start, down) && !this.shouldAvoid(down)) {
        return true;
      }
      else return false;
    }
    else if (direction === "left") {
      if (isAdjacent(start, left) && !this.shouldAvoid(left)) {
        return true;
      }
      else return false;
    }
    else if (direction === "right") {
      if (isAdjacent(start, right) && !this.shouldAvoid(right)) {
        return true;
      }
      else return false;
    }
    else {
      console.log("bad direction passed to canMove()");
    }
  }

  // measures distance to between two tiles
  this.distanceFromTo = function(start, end) {
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

    // put it all together
    for (var i=0; i<boardSize*boardSize; i++) {
      var temp = lookedTiles.length;
      for (var j=0; j<temp; j++) {

        if (this.canMove("up", lookedTiles[j])) {
          var up = lookedTiles[j] - boardSize;
        }
        if (this.canMove("down", lookedTiles[j])) {
          var down = lookedTiles[j] + boardSize;
        }
        if (this.canMove("left", lookedTiles[j])) {
          var left = lookedTiles[j] - 1;
        }
        if (this.canMove("right", lookedTiles[j])) {
          var right = lookedTiles[j] + 1;
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
      steps++;
      if (found === true) {
        return steps;
      }
    }
  }
}

function Player() {

  // abilities
  this.lunge = true;
  this.moveThroughWalls = true;
}

var player = new Player();

function Ship() {

  Item.call(this);
  this.char = "∆";
  this.hasHealth = true;
  this.type = "ship";

  this.deployToCenterTile = function() {
    destination = Math.floor(boardSize * boardSize / 2);
    board[destination].push(this);
  }
}

var ship = new Ship();

function Wall() {

  Item.call(this);
  this.char = "#";
  this.solid = true;
  this.type = "wall";

  this.destroy = function() {
    board[this.tile()].splice(board[this.tile])
  }
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

  function clearNearShip() {

    var here = ship.tile();
    var up = here - boardSize;
    var down = here + boardSize;
    var left = here - 1;
    var right = here + 1;
    var upLeft = up - 1;
    var upRight = up + 1;
    var downLeft = down - 1;
    var downRight = down + 1;
    var nearShip = [up, down, left, right, upLeft, upRight, downLeft, downRight];

    for (var i = 0; i < nearShip.length; i++) {
      if (isWall(nearShip[i])) {
        board[nearShip[i]][0].destroy();
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
  }

  clearNearShip();
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

      if (colFromTile(n) > 0 && !isWall(n-1)) {
        var l = n - 1;
      }
      if (colFromTile(n) < boardSize - 1 && !isWall(n+1)) {
        var r = n + 1;
      }
      if (rowFromTile(n) > 0 && !isWall(n-boardSize)) {
        var t = n - boardSize;
      }
      if (rowFromTile(n) < boardSize - 1 && !isWall(n+boardSize)) {
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

window.addEventListener("load", function() {

  ship.deployToCenterTile();
  heroA.deployNearShip();
  heroB.deployNearShip();
  fuelA.deploy();
  fuelB.deploy();
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
        if (heroA.canMove("up", heroA.tile())) {
          heroA.moveUp();
          advanceTurn();
        }
      }
      else if (key == down) {
        if (heroA.canMove("down", heroA.tile())) {
          heroA.moveDown();
          advanceTurn();
        }
      }
      // heroB
      else if (key == left) {
        if (heroB.canMove("left", heroB.tile())) {
          heroB.moveLeft();
          advanceTurn();
        }
      }
      else if (key == right) {
        if (heroB.canMove("right", heroB.tile())) {
          heroB.moveRight();
          advanceTurn();
        }
      }
    }

    // odd turns
    else if (turn % 2 === 1) {
      // heroB
      if (key == up) {
        if (heroB.canMove("up", heroB.tile())) {
          heroB.moveUp();
          advanceTurn();
        }
      }
      else if (key == down) {
        if (heroB.canMove("down", heroB.tile())) {
          heroB.moveDown();
          advanceTurn();
        }
      }
      // heroA
      else if (key == left) {
        if (heroA.canMove("left", heroA.tile())) {
          heroA.moveLeft();
          advanceTurn();
        }
      }
      else if (key == right) {
        if (heroA.canMove("right", heroA.tile())) {
          heroA.moveRight();
          advanceTurn();
        }
      }
    }
  }
});
