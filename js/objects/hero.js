function Hero() {

  Item.call(this);
  this.avoids = ["wall", "hero"];
  this.type = "hero";
  this.health = maxHealth;

  this.setTile = function(destination) {

    let here = this.tile();
    let direction = "";

    // find out which direction the hero is moving
    if (destination === leftFrom(here)) {
      direction = "left";
    }
    else if (destination === rightFrom(here)) {
      direction = "right";
    }
    else if (destination === upFrom(here)) {
      direction = "up";
    }
    else if (destination === downFrom(here)) {
      direction = "down";
    }

    // if meelee is enabled, hit surrounding enemies
    if (
      isInTile(this.getFriendTile(), "powerTile") &&
      isInTile(this.getFriendTile(), "powerTile").color === "blue"
    ) {
      this.actuallySetTile(destination);
      this.hitSurroundingEnemies();
    }

    // if shooting is enabled and there's an enemy in line of sight, hit it
    if (
      isInTile(this.getFriendTile(), "powerTile") &&
      isInTile(this.getFriendTile(), "powerTile").color === "green" &&
      this.canShoot(direction, destination)
    ) {
      this.actuallySetTile(this.canShoot(direction, destination));
      this.hitEnemyIn(this.tile());
    }

    // otherwise, move to destination
    else if (!this.shouldAvoid(destination)) {
      this.actuallySetTile(destination);
    }
  }

  this.actuallySetTile = function(destination) {
    // if there's a potential tile in the destination…
    if (isInTile(destination, "potentialTile")) {
      // get its color
      const color = isInTile(destination, "potentialTile").color;
      // destroy all potential tiles
      PotentialTileFactory.forEachPotentialTile (function() {
        removeFromArray(board[this.tile()], this);
        removeFromArray(PotentialTileFactory.allPotentialTiles, this);
      });
      // deploy a power tile to destination
      board[destination].push(new PowerTile());
      // and set its color
      isInTile(destination, "powerTile").color = color;
      // create two new potential tiles and deploy them
      PotentialTileFactory.createPotentialTile();
      PotentialTileFactory.createPotentialTile();
      PotentialTileFactory.forEachPotentialTile (function() {
        this.setRandomColor();
        this.deployToRandomEmptyTile();
      });
    }
    removeFromArray(board[this.tile()], this);
    board[destination].push(this);
  }

  // given a direction and the first tile in that direction, return (the tile of an enemy in line of sight) or (false)
  // TODO: seems like I should derive the direction from the tile and the hero's current location.
  this.canShoot = function(direction, n) {
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

    else if (direction === "down") {
      while (!isInTile(n, "wall") && !isInTile(n, "enemy") && !isInTile(n, "hero")) {
        if (isAdjacent(n, downFrom(n))) {
          n = downFrom(n);
        }
        else {
          break;
        }
      }
    }

    else if (direction === "left") {
      while (!isInTile(n, "wall") && !isInTile(n, "enemy") && !isInTile(n, "hero")) {
        if (isAdjacent(n, leftFrom(n))) {
          n = leftFrom(n);
        }
        else {
          break;
        }
      }
    }

    else if (direction === "right") {
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
      return n;
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
