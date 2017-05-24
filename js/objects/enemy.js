function Enemy (name) {

  Item.call(this);
  this.name = name;
  this.char = "e";
  this.target = function() {
    return 1;
  }

  this.setTile = function(n) {
    if (board[n][0] && board[n][0].hasHealth) {
      health--;
    }
    else if (board[n][0] && board[n][0].solid) {
      return true;
    }
    else {
      board[this.getTile()].pop(this);
      board[n].push(this);
    }
  }

  // to be used like this, for example: hero.moveWithOption("moveRight", "moveDown")
  this.moveWithOption = function(array) {
    option = Math.floor(Math.random() * array.length);
    this[array[option]]();
  }

  this.distanceToTileStartingLeft = function() {
    if (this.getCol() > 0) {
      return this.distanceToTile(this.getTile() - 1, this.target());
    }
  }

  this.distanceToTileStartingRight = function() {
    if (this.getCol() < boardSize - 1) {
      return this.distanceToTile(this.getTile() + 1, this.target());
    }
  }

  this.distanceToTileStartingUp = function() {
    if (this.getRow() > 0) {
      return this.distanceToTile(this.getTile() - boardSize, this.target());
    }
  }

  this.distanceToTileStartingDown = function() {
    if (this.getRow() < boardSize - 1) {
      return this.distanceToTile(this.getTile() + boardSize, this.target());
    }
  }

  this.distanceToTile = function(startTile, endTile) {
    var steps = 0;
    var found = false;
    lookedTiles = [];
    lookedTiles.push(startTile);

    if (startTile == endTile) {
      return steps;
    }

    function isDestination(tile) {
      if (tile == endTile) {
        return true;
      }
    }

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
      if (l && isDestination(l)) {
        found = true;
      }
      if (l && !isInLookedTiles(l)) {
        lookedTiles.push(l);
      }
      if (r && isDestination(r)) {
        found = true;
      }
      if (r && !isInLookedTiles(r)) {
        lookedTiles.push(r);
      }
      if (t && isDestination(t)) {
        found = true;
      }
      if (t && !isInLookedTiles(t)) {
        lookedTiles.push(t);
      }
      if (b && isDestination(b)) {
        found = true;
      }
      if (b && !isInLookedTiles(b)) {
        lookedTiles.push(b);
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

  this.pathfind = function() {

    var here = this.getTile();

    var inFirstCol = getColFromTile(here) === 0;
    var inLastCol = getColFromTile(here) === boardSize - 1;
    var inFirstRow = getRowFromTile(here) === 0;
    var inLastRow = getRowFromTile(here) === boardSize - 1;

    var adjacentUp = here - boardSize;
    var adjacentDown = here + boardSize;
    var adjacentLeft = here - 1;
    var adjacentRight = here + 1;

    var wallUp = isWall(adjacentUp);
    var wallDown = isWall(adjacentDown);
    var wallLeft = isWall(adjacentLeft);
    var wallRight = isWall(adjacentRight);

    if (!inFirstCol && !wallLeft) {
      var distanceLeft = this.distanceToTileStartingLeft();
    }
    if (!inLastRow && !wallDown) {
      var distanceDown = this.distanceToTileStartingDown();
    }
    if (!inFirstRow && !wallUp) {
      var distanceUp = this.distanceToTileStartingUp();
    }
    if (!inLastCol && !wallRight) {
      var distanceRight = this.distanceToTileStartingRight();
    }

    var validMoves = [];
    var distanceHere = this.distanceToTile(here, this.target());

    if (distanceUp < distanceHere) {
      validMoves.push('moveUp');
    }
    if (distanceDown < distanceHere) {
      validMoves.push('moveDown');
    }
    if (distanceLeft < distanceHere) {
      validMoves.push('moveLeft');
    }
    if (distanceRight < distanceHere) {
      validMoves.push('moveRight');
    }

    this.moveWithOption(validMoves);
  }

  this.die = function() {
    board[this.getTile()].splice(board[this.getTile])
    EnemyFactory.allEnemies.splice(EnemyFactory.allEnemies.indexOf(this),1);
    score++;
  }
}

EnemyFactory = {

  createEnemy: function () {
    var newEnemy = {};
    Enemy.apply(newEnemy, arguments);
    this.allEnemies.push(newEnemy);
    return newEnemy;
  },

  allEnemies: [],

  forEachEnemy: function (action) {
    for (var i = 0; i < this.allEnemies.length; i++){
      action.call(this.allEnemies[i]);
    }
  }
};
