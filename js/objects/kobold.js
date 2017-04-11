function Kobold (name) {
  Item.call(this);
  this.name = name;

  this.setTile = function(n) {
    if (board[n][0]) {
      console.log("hit!");
      health--;
    } else {
      board[this.getTile()].pop(this);
      board[n].push(this);
    }
  }

  // to be used like this, for example: hero.moveWithOption("moveRight", "moveDown")
  this.moveWithOption = function(array) {
    option = Math.floor(Math.random() * array.length);
    this[array[option]]();
  }

  this.distanceToHeroLeft = function() {
    if (this.getCol() > 0) {
      return this.distanceToHero(this.getTile() - 1);
    }
  }

  this.distanceToHeroRight = function() {
    if (this.getCol() < boardSize - 1) {
      return this.distanceToHero(this.getTile() + 1);
    }
  }

  this.distanceToHeroUp = function() {
    if (this.getRow() > 0) {
      return this.distanceToHero(this.getTile() - boardSize);
    }
  }

  this.distanceToHeroDown = function() {
    if (this.getRow() < boardSize - 1) {
      return this.distanceToHero(this.getTile() + boardSize);
    }
  }

  this.distanceToHero = function(startTile) {
    var steps = 0;
    var found = false;
    lookedTiles = [];
    lookedTiles.push (startTile);

    if (startTile === heroA.getTile() || startTile === heroB.getTile()) {
      return 0;
    }

    function isHeroInTile(n) {
      if (board[n][0] === heroA || board[n][0] === heroB) {
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
      if (l && isHeroInTile(l)) {
        found = true;
      }
      if (l && !isInLookedTiles(l)) {
        lookedTiles.push(l);
      }
      if (r && isHeroInTile(r)) {
        found = true;
      }
      if (r && !isInLookedTiles(r)) {
        lookedTiles.push(r);
      }
      if (t && isHeroInTile(t)) {
        found = true;
      }
      if (t && !isInLookedTiles(t)) {
        lookedTiles.push(t);
      }
      if (b && isHeroInTile(b)) {
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
    var d = this.distanceToHero(this.getTile());
    var dl = this.distanceToHeroLeft();
    var dr = this.distanceToHeroRight();
    var du = this.distanceToHeroUp();
    var dd = this.distanceToHeroDown();
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
    var killMe = this.name;
    board[this.getTile()].splice(board[this.getTile])
    KoboldFactory.allKobolds.splice(KoboldFactory.allKobolds.indexOf(this),1);
    score++;
  }
}

KoboldFactory = {
  createKobold: function () {
    var newKobold = {};
    Kobold.apply(newKobold, arguments);
    this.allKobolds.push(newKobold);
    return newKobold;
  },

  allKobolds: [],

  forEachKobold: function (action) {
    for (var i = 0; i < this.allKobolds.length; i++){
      action.call(this.allKobolds[i]);
    }
  }
};

KoboldFactory.createKobold("hi");
