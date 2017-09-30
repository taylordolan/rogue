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
