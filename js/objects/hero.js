function Hero() {

  Item.call(this);
  this.hasHealth = true;
  this.avoids = ["wall", "hero"];
  this.type = "hero";

  this.setTile = function(n) {
    // var destroyWalls = player.abilities.destroyWalls.enabled;
    // var shoot = player.abilities.shoot.enabled;
    // var webs = player.abilities.webs.enabled;

    // if (destroyWalls) {
    //   removeFromArray(this.avoids, "wall");
    // }

    // if (destroyWalls && this.destroyWalls(n)) {
    //   removeFromArray(board[this.tile()], this);
    //   board[n].push(this);
    //   return;
    // }

    // if (collectedFuel > 1) {
    //   removeFromArray(this.avoids, "hero");
    // }

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
  }

  // this.destroyWalls = function(n) {
  //   var surrounding = [];
  //   for (var i = 0; i < board.length; i++) {
  //     if (this.distanceFromTo(i, n) <= 4) {
  //       surrounding.push(i);
  //     }
  //   }
  //   if (isWall(n)) {
  //     board[n][0].destroy();
  //     for (var i = 0; i < surrounding.length; i++) {
  //       surrounding[i]
  //     }
  //     for (var i = 0; i < surrounding.length; i++) {
  //       if (isInTile(surrounding[i], "enemy")) {
  //         isInTile(surrounding[i], "enemy").die();
  //       }
  //     }
  //     return true;
  //   }
  //   else {
  //     return false;
  //   }
  // }

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
