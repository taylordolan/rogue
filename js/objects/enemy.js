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
      console.log("enemy hit a wall")
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
    lookedTiles.push (startTile);

    if (startTile == endTile) {
      return 0;
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
      if (getColFromTile(n) > 0) {
        var l = n - 1;
      }
      if (getColFromTile(n) < boardSize - 1) {
        var r = n + 1;
      }
      if (getRowFromTile(n) > 0) {
        var t = n - boardSize;
      }
      if (getRowFromTile(n) < boardSize - 1) {
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
    var d = this.distanceToTile(this.getTile(), this.target());
    var dl = this.distanceToTileStartingLeft();
    var dr = this.distanceToTileStartingRight();
    var du = this.distanceToTileStartingUp();
    var dd = this.distanceToTileStartingDown();
    var closer = [];

    if (dl < d) {
      closer.push('moveLeft');
    }
    if (dr < d) {
      closer.push('moveRight');
    }
    if (du < d) {
      closer.push('moveUp');
    }
    if (dd < d) {
      closer.push('moveDown');
    }
    this.moveWithOption(closer);
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
