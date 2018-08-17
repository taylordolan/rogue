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
    if (this.canMove("right", this.tile())) {
      this.setTile(rightFrom(this.tile()));
    }
  }

  this.moveLeft = function() {
    if (this.canMove("left", this.tile())) {
      this.setTile(leftFrom(this.tile()));
    }
  }

  this.moveUp = function() {
    if (this.canMove("up", this.tile())) {
      this.setTile(upFrom(this.tile()));
    }
  }

  this.moveDown = function() {
    if (this.canMove("down", this.tile())) {
      this.setTile(downFrom(this.tile()));
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
