var board = [];
var boardElement = document.getElementsByClassName("board")[0];
var boardSize = 11;
var maxHealth = 4
var health = maxHealth;
var healthElement;
var level = 1;
var tileElements = [];
var turn = 0;
var collectedFuel = 0;

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
    break;
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
  if (turn && turn % getAdvanceRate() === 0) {
    createRandomEnemy();
  }
  render();
  if (collectedFuel > 1) {
    removeFromArray(heroA.avoids, "ship");
    removeFromArray(heroA.avoids, "hero");
    removeFromArray(heroB.avoids, "ship");
    removeFromArray(heroB.avoids, "hero");
  }
  if (heroA.tile() === ship.tile() && heroB.tile() === ship.tile()) {
    advanceLevel();
  }
}

function advanceLevel() {
  level++;
  health = maxHealth;
  player.gainRandomAbility();
  for (var i = 0; i < board.length; i++) {
    if (isInTile(i, "web")) {
      isInTile(i, "web").destroy();
    }
  }
  for (var i = 0; i < board.length; i++) {
    if (isInTile(i, "fuel")) {
      isInTile(i, "fuel").destroy();
    }
  }
  heroA.deployNearShip();
  heroB.deployNearShip();
  ShipHunterFactory.forEachShipHunter(function() {
    this.die();
  });
  HeroHunterFactory.forEachHeroHunter(function() {
    this.die();
  });
  generateWalls();
  new Fuel().deploy();
  new Fuel().deploy();
  collectedFuel = 0;
  heroA.avoids.push("ship");
  heroB.avoids.push("ship");
  heroA.avoids.push("hero");
  heroB.avoids.push("hero");
  turn = 0;
  createRandomEnemy();
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
    if (i === ship.tile()) {
      var span = document.createElement("span");
      span.innerHTML = isInTile(i, "ship").char;
      tileElements[i].appendChild(span);
    }
    else if (i === heroA.tile()) {
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
    if (isInTile(i, "web")) {
      var span = document.createElement("span");
      span.innerHTML = isInTile(i, "web").char;
      tileElements[i].appendChild(span);
    }
    if (isInTile(i, "fuel")) {
      var span = document.createElement("span");
      span.innerHTML = isInTile(i, "fuel").char;
      tileElements[i].appendChild(span);
    }
    if (!board[i].length)  {
      var span = document.createElement("span");
      span.innerHTML = "·";
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

function HeroHunter (name) {

  Enemy.call(this);
  this.char = "h";
  this.avoids = ["wall", "ship", "enemy"];
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
    removeFromArray(board[this.tile()], this);
    removeFromArray(HeroHunterFactory.allHeroHunters, this);
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
  this.avoids = ["wall", "enemy", "hero"];
  this.target = function() {
    return ship.tile();
  }

  this.die = function() {
    removeFromArray(board[this.tile()], this);
    removeFromArray(ShipHunterFactory.allShipHunters, this);
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
    var upLeftCorner = 0;
    var upRightCorner = boardSize - 1;
    var downLeftCorner = boardSize * boardSize - boardSize;
    var downRightCorner = boardSize * boardSize - 1;
    var nearShip = [up, down, left, right, upLeft, upRight, downLeft, downRight, upLeftCorner, upRightCorner, downLeftCorner, downRightCorner];

    for (var i = 0; i < nearShip.length; i++) {
      if (isInTile(nearShip[i], "wall")) {
        isInTile(nearShip[i], "wall").destroy();
      }
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

  clearNearShip();

  for (var i = 0; i < board.length; i++) {
    if (!isInTile(i, "wall")) {
      removeTunnels(i);
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

function Enemy (name) {

  Item.call(this);
  this.name = name;
  this.char = "e";
  this.type = "enemy";
  this.target = function() {
    return;
  }

  this.setTile = function(n) {
    if (n == heroA.tile() || n == heroB.tile() || n == ship.tile()) {
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
      this.moveRandomly();
    }
  }
}

function Fuel() {

  Item.call(this);
  this.char = "f";
  this.avoids = ["wall"];
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
    collectedFuel++;
    removeFromArray(board[this.tile()], this);
  }
}

var fuelA = new Fuel();
var fuelB = new Fuel();

function Hero() {

  Item.call(this);
  this.hasHealth = true;
  this.avoids = ["wall", "ship", "hero"];
  this.type = "hero";

  this.setTile = function(n) {
    var destroyWalls = player.abilities.destroyWalls.enabled;
    var shoot = player.abilities.shoot.enabled;
    var webs = player.abilities.webs.enabled;

    if (destroyWalls) {
      removeFromArray(this.avoids, "wall");
    }

    if (destroyWalls && this.destroyWalls(n)) {
      removeFromArray(board[this.tile()], this);
      board[n].push(this);
      return;
    }

    if (shoot) {

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

    if (isInTile(n, "enemy")) {
      isInTile(n, "enemy").die();
      if (isInTile(n, "web")) {
        isInTile(n, "web").destroy();
      }
    }

    else if (isInTile(n, "fuel")) {
      isInTile(n, "fuel").destroy();
      if (webs && !isInTile(this.tile(), "web")) {
        this.web(this.tile());
      }
      removeFromArray(board[this.tile()], this);
      board[n].push(this);
    }

    else if (!this.shouldAvoid(n)) {
      if (webs && !isInTile(this.tile(), "web")) {
        this.web(this.tile());
      }
      removeFromArray(board[this.tile()], this);
      board[n].push(this);
    }
  }

  this.web = function(tile) {
    new Web().deploy(tile);
  }

  this.destroyWalls = function(n) {
    var surrounding = [];
    for (var i = 0; i < board.length; i++) {
      if (this.distanceFromTo(i, n) <= 4) {
        surrounding.push(i);
      }
      // xxxxx
      // xxxxx
      // xxaxx
      // xxxxx
      // xxxxx
      // if (this.col() >= 2 && this.row() >= 2) {
      //   surrounding.push(this.tile() - boardSize * 2 - 2);
      // }
      // if (this.col() >= 1 && this.row() >= 2) {
      //   surrounding.push(this.tile() - boardSize * 2 - 1);
      // }
      // if (this.col() <= boardSize - 2 && this.row() >= 2) {
      //   surrounding.push(this.tile() - boardSize * 2 + 1);
      // }
      // if (this.col() <= boardSize - 3 && this.row() >= 2) {
      //   surrounding.push(this.tile() - boardSize * 2 + 2);
      // }
      // if (this.col() >= 2 && this.row() >= 1) {
      //   surrounding.push(this.tile() - boardSize - 2);
      // }
      // if (this.col() <= boardSize - 3 && this.row() >= 1) {
      //   surrounding.push(this.tile() - boardSize + 2);
      // }
      // if (this.col() >= 2 && this.row() <= boardSize - 2) {
      //   surrounding.push(this.tile() + boardSize - 2);
      // }
      // if (this.col() <= boardSize - 3 && this.row() <=  boardSize - 2) {
      //   surrounding.push(this.tile() + boardSize + 2);
      // }
      // if (this.col >= 2 && this.row <= boardSize - 3) {
      //   surrounding.push(this.tile() + boardSize * 2 - 2);
      // }
      // if (this.col >= 1 && this.row <= boardSize - 3) {
      //   surrounding.push(this.tile() + boardSize * 2 - 1);
      // }
      // if (this.col <= boardSize - 2 && this.row <= boardSize - 3) {
      //   surrounding.push(this.tile() + boardSize * 2 + 1);
      // }
      // if (this.col <= boardSize - 3 && this.row <= boardSize - 3) {
      //   surrounding.push(this.tile() + boardSize * 2 + 2);
      // }
    }
    if (isWall(n)) {
      board[n][0].destroy();
      for (var i = 0; i < surrounding.length; i++) {
        surrounding[i]
      }
      for (var i = 0; i < surrounding.length; i++) {
        if (isInTile(surrounding[i], "enemy")) {
          isInTile(surrounding[i], "enemy").die();
        }
      }
      // HeroHunterFactory.forEachHeroHunter(function() {this.die()});
      // ShipHunterFactory.forEachShipHunter(function() {this.die()});
      return true;
    }
    else {
      return false;
    }
  }

  this.shoot = function(direction, n) {

    if (direction === "up") {
      while (!isInTile(n, "wall") && !isInTile(n, "enemy") && !isInTile(n, "hero") && !isInTile(n, "ship")) {
        if (isAdjacent(n, upFrom(n))) {
          n = upFrom(n);
        }
        else {
          break;
        }
      }
    }
    if (direction === "down") {
      while (!isInTile(n, "wall") && !isInTile(n, "enemy") && !isInTile(n, "hero") && !isInTile(n, "ship")) {
        if (isAdjacent(n, downFrom(n))) {
          n = downFrom(n);
        }
        else {
          break;
        }
      }
    }
    if (direction === "left") {
      while (!isInTile(n, "wall") && !isInTile(n, "enemy") && !isInTile(n, "hero") && !isInTile(n, "ship")) {
        if (isAdjacent(n, leftFrom(n))) {
          n = leftFrom(n);
        }
        else {
          break;
        }
      }
    }
    if (direction === "right") {
      while (!isInTile(n, "wall") && !isInTile(n, "enemy") && !isInTile(n, "hero") && !isInTile(n, "ship")) {
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

  this.deployNearShip = function() {
    if (this.tile()) {
      removeFromArray(board[this.tile()], this);
    }
    var here = ship.tile();
    var up = upFrom(here);
    var down = downFrom(here);
    var left = leftFrom(here);
    var right = rightFrom(here);
    var upLeft = upFrom(here) - 1;
    var upRight = upFrom(here) + 1;
    var downLeft = downFrom(here) - 1;
    var downRight = downFrom(here) + 1;
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
heroA.char = "a";
heroB.char = "b";

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

function Player() {

  this.abilities = {
    webs: {
      name: "webs",
      enabled: false,
    },
    shoot: {
      name: "shoot",
      enabled: false,
    },
    destroyWalls: {
      name: "destroyWalls",
      enabled: true,
    }
  };

  this.gainRandomAbility = function() {
    var disabledAbilityNames = [];
    for (ability in this.abilities) {
      if (!this.abilities[ability].enabled) {
        disabledAbilityNames.push(this.abilities[ability]);
      }
    }
    if (!disabledAbilityNames.length) {
      return;
    }
    else {
      var index = Math.floor(Math.random() * disabledAbilityNames.length);
      var ability = disabledAbilityNames[index];
      ability.enabled = true;
      console.log("gained " + ability.name + "!");
    }
  }
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
  ship.deployToCenterTile();
  generateWalls();
  heroA.deployNearShip();
  heroB.deployNearShip();
  fuelA.deploy();
  fuelB.deploy();
  createRandomEnemy();
  render();

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
