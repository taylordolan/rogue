function Hero() {
  Item.call(this);

  this.moveSequence = function(d,t) {
    try {
      if (board[d][0].char == "k") {
        board[d][0].die();
        return true;
      }
    } catch (e) {
      try {
        if (board[t][0].char == "k") {
          board[t][0].die();
          this.setTile(d);
          return true;
        }
      } catch (e) {
        if (d) {
          this.setTile(d);
          return true;
        } else {
          return false;
        }
      }
    }
  }

  this.moveLeft = function() {
    var c = this.getCol();
    if (c > 0) {
      var d = this.getTile() - 1;
    }
    if (c > 1) {
      var t = this.getTile() - 2;
    }
    return this.moveSequence(d,t);
  }

  this.moveRight = function() {
    var c = this.getCol();
    if (c < mapSize-1) {
      var d = this.getTile() + 1;
    }
    if (c < mapSize-2) {
      var t = this.getTile() + 2;
    }
    return this.moveSequence(d,t);
  }

  this.moveUp = function() {
    var c = this.getRow();
    if (c > 0) {
      var d = this.getTile() - mapSize;
    }
    if (c > 1) {
      var t = this.getTile() - (mapSize*2);
    }
    return this.moveSequence(d,t);
  }

  this.moveDown = function() {
    var c = this.getRow();
    if (c < mapSize-1) {
      var d = this.getTile() + mapSize;
    }
    if (c < mapSize-2) {
      var t = this.getTile() + (mapSize*2);
    }
    return this.moveSequence(d,t);
  }
}
