function Wall() {
  this.char = "#";
  this.solid = true;
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
