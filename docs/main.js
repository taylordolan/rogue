var board = [];
var boardElement = document.getElementsByClassName("board")[0];
var boardSize = 9;
var collectedFuel = 0;
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

function isEnemy(n) {
  return board[n].length > 0 && typeof board[n][0]["type"] !== "undefined" && board[n][0]["type"] === "enemy";
}

function isWall(n) {
  return board[n].length > 0 && typeof board[n][0]["type"] !== "undefined" && board[n][0]["type"] === "wall";
}

function upFrom(n) {
  if (isAdjacent(n, n - boardSize)) {
    return n - boardSize;
  }
}

function downFrom(n) {
  if (isAdjacent(n, n + boardSize)) {
    return n + boardSize;
  }
}

function leftFrom(n) {
  if (isAdjacent(n, n - 1)) {
    return n - 1;
  }
}

function rightFrom(n) {
  if (isAdjacent(n, n + 1)) {
    return n + 1;
  }
}

function createRandomEnemy() {
  if (Math.floor(Math.random()) * 2) {
    HunterFactory.createHunter();
  }
  else {
    ShooterFactory.createShooter();
  }
  HunterFactory.forEachHunter (function () {
    if(!this.tile()) {
      this.deployToRandomEmptyEdge();
    }
  });
  ShooterFactory.forEachShooter (function () {
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

function getAdvanceRate() {
  switch (level) {
    case 1:
    return 5;
    break;
    case 2:
    return 4;
    break;
    case 3:
    return 3;
    break;
    case 4:
    return 2;
    case 4:
    return 1;
    break;
  }
}

function deployAdvanceTiles() {
  for (var i = 0; i < board.length; i++) {
    if (isInTile(i, "advanceTile")) {
      isInTile(i, "advanceTile").destroy();
    }
  }

  var tileA = new AdvanceTile();
  var tileB = new AdvanceTile();

  tileA.deployToRandomTile();
  tileB.deployToRandomTile();

  if (tileA.distanceFromTo(tileA.tile(), tileB.tile()) < tileA.minDistance) {
    deployAdvanceTiles();
  }
  else return;
}

function advanceTurn() {
  turn++;
  HunterFactory.forEachHunter (function () {
    this.pathfind();
  });
  ShooterFactory.forEachShooter (function () {
    this.pathfind();
  });
  if (turn && turn % getAdvanceRate() === 0) {
    createRandomEnemy();
  }
  render();
}

function advanceLevel() {
  level++;
  generateWalls();
  // new Fuel().deployToEmptyCorner();
  // new AdvanceTile().deployToRandomTile();
  // new AdvanceTile().deployToRandomTile();
  deployAdvanceTiles();
  render();
}

function isInTile(tile, type) {
  for (var i = 0; i < board[tile].length; i++) {
    if (board[tile][i].type == type) {
      return board[tile][i];
    }
  }
  return false;
}

function removeFromArray(array, value) {
  if (array.indexOf(value) !== -1) {
    array.splice(array.indexOf(value), 1);
  }
}

function setUpBoard() {
  for (var i = 0; i < board.length; i++) {
    boardElement.innerHTML += "<span class='tile' data-id='" + i + "'></span>"
    if ((i + 1) % boardSize === 0) {
      boardElement.innerHTML += "<br>";
    }
  }
  tileElements = boardElement.querySelectorAll("[data-id]");
  healthElement = document.createElement("span");
  healthElement.classList.add("health");
  boardElement.appendChild(healthElement);
}

function getElement(tile) {
  for (var i = 0; i < tileElements.length; i++) {
    if (tileElements[i].getAttribute("data-id") == tile) {
      return tileElements[i];
    }
  }
}

function renderHealth() {
  healthElement.innerHTML = "";
  for (var i = 0; i < health; i++) {
    healthElement.innerHTML += "❤️";
  }
  healthElement.innerHTML += "<br>";
}

function render() {
  for (var i = 0; i < tileElements.length; i++) {
    tileElements[i].innerHTML = "";
    if (i === heroA.tile()) {
      var span = document.createElement("span");
      span.innerHTML = isInTile(i, "hero").char;
      span.classList.add("hero-a");
      tileElements[i].appendChild(span);
    }
    else if (i === heroB.tile()) {
      var span = document.createElement("span");
      span.innerHTML = isInTile(i, "hero").char;
      span.classList.add("hero-b");
      tileElements[i].appendChild(span);
    }
    else if (isInTile(i, "wall")) {
      var span = document.createElement("span");
      span.innerHTML = isInTile(i, "wall").char;
      tileElements[i].appendChild(span);
    }
    else if (isInTile(i, "enemy")) {
      var span = document.createElement("span");
      span.innerHTML = isInTile(i, "enemy").char;
      tileElements[i].appendChild(span);
    }
    else if (isInTile(i, "advanceTile")) {
      var span = document.createElement("span");
      span.innerHTML = isInTile(i, "advanceTile").char;
      tileElements[i].appendChild(span);
    }
    else {
      var span = document.createElement("span");
      span.innerHTML = "·";
      tileElements[i].appendChild(span);
    }
    if (isInTile(i, "blue")) {
      tileElements[i].classList.add("blue");
    }
    if (isInTile(i, "red")) {
      tileElements[i].classList.add("red");
    }
    if (isInTile(i, "green")) {
      tileElements[i].classList.add("green");
    }
    if (isInTile(i, "web")) {
      var span = document.createElement("span");
      span.innerHTML = isInTile(i, "web").char;
      tileElements[i].appendChild(span);
    }
  }

  var heroATile = getElement(heroA.tile());
  var heroBTile = getElement(heroB.tile());
  var heroAElement = heroATile.children[0];
  var heroBElement = heroBTile.children[0];

  if (turn % 2 === 0) {
    if (heroA.canMove("up", heroA.tile())) {
      heroAElement.classList.add("up");
    }
    if (heroA.canMove("down", heroA.tile())) {
      heroAElement.classList.add("down");
    }
    if (heroB.canMove("left", heroB.tile())) {
      heroBElement.classList.add("left");
    }
    if (heroB.canMove("right", heroB.tile())) {
      heroBElement.classList.add("right");
    }
  }
  if ((turn + 1) % 2 === 0) {
    if (heroB.canMove("up", heroB.tile())) {
      heroBElement.classList.add("up");
    }
    if (heroB.canMove("down", heroB.tile())) {
      heroBElement.classList.add("down");
    }
    if (heroA.canMove("left", heroA.tile())) {
      heroAElement.classList.add("left");
    }
    if (heroA.canMove("right", heroA.tile())) {
      heroAElement.classList.add("right");
    }
  }

  renderHealth();
}

function AdvanceTile() {

  Item.call(this);
  this.char = "O";
  this.avoids = ["wall"];
  this.type = "advanceTile";

  this.minDistance = 4;

  this.deployToTile = function(tile) {
    board[tile].push(this);
  }

  this.deployToRandomTile = function() {
    // var otherAdvanceTileExists = false;
    // var validDestinations = [];

    // for (var i = 0; i < board.length(); i++) {
    //   if (!board[i].length) {
    //     validDestinations.push(i);
    //   }
    //   if (isInTile(i, "advanceTile")) {
    //     otherAdvanceTileExists = true;
    //   }
    // }

    // if (otherAdvanceTileExists) {
    //   for (validDestinations.length)
    // }

    var destination;
    do {
      destination = Math.floor(Math.random() * board.length);
    } while (board[destination].length || heroA.distanceFromTo(heroA.tile(), destination) < this.minDistance || heroB.distanceFromTo(heroB.tile(), destination) < this.minDistance);
    this.deployToTile(destination);
  }

  this.destroy = function() {
    removeFromArray(board[this.tile()], this);
  }
}

function Blue() {

  Item.call(this);
  this.avoids = ["wall"];
  this.type = "blue";

  this.deployToTile = function(tile) {
    board[tile].push(this);
  }
}

function Red() {

  Item.call(this);
  this.avoids = ["wall"];
  this.type = "red";

  this.deployToTile = function(tile) {
    board[tile].push(this);
  }
}

function Green() {

    Item.call(this);
    this.avoids = ["wall"];
    this.type = "green";

    this.deployToTile = function(tile) {
      board[tile].push(this);
    }
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
    if (n == heroA.tile() && !isInTile(heroB.tile(), "green") || n == heroB.tile() && !isInTile(heroA.tile(), "green")) {
      health--;
    }
    else if (isInTile(n, "web")) {
      this.die();
      isInTile(n, "web").destroy();
    }
    else {
      removeFromArray(board[this.tile()], this);
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

    if (this.shoots) {
      var validTargets = [];
      if (this.canShoot(heroA)) {
        validTargets.push(heroA);
      }
      if (this.canShoot(heroB)) {
        validTargets.push(heroB);
      }
      if (validTargets.length) {
        health--;
      }
    }

    // the 5 relevant tiles
    var here = this.tile();
    var up = here - boardSize;
    var down = here + boardSize;
    var left = here - 1;
    var right = here + 1;

    if (isInTile(here, "web")) {
      isInTile(here, "web").destroy();
      return;
    }

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
      // this.moveRandomly();
      return;
    }
  }

  this.canShoot = function() {

    // if target is left of enemy
    // if (target.col() === this.col() && target.tile() < this.tile()) {
    var n = leftFrom(this.tile());
    while (!isInTile(n, "wall") && !isInTile(n, "enemy") && !isInTile(n, "hero")) {
      if (isAdjacent(n, leftFrom(n))) {
        n = leftFrom(n);
      }
      else {
        break;
      }
    }
    if (isInTile(n, "hero")) {
      return isInTile(n, "hero").tile();
    }
    // }
    return false;
  }
}

function Fuel() {

  Item.call(this);
  this.char = "f";
  this.avoids = ["wall"];
  this.type = "fuel";

  this.deployToTile = function(tile) {
    board[tile].push(this);
  }

  this.deployToEmptyCorner = function() {
    var emptyCorners = [];
    console.log(corners);
    for (var i = 0; i < corners.length; i++) {
      if (!board[corners[i]].length) {
        emptyCorners.push(corners[i]);
        console.log(emptyCorners);
      }
    }
    var destination = emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
    console.log(destination);
    this.deployToTile(destination);
  }

  this.destroy = function() {
    collectedFuel++;
    removeFromArray(board[this.tile()], this);
    advanceLevel();
  }
}

function Hero() {

  Item.call(this);
  this.avoids = ["wall", "hero"];
  this.type = "hero";

  this.setTile = function(n) {

    if (isInTile(this.friend.tile(), "blue")) {

      if (n === upFrom(this.tile())) {
        var d = "up";
      }
      else if (n === downFrom(this.tile())) {
        var d = "down";
      }
      else if (n === leftFrom(this.tile())) {
        var d = "left";
      }
      else if (n === rightFrom(this.tile())) {
        var d = "right";
      }
      if (this.shoot(d, n)) {
        return;
      }
    }

    if (isInTile(this.friend.tile(), "red") && !isInTile(this.tile(), "web")) {
      new Web().deploy(this.tile());
    }

    if (isInTile(n, "enemy")) {
      isInTile(n, "enemy").die();
      if (isInTile(n, "web")) {
        isInTile(n, "web").destroy();
      }
    }

    else if (isInTile(n, "fuel")) {
      removeFromArray(board[this.tile()], this);
      board[n].push(this);
      isInTile(n, "fuel").destroy();
    }

    else if (!this.shouldAvoid(n)) {
      removeFromArray(board[this.tile()], this);
      board[n].push(this);
    }

    if (isInTile(heroA.tile(), "advanceTile") && isInTile(heroB.tile(), "advanceTile")) {
      isInTile(heroA.tile(), "advanceTile").destroy();
      isInTile(heroB.tile(), "advanceTile").destroy();
      advanceLevel();
    }
  }

  this.shoot = function(direction, n) {

    if (direction === "up") {
      while (!isInTile(n, "wall") && !isInTile(n, "enemy") && !isInTile(n, "hero")) {
        if (isAdjacent(n, upFrom(n))) {
          n = upFrom(n);
        }
        else {
          break;
        }
      }
    }
    if (direction === "down") {
      while (!isInTile(n, "wall") && !isInTile(n, "enemy") && !isInTile(n, "hero")) {
        if (isAdjacent(n, downFrom(n))) {
          n = downFrom(n);
        }
        else {
          break;
        }
      }
    }
    if (direction === "left") {
      while (!isInTile(n, "wall") && !isInTile(n, "enemy") && !isInTile(n, "hero")) {
        if (isAdjacent(n, leftFrom(n))) {
          n = leftFrom(n);
        }
        else {
          break;
        }
      }
    }
    if (direction === "right") {
      while (!isInTile(n, "wall") && !isInTile(n, "enemy") && !isInTile(n, "hero")) {
        if (isAdjacent(n, rightFrom(n))) {
          n = rightFrom(n);
        }
        else {
          break;
        }
      }
    }
    if (isInTile(n, "enemy")) {
      isInTile(n, "enemy").die();
      return true;
    }
    else {
      return false;
    }
  }

  this.deployToTile = function(tile) {
    board[tile].push(this);
  }
}

var heroA = new Hero();
var heroB = new Hero();
heroA.char = "a";
heroA.friend = heroB;
heroB.char = "b";
heroB.friend = heroA;

Array.min = function( array ){
  return Math.min.apply( Math, array );
};

function Hunter() {

  Enemy.call(this);
  this.char = "h";
  this.avoids = ["wall", "enemy"];
  this.target = function() {
    var distHeroA = (this.distanceFromTo(this.tile(), heroA.tile()));
    var distHeroB = (this.distanceFromTo(this.tile(), heroB.tile()));
    var distances = [distHeroA, distHeroB];
    var shortest = Array.min(distances);
    var closest = [];

    if (distHeroA === shortest) {
      closest.push(heroA.tile());
    }
    if (distHeroB === shortest) {
      closest.push(heroB.tile());
    }

    return closest[Math.floor(Math.random() * closest.length)];
  }

  this.die = function() {
    switch (Math.floor(Math.random() * 3)) {
      case 0:
        new Blue().deployToTile(this.tile());
        break;
      case 1:
        new Red().deployToTile(this.tile());
        break;
      case 2:
        new Green().deployToTile(this.tile());
        break;
    }

    removeFromArray(board[this.tile()], this);
    removeFromArray(HunterFactory.allHunters, this);
  }
}

HunterFactory = {

  createHunter: function () {
    var newHunter = {};
    Hunter.apply(newHunter, arguments);
    this.allHunters.push(newHunter);
    return newHunter;
  },

  allHunters: [],

  forEachHunter: function (action) {
    for (var i = this.allHunters.length; i > 0; i--){
      action.call(this.allHunters[i - 1]);
    }
  }
};

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
        if (isInTile(n, this.avoids[i])) {
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
      console.error("bad direction passed to canMove()");
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

function Shooter() {

    Enemy.call(this);
    this.char = "s";
    this.avoids = ["wall", "enemy"];
    this.shoots = true;
    this.target = function() {
      // var validTargets = [];
      // if (this.canShoot(heroA)) {
      //   validTargets.push(heroA);
      // }
      // if (this.canShoot(heroB)) {
      //   validTargets.push(heroB);
      // }
      // if (validTargets.length) {
      //   health--;
      // }

      var distHeroA = (this.distanceFromTo(this.tile(), heroA.tile()));
      var distHeroB = (this.distanceFromTo(this.tile(), heroB.tile()));
      var distances = [distHeroA, distHeroB];
      var shortest = Array.min(distances);
      var closest = [];

      if (distHeroA === shortest) {
        closest.push(heroA.tile());
      }
      if (distHeroB === shortest) {
        closest.push(heroB.tile());
      }

      return closest[Math.floor(Math.random() * closest.length)];
    }

    // this.canShoot = function() {

    //   // if target is left of enemy
    //   // if (target.col() === this.col() && target.tile() < this.tile()) {
    //   var n = leftFrom(this.tile());
    //   while (!isInTile(n, "wall") && !isInTile(n, "enemy") && !isInTile(n, "hero")) {
    //     if (isAdjacent(n, leftFrom(n))) {
    //       n = leftFrom(n);
    //     }
    //     else {
    //       break;
    //     }
    //   }
    //   if (isInTile(n, "hero")) {
    //     return isInTile(n, "hero").tile();
    //   }
    //   // }
    //   return false;
    // }

    this.die = function() {
      switch (Math.floor(Math.random() * 3)) {
        case 0:
          new Blue().deployToTile(this.tile());
          break;
        case 1:
          new Red().deployToTile(this.tile());
          break;
        case 2:
          new Green().deployToTile(this.tile());
          break;
      }

      removeFromArray(board[this.tile()], this);
      removeFromArray(ShooterFactory.allShooters, this);
    }
  }

  ShooterFactory = {

    createShooter: function () {
      var newShooter = {};
      Shooter.apply(newShooter, arguments);
      this.allShooters.push(newShooter);
      return newShooter;
    },

    allShooters: [],

    forEachShooter: function (action) {
      for (var i = this.allShooters.length; i > 0; i--){
        action.call(this.allShooters[i - 1]);
      }
    }
  };
function Wall() {

  Item.call(this);
  this.char = "#";
  this.type = "wall";

  this.destroy = function() {
    removeFromArray(board[this.tile()], this);
  }
}

function generateWalls() {

  var allWalls = [];

  for (var i = 0; i < board.length; i++) {
    if (isInTile(i, "wall")) {
      board[i] = [];
    }
  }

  function maybePutWallInTile(tile, chance) {
    var flip = Math.floor(Math.random() * 100);
    if (flip < chance) {
      board[tile][0] = new Wall();
      allWalls.push(tile);
    }
  }

  function generateInitalWalls() {
    for (var i = 0; i < board.length; i++) {
      if (board[i].length === 0) {
        maybePutWallInTile(i, 40);
      }
    }
  }

  // generate walls adjacent to existing walls
  function generateAdjacentWalls(i) {
    var adjacent = [];
    var emptyAdjacent = [];
    if (isAdjacent(i, upFrom(i))) {
      adjacent.push(upFrom(i));
    }
    if (isAdjacent(i, downFrom(i))) {
      adjacent.push(downFrom(i));
    }
    if (isAdjacent(i, leftFrom(i))) {
      adjacent.push(leftFrom(i));
    }
    if (isAdjacent(i, rightFrom(i))) {
      adjacent.push(rightFrom(i));
    }
    for (var i = 0; i < adjacent.length; i++) {
      if (board[adjacent[i]].length === 0) {
        emptyAdjacent.push(adjacent[i]);
      }
    }
    for (var i = 0; i < emptyAdjacent.length; i++) {
      maybePutWallInTile(emptyAdjacent[i], 40);
    }
  }

  // for spaces that are adjacent to more than two walls, remove walls until they're only adjacent to two walls
  function removeTunnels(i) {
    var vertical = [];

    if (isAdjacent(i, upFrom(i)) && isInTile(upFrom(i), "wall")) {
      vertical.push(upFrom(i));
    }
    if (isAdjacent(i, downFrom(i)) && isInTile(downFrom(i), "wall")) {
      vertical.push(downFrom(i));
    }
    if (isAdjacent(i, leftFrom(i)) && isInTile(leftFrom(i), "wall")) {
      vertical.push(leftFrom(i));
    }
    if (isAdjacent(i, rightFrom(i)) && isInTile(rightFrom(i), "wall")) {
      vertical.push(rightFrom(i));
    }

    while (vertical.length > 1) {
      var index = Math.floor(Math.random() * vertical.length);
      isInTile(vertical[index], "wall").destroy();
      vertical.splice(index, 1);
    }
  }

  generateInitalWalls();

  var allWallsClone = allWalls.slice();
  for (var i = 0; i < allWallsClone.length; i++) {
    generateAdjacentWalls(allWallsClone[i]);
  }

  for (var i = 0; i < board.length; i++) {
    if (!isInTile(i, "wall")) {
      removeTunnels(i);
    }
  }

  for (var i = 0; i < corners.length; i++) {
    if (isInTile(corners[i], "wall")) {
      isInTile(corners[i], "wall").destroy();
    }
  }

  if (!isMapOpen()) {
    generateWalls();
  }
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

  if (!isConnected(notWalls[0])) {
    good = false;
  }

  return good;
}

function Web() {

  Item.call(this);
  this.char = "/";
  this.type = "web";

  this.deploy = function(tile) {
    board[tile].push(this);
  }

  this.destroy = function() {
    removeFromArray(board[this.tile()], this);
  }
}

window.addEventListener("load", function() {

  setUpBoard();
  health = maxHealth;
  heroA.deployToTile(center - boardSize + 1);
  heroB.deployToTile(center + boardSize - 1);
  createRandomEnemy();
  advanceLevel();

  document.onkeydown = checkKey;
  function checkKey(e) {

    e = e || window.event;
    var key = e.keyCode;
    var left = "37";
    var up = "38";
    var right = "39";
    var down = "40";
    var rest = "32";
    var shif = "16";

    // if (key = shift) {
    //   shift();
    // }

    if (key == rest) {
      advanceTurn();
    }

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
