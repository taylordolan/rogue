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
