function Hero() {

  Item.call(this);
  this.avoids = ["wall", "hero"];
  this.type = "hero";

  this.setTile = function(n) {

    if (isInTile(this.friend.tile(), "blue")) {

      if (n === upFrom(this.tile())) {
        var d = "up";
      }
      else if (n === downFrom(this.tile())) {
        var d = "down";
      }
      else if (n === leftFrom(this.tile())) {
        var d = "left";
      }
      else if (n === rightFrom(this.tile())) {
        var d = "right";
      }
      if (this.shoot(d, n)) {
        return;
      }
    }

    if (isInTile(this.friend.tile(), "red") && !isInTile(this.tile(), "web")) {
      new Web().deploy(this.tile());
    }

    if (isInTile(n, "enemy")) {
      isInTile(n, "enemy").die();
      if (isInTile(n, "web")) {
        isInTile(n, "web").destroy();
      }
    }

    else if (isInTile(n, "fuel")) {
      removeFromArray(board[this.tile()], this);
      board[n].push(this);
      isInTile(n, "fuel").destroy();
    }

    else if (!this.shouldAvoid(n)) {
      removeFromArray(board[this.tile()], this);
      board[n].push(this);
    }

    if (isInTile(heroA.tile(), "advanceTile") && isInTile(heroB.tile(), "advanceTile")) {
      isInTile(heroA.tile(), "advanceTile").destroy();
      isInTile(heroB.tile(), "advanceTile").destroy();
      advanceLevel();
    }
  }

  this.shoot = function(direction, n) {

    if (direction === "up") {
      while (!isInTile(n, "wall") && !isInTile(n, "enemy") && !isInTile(n, "hero")) {
        if (isAdjacent(n, upFrom(n))) {
          n = upFrom(n);
        }
        else {
          break;
        }
      }
    }
    if (direction === "down") {
      while (!isInTile(n, "wall") && !isInTile(n, "enemy") && !isInTile(n, "hero")) {
        if (isAdjacent(n, downFrom(n))) {
          n = downFrom(n);
        }
        else {
          break;
        }
      }
    }
    if (direction === "left") {
      while (!isInTile(n, "wall") && !isInTile(n, "enemy") && !isInTile(n, "hero")) {
        if (isAdjacent(n, leftFrom(n))) {
          n = leftFrom(n);
        }
        else {
          break;
        }
      }
    }
    if (direction === "right") {
      while (!isInTile(n, "wall") && !isInTile(n, "enemy") && !isInTile(n, "hero")) {
        if (isAdjacent(n, rightFrom(n))) {
          n = rightFrom(n);
        }
        else {
          break;
        }
      }
    }
    if (isInTile(n, "enemy")) {
      isInTile(n, "enemy").die();
      return true;
    }
    else {
      return false;
    }
  }

  this.deployToTile = function(tile) {
    board[tile].push(this);
  }
}

var heroA = new Hero();
var heroB = new Hero();
heroA.char = "a";
heroA.friend = heroB;
heroB.char = "b";
heroB.friend = heroA;
