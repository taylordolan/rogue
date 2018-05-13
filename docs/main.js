var board = [];
var boardElement = document.getElementsByClassName("board")[0];
var boardSize = 8;
var healthElement;
var level = 0;
var maxHealth = 4;
var center = Math.floor(boardSize * boardSize / 2);
var tileElements = [];
var turn = 0;
var corners = [0, boardSize - 1, boardSize * boardSize - boardSize, boardSize * boardSize - 1];
var score = 0;

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
  return false;
}

function downFrom(n) {
  if (isAdjacent(n, n + boardSize)) {
    return n + boardSize;
  }
  return false;
}

function leftFrom(n) {
  if (isAdjacent(n, n - 1)) {
    return n - 1;
  }
  return false;
}

function rightFrom(n) {
  if (isAdjacent(n, n + 1)) {
    return n + 1;
  }
  return false;
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
    return 10;
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

function advanceTurn() {
  turn++;
  HunterFactory.forEachHunter (function () {
    this.pathfind();
  });
  maybeSpawnEnemies();
  render();
}

function advanceLevel() {
  level++;
  generateWalls();
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

// set up decks and draw rate
let enemyDeck = [];
let enemyDiscard = [];
let increaseDeck = [];
let increaseDiscard = [];
let drawRate = 4;

// populate enemy deck
for (let i = 0; i < 40; i++) {
  enemyDeck.push(0);
}

for (let i = 0; i < 1; i++) {
  enemyDeck.push(1);
}

// populate increase deck
for (let i = 0; i < 15; i++) {
  increaseDeck.push(0);
}

for (let i = 0; i < 1; i++) {
  increaseDeck.push(1);
}


let getIndex = (deck) => {
  let index = Math.floor(Math.random() * deck.length);
  return index;
}

let discardAtIndex = (index, deck, discard) => {
  discard.push(deck[index]);
  deck.splice(index, 1);
}

let maybeSpawnEnemies = () => {

  // draw a card from the increase deck. if it's a 1, increase the spawn rate.
  let increaseIndex = getIndex(increaseDeck);
  if (increaseDeck[increaseIndex]) {
    drawRate++;
  }
  discardAtIndex(increaseIndex, increaseDeck, increaseDiscard);
  // if the increase deck is empty, create a new increase deck from the discard pile
  if (increaseDeck.length === 0) {
    increaseDeck = increaseDiscard.slice(0);
    increaseDiscard.length = 0;
  }

  // draw cards from the enemy deck equal to the draw rate. for each 1, spawn an enemy.
  for (let i = 0; i < drawRate; i++) {
    let enemyIndex = getIndex(enemyDeck);
    if (enemyDeck[enemyIndex]) {
      HunterFactory.createHunter();
      HunterFactory.forEachHunter (function() {
        if(!this.tile()) {
          this.deployToRandomEmptyEdge();
        }
      });
    }
    discardAtIndex(enemyIndex, enemyDeck, enemyDiscard);
    // if the enemy deck is empty, create a new enemy deck from the discard pile
    if (enemyDeck.length === 0) {
      enemyDeck = enemyDiscard.slice(0);
      enemyDiscard.length = 0;
    }
  }
  console.log("enemyDeck   ", enemyDeck.length);
  console.log("enemyDiscard", enemyDiscard.length);
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
  healthElement.innerHTML += "a";
  healthElement.innerHTML += heroA.health;
  healthElement.innerHTML += " ";
  healthElement.innerHTML += "b";
  healthElement.innerHTML += heroB.health;
  healthElement.innerHTML += " ";
  healthElement.innerHTML += "s";
  healthElement.innerHTML += score;
  healthElement.innerHTML += "<br>";
}

function render() {
  for (var i = 0; i < tileElements.length; i++) {
    tileElements[i].innerHTML = "";
    var span = document.createElement("span");
    if (i === heroA.tile()) {
      span.innerHTML = isInTile(i, "hero").char;
      span.classList.add("hero-a");
    }
    else if (i === heroB.tile()) {
      span.innerHTML = isInTile(i, "hero").char;
      span.classList.add("hero-b");
    }
    else if (isInTile(i, "wall")) {
      span.innerHTML = isInTile(i, "wall").char;
    }
    else if (isInTile(i, "enemy")) {
      span.innerHTML = isInTile(i, "enemy").char;
    }
    else if (isInTile(i, "potentialTile")) {
      span.innerHTML = isInTile(i, "potentialTile").char;
    }
    else if (isInTile(i, "powerTile")) {
      span.innerHTML = isInTile(i, "powerTile").char;
    }
    else {
      var span = document.createElement("span");
      span.innerHTML = "·";
    }
    // color classes
    if (isInTile(i, "potentialTile")) {
      span.classList.add(isInTile(i, "potentialTile").color)
    }
    if (isInTile(i, "powerTile")) {
      span.classList.add(isInTile(i, "powerTile").color)
    }
    tileElements[i].appendChild(span);
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

function Enemy (name) {

  Item.call(this);
  this.name = name;
  this.char = "e";
  this.type = "enemy";
  this.target = function() {
    return;
  }

  this.setTile = function(n) {
    if (isInTile(n, "powerTile") && isInTile(n, "powerTile").color === "purple") {
      score++;
    }
    if (isInTile(n, "powerTile") && isInTile(n, "powerTile").color === "red") {
      if (this.distanceFromTo(this.tile(), heroA.tile()) < this.distanceFromTo(this.tile(), heroB.tile())) {
        heroA.health++;
      }
      else {
        heroB.health++;
      }
    }
    if (isInTile(n, "hero")) {
      isInTile(n, "hero").health--;
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

    // this array will be populated with moves that will advance toward the target
    var validMoves = [];

    // if enemy can move up, and up is closer than here, then "moveUp" is a valid move
    if (this.canMove("up", here) && this.distanceFromTo(up, this.target()) < this.distanceFromTo(here, this.target())) {
      validMoves.push("moveUp");
    }
    // if enemy can move down, and down is closer than here, then "moveDown" is a valid move
    if (this.canMove("down", here) && this.distanceFromTo(down, this.target()) < this.distanceFromTo(here, this.target())) {
      validMoves.push("moveDown");
    }
    // if enemy can move left, and left is closer than here, then "moveLeft" is a valid move
    if (this.canMove("left", here) && this.distanceFromTo(left, this.target()) < this.distanceFromTo(here, this.target())) {
      validMoves.push("moveLeft");
    }
    // if enemy can move right, and right is closer than here, then "moveRight" is a valid move
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

function Hero() {

  Item.call(this);
  this.avoids = ["wall", "hero"];
  this.type = "hero";
  this.health = maxHealth;

  this.setTile = function(destination) {

    let here = this.tile();
    let direction = "";

    // find out which direction the hero is moving
    if (destination === leftFrom(here)) {
      direction = "left";
    }
    else if (destination === rightFrom(here)) {
      direction = "right";
    }
    else if (destination === upFrom(here)) {
      direction = "up";
    }
    else if (destination === downFrom(here)) {
      direction = "down";
    }

    // if meelee is enabled, hit surrounding enemies
    if (
      isInTile(this.getFriendTile(), "powerTile") &&
      isInTile(this.getFriendTile(), "powerTile").color === "blue"
    ) {
      removeFromArray(board[this.tile()], this);
      board[destination].push(this);
      this.hitSurroundingEnemies();
    }

    // if shooting is enabled and there's an enemy in line of sight, hit it
    if (
      isInTile(this.getFriendTile(), "powerTile") &&
      isInTile(this.getFriendTile(), "powerTile").color === "green" &&
      this.canShoot(direction, destination)
    ) {
      this.hitEnemyIn(this.canShoot(direction, destination));
    }

    // otherwise, move to destination
    else if (!this.shouldAvoid(destination)) {
      // if there's a potential tile in the destination…
      if (isInTile(destination, "potentialTile")) {
        // get its color
        const color = isInTile(destination, "potentialTile").color;
        // destroy all potential tiles
        PotentialTileFactory.forEachPotentialTile (function() {
          removeFromArray(board[this.tile()], this);
          removeFromArray(PotentialTileFactory.allPotentialTiles, this);
        });
        // deploy a power tile to destination
        board[destination].push(new PowerTile());
        // and set its color
        isInTile(destination, "powerTile").color = color;
        // create two new potential tiles and deploy them
        PotentialTileFactory.createPotentialTile();
        PotentialTileFactory.createPotentialTile();
        PotentialTileFactory.forEachPotentialTile (function() {
          this.setRandomColor();
          this.deployToRandomEmptyTile();
        });
      }
      removeFromArray(board[this.tile()], this);
      board[destination].push(this);
    }
  }

  // given a direction and the first tile in that direction, return (the tile of an enemy in line of sight) or (false)
  // TODO: seems like I could
  this.canShoot = function(direction, n) {
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

    else if (direction === "down") {
      while (!isInTile(n, "wall") && !isInTile(n, "enemy") && !isInTile(n, "hero")) {
        if (isAdjacent(n, downFrom(n))) {
          n = downFrom(n);
        }
        else {
          break;
        }
      }
    }

    else if (direction === "left") {
      while (!isInTile(n, "wall") && !isInTile(n, "enemy") && !isInTile(n, "hero")) {
        if (isAdjacent(n, leftFrom(n))) {
          n = leftFrom(n);
        }
        else {
          break;
        }
      }
    }

    else if (direction === "right") {
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
      return n;
    }
    return false;
  }

  this.hitSurroundingEnemies = function() {

    const here = this.tile();
    const up = upFrom(here);
    const down = downFrom(here);
    const left = leftFrom(here);
    const right = rightFrom(here);
    const upRight = rightFrom(up);
    const upLeft = leftFrom(up);
    const downRight = rightFrom(down);
    const downLeft = leftFrom(down);

    const surroundingTiles = [here];

    if (up) {
      surroundingTiles.push(up);
    }
    if (down) {
      surroundingTiles.push(down);
    }
    if (left) {
      surroundingTiles.push(left);
    }
    if (right) {
      surroundingTiles.push(right);
    }
    if (upRight) {
      surroundingTiles.push(upRight);
    }
    if (upLeft) {
      surroundingTiles.push(upLeft);
    }
    if (downRight) {
      surroundingTiles.push(downRight);
    }
    if (downLeft) {
      surroundingTiles.push(downLeft);
    }

    for (tile in surroundingTiles) {
      let enemyTile = isInTile(surroundingTiles[tile], "enemy");
      if (enemyTile) {
        // TODO: I wish this was just `this.hitEnemyIn(enemyTile.tile());`
        this.hitEnemyIn(enemyTile.tile());
      }
    }
  }

  this.hitEnemyIn = function(n) {
    if (isInTile(n, "enemy")) {
      isInTile(n, "enemy").die();
    }
    else return false;
  }

  this.getFriendTile = function() {
    for (tile in board) {
      if (isInTile(tile, "hero") && tile != this.tile()) {
        return tile;
      }
    }
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

    removeFromArray(board[this.tile()], this);
    removeFromArray(HunterFactory.allHunters, this);
  }
}

HunterFactory = {

  createHunter: function() {
    var newHunter = {};
    Hunter.apply(newHunter, arguments);
    this.allHunters.push(newHunter);
    return newHunter;
  },

  allHunters: [],

  forEachHunter: function(action) {
    for (var i = this.allHunters.length; i > 0; i--){
      action.call(this.allHunters[i - 1]);
    }
  },
};

function Item() {

  this.deployToTile = function(tile) {
    board[tile].push(this);
  }

  this.deployToRandomEmptyTile = function() {

    let emptyTiles = [];

    // find all empty tiles
    for (let tile in board) {
      if (board[tile].length === 0) {
        emptyTiles.push(tile);
      }
    }

    // select a random empty tile
    const randomEmptyTile = board[emptyTiles[Math.floor(Math.random() * emptyTiles.length)]];

    // deploy item to selected empty tile
    randomEmptyTile.push(this);
  }

  this.deployToRandomEmptyEdge = function() {

    let edgeTiles = [];
    let emptyEdgeTiles = [];

    // find all edge tiles
    for (let tile in board) {
      if (
        colFromTile(tile) === 0 ||
        colFromTile(tile) === boardSize - 1 ||
        rowFromTile(tile) === 0 ||
        rowFromTile(tile) === boardSize - 1
      ) {
        edgeTiles.push(tile);
      }
    }

    // find all empty edge tiles
    for (let tile in edgeTiles) {
      if (board[edgeTiles[tile]].length === 0) {
        emptyEdgeTiles.push(edgeTiles[tile]);
      }
    }

    // select a random empty edge tile
    const randomEmptyEdgeTile = board[emptyEdgeTiles[Math.floor(Math.random()*emptyEdgeTiles.length)]];

    // deploy item to selected empty edge tile
    randomEmptyEdgeTile.push(this);
  }

  this.tile = function() {

    // for each tile…
    for (var i = 0; i<board.length; i++) {
      // look at each thing in the tile.
      for (var j = 0; j<board[i].length; j++) {
        // if the thing is *this*…
        if (board[i][j] === this) {
          // return the current tile.
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
    removeFromArray(board[this.tile()], this);
    board[n].push(this);
  }

  this.moveRight = function() {
    // if (this.col() < boardSize - 1) {
    //   this.setTile(this.tile() + 1);
    // }
    if (this.canMove("right", this.tile())) {
      this.setTile(rightFrom(this.tile()));
    }
  }

  this.moveLeft = function() {
    if (this.col() > 0) {
      this.setTile(this.tile() - 1);
    }
  }

  this.moveUp = function() {
    if (this.row() > 0) {
      this.setTile(this.tile() - boardSize);
    }
  }

  this.moveDown = function() {
    if (this.row() < boardSize - 1) {
      this.setTile(this.tile() + boardSize);
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


    if (direction === "up") {
      var up = start - boardSize;
      if (isAdjacent(start, up) && !this.shouldAvoid(up)) {
        return true;
      }
      else return false;
    }
    else if (direction === "down") {
      var down = start + boardSize;
      if (isAdjacent(start, down) && !this.shouldAvoid(down)) {
        return true;
      }
      else return false;
    }
    else if (direction === "left") {
      var left = start - 1;
      if (isAdjacent(start, left) && !this.shouldAvoid(left)) {
        return true;
      }
      else return false;
    }
    else if (direction === "right") {
      var right = start + 1;
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

function PotentialTile() {

  Item.call(this);
  this.char = "•";
  this.type = "potentialTile";
  this.color = "";

  this.setRandomColor = function() {
    var possibleColors = ["green", "blue", "red", "purple"];
    var randomColor = possibleColors[Math.floor(Math.random()*possibleColors.length)];
    this.color = randomColor;
  }
}

PotentialTileFactory = {

  createPotentialTile: function() {
    var newPotentialTile = {};
    PotentialTile.apply(newPotentialTile, arguments);
    this.allPotentialTiles.push(newPotentialTile);
    return newPotentialTile;
  },

  allPotentialTiles: [],

  forEachPotentialTile: function(action) {
    for (var i = this.allPotentialTiles.length; i > 0; i--){
      action.call(this.allPotentialTiles[i - 1]);
    }
  },
};

function PowerTile() {

  Item.call(this);
  this.char = "+";
  this.type = "powerTile";
  this.color = "";
}

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

window.addEventListener("load", function() {

  setUpBoard();
  health = maxHealth;
  heroA.deployToTile(center - boardSize + 1);
  heroB.deployToTile(center + boardSize - 1);
  PotentialTileFactory.createPotentialTile();
  PotentialTileFactory.createPotentialTile();
  PotentialTileFactory.forEachPotentialTile (function() {
    this.setRandomColor();
    this.deployToRandomEmptyTile();
  });
  advanceLevel();

  document.onkeydown = checkKey;
  function checkKey(e) {

    e = e || window.event;
    var key = e.keyCode;
    var left = 37;
    var up = 38;
    var right = 39;
    var down = 40;

    // even turns
    if (turn % 2 === 0) {
      // heroA
      if (key === up) {
        heroA.moveUp();
        advanceTurn();
      }
      else if (key === down) {
        heroA.moveDown();
        advanceTurn();
      }
      // heroB
      else if (key === left) {
        heroB.moveLeft();
        advanceTurn();
      }
      else if (key === right) {
        heroB.moveRight();
        advanceTurn();
      }
    }

    // odd turns
    else if (turn % 2 === 1) {
      // heroB
      if (key === up) {
        heroB.moveUp();
        advanceTurn();
      }
      else if (key === down) {
        heroB.moveDown();
        advanceTurn();
      }
      // heroA
      else if (key === left) {
        heroA.moveLeft();
        advanceTurn();
      }
      else if (key === right) {
        heroA.moveRight();
        advanceTurn();
      }
    }
  }
});
