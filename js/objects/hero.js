function Hero() {

  Item.call(this);
  this.avoids = ["wall", "hero"];
  this.type = "hero";
  this.health = maxHealth;

  this.moveRight = function() {
    if (this.canMove("right", this.tile())) {
      this.meelee();
      if (this.canShoot("right")) {
        this.shoot("right");
      }
      else {
        this.setTile(rightFrom(this.tile()));
      }
    }
  }

  this.moveLeft = function() {
    if (this.canMove("left", this.tile())) {
      this.meelee();
      if (this.canShoot("left")) {
        this.shoot("left");
      }
      else {
        this.setTile(leftFrom(this.tile()));
      }
    }
  }

  this.moveUp = function() {
    if (this.canMove("up", this.tile())) {
      this.meelee();
      if (this.canShoot("up")) {
        this.shoot("up");
      }
      else {
        this.setTile(upFrom(this.tile()));
      }
    }
  }

  this.moveDown = function() {
    if (this.canMove("down", this.tile())) {
      this.meelee();
      if (this.canShoot("down")) {
        this.shoot("down");
      }
      else {
        this.setTile(downFrom(this.tile()));
      }
    }
  }

  // if meelee is enabled, hit surrounding enemies
  this.meelee = function() {
    if (
      isInTile(this.getFriendTile(), "powerTile") &&
      isInTile(this.getFriendTile(), "powerTile").color === "blue"
    ) {
      this.setTile(destination);
      this.hitSurroundingEnemies();
    }
  }

  this.shoot = function(direction) {
    this.setTile(this.canShoot(direction));
    this.hitEnemyIn(this.tile());
  }

  this.canShoot = function(direction) {

    if (!(
      isInTile(this.getFriendTile(), "powerTile") &&
      isInTile(this.getFriendTile(), "powerTile").color === "green"
    )) {
      return false;
    }

    let here = this.tile();
    let target;

    if (direction === "up") {
      target = upFrom(here);
      while (!isInTile(target, "wall") && !isInTile(target, "enemy") && !isInTile(target, "hero")) {
        if (isAdjacent(target, upFrom(target))) {
          target = upFrom(target);
        }
        else {
          break;
        }
      }
    }

    else if (direction === "down") {
      target = downFrom(here);
      while (!isInTile(target, "wall") && !isInTile(target, "enemy") && !isInTile(target, "hero")) {
        if (isAdjacent(target, downFrom(target))) {
          target = downFrom(target);
        }
        else {
          break;
        }
      }
    }

    else if (direction === "left") {
      target = leftFrom(here);
      while (!isInTile(target, "wall") && !isInTile(target, "enemy") && !isInTile(target, "hero")) {
        if (isAdjacent(target, leftFrom(target))) {
          target = leftFrom(target);
        }
        else {
          break;
        }
      }
    }

    else if (direction === "right") {
      target = rightFrom(here);
      while (!isInTile(target, "wall") && !isInTile(target, "enemy") && !isInTile(target, "hero")) {
        if (isAdjacent(target, rightFrom(target))) {
          target = rightFrom(target);
        }
        else {
          break;
        }
      }
    }

    if (isInTile(target, "enemy")) {
      return target;
    }
    return false;
  }

  this.hitSurroundingEnemies = function() {

    const here = this.tile();
    const up = upFrom(here);
    const down = downFrom(here);
    const left = leftFrom(here);
    const right = rightFrom(here);
    const upRight = rightFrom(up);
    const upLeft = leftFrom(up);
    const downRight = rightFrom(down);
    const downLeft = leftFrom(down);

    const surroundingTiles = [here];

    if (up) {
      surroundingTiles.push(up);
    }
    if (down) {
      surroundingTiles.push(down);
    }
    if (left) {
      surroundingTiles.push(left);
    }
    if (right) {
      surroundingTiles.push(right);
    }
    if (upRight) {
      surroundingTiles.push(upRight);
    }
    if (upLeft) {
      surroundingTiles.push(upLeft);
    }
    if (downRight) {
      surroundingTiles.push(downRight);
    }
    if (downLeft) {
      surroundingTiles.push(downLeft);
    }

    for (tile in surroundingTiles) {
      let enemyTile = isInTile(surroundingTiles[tile], "enemy");
      if (enemyTile) {
        // TODO: I wish this was just `this.hitEnemyIn(enemyTile.tile());`
        this.hitEnemyIn(enemyTile.tile());
      }
    }
  }

  this.hitEnemyIn = function(n) {
    if (isInTile(n, "enemy")) {
      isInTile(n, "enemy").die();
    }
    else return false;
  }

  this.getFriendTile = function() {
    for (tile in board) {
      if (isInTile(tile, "hero") && tile != this.tile()) {
        return tile;
      }
    }
  }
}

var heroA = new Hero();
var heroB = new Hero();
heroA.char = "a";
heroA.friend = heroB;
heroB.char = "b";
heroB.friend = heroA;
