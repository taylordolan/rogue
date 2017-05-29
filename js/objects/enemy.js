function Enemy (name) {

  Item.call(this);
  this.name = name;
  this.char = "e";
  this.type = "enemy";
  this.target = function() {
    return;
  }

  this.setTile = function(n) {
    if (board[n][0] && board[n][0].hasHealth) {
      health--;
    }
    else if (board[n][0] && board[n][0].solid) {
      return true;
    }
    else {
      board[this.tile()].pop(this);
      board[n].push(this);
    }
  }

  // to be used like this, for example: hero.moveWithOption("moveRight", "moveDown")
  this.moveWithOption = function(array) {
    option = Math.floor(Math.random() * array.length);
    this[array[option]]();
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

    // TODO: put this in a function isLeftCloser(), etc.
    if (canMove("up", here) && distanceFromTo(up, this.target()) < distanceFromTo(here, this.target())) {
      validMoves.push("moveUp");
    }
    if (canMove("down", here) && distanceFromTo(down, this.target()) < distanceFromTo(here, this.target())) {
      validMoves.push("moveDown");
    }
    if (canMove("left", here) && distanceFromTo(left, this.target()) < distanceFromTo(here, this.target())) {
      validMoves.push("moveLeft");
    }
    if (canMove("right", here) && distanceFromTo(right, this.target()) < distanceFromTo(here, this.target())) {
      validMoves.push("moveRight");
    }

    this.moveWithOption(validMoves);
  }

  this.die = function() {
    board[this.tile()].splice(board[this.tile])
    EnemyFactory.allEnemies.splice(EnemyFactory.allEnemies.indexOf(this),1);
    score++;
  }
}
