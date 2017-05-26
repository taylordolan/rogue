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
