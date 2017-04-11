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
      mapSize - 1,
      mapSize * mapSize - 1,
      mapSize * mapSize - mapSize,
    ];
    console.log("corners = " + corners);
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
    for (var i=0; i<mapSize; i++) {
      if ((this.getTile() - i) % mapSize === 0) {
        return i;
      }
    }
  }

  this.getRow = function() {
    for (var i=1; i<=mapSize; i++) {
      if (this.getTile() < mapSize * i) {
        return i - 1;
      }
    }
  }

  this.setTile = function(n) {
    board[this.getTile()].pop(this);
    board[n].push(this);
  }

  this.moveRight = function() {
    if (this.getCol() < mapSize - 1) {
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
      this.setTile(this.getTile() - mapSize);
      return true;
    }
  }

  this.moveDown = function() {
    if (this.getRow() < mapSize - 1) {
      this.setTile(this.getTile() + mapSize);
      return true;
    }
  }
}
