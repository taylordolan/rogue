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
