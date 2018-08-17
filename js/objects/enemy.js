function Enemy (name) {

  Item.call(this);
  this.name = name;
  this.char = "e";
  this.type = "enemy";
  this.target = function() {
    return;
  }

  this.setTile = function(n) {

    // increase score if destination is a score tile
    if (isInTile(n, "powerTile") && isInTile(n, "powerTile").color === "purple") {
      score++;
    }

    // give health if destination is a health tile
    // TODO: maybe this should be part of a series of checks after enemies move
    if (isInTile(n, "powerTile") && isInTile(n, "powerTile").color === "red") {

      let heroAMaxed = heroA.health === maxHealth;
      let heroBMaxed = heroB.health === maxHealth;

      // if at least one hero needs health
      if (!(heroAMaxed && heroBMaxed)) {

        let here = this.tile();
        let heroADist = distanceFromTo(here, heroA.tile());
        let heroBDist = distanceFromTo(here, heroB.tile());

        // if both heroes are an equal distance away…
        if (heroADist === heroDDist) {
          // if exactly one hero has max health, increase health of the other one
          if (heroAMaxed && !heroBMaxed) {
            heroB.health++;
          }
          else if (heroBMaxed && !heroAMaxed) {
            heroB.health++;
          }
          // if both heroes need health, increase health of a random one
          else if (Math.floor(Math.random() * 2)) {
            if (heroA.health < maxHealth) {
              heroA.health++;
            }
          }
          else {
            if (heroB.health < maxHealth) {
              heroB.health++;
            }
          }
        }
        // if one hero is closer, attempt to give health to the closer one
        else {
          if (heroA.health < maxHealth) {
            heroA.health++;
          }
          else if (heroB.health < maxHealth) {
            heroB.health++;
          }
        }
      }
    }

    // if there's a hero in the destination, hit it and die
    if (isInTile(n, "hero")) {
      isInTile(n, "hero").health--;
      this.die();
    }
    // otherwise, move to the destination
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
    if (randomMoves.length) {
      this.moveWithOption(randomMoves);
    }
    return;
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

    // if enemy can move up, and up is closer than here, then "moveUp" is a valid move
    if (this.canMove("up", here) && this.distanceFromTo(up, this.target()) < this.distanceFromTo(here, this.target())) {
      validMoves.push("moveUp");
    }
    // if enemy can move down, and down is closer than here, then "moveDown" is a valid move
    if (this.canMove("down", here) && this.distanceFromTo(down, this.target()) < this.distanceFromTo(here, this.target())) {
      validMoves.push("moveDown");
    }
    // if enemy can move left, and left is closer than here, then "moveLeft" is a valid move
    if (this.canMove("left", here) && this.distanceFromTo(left, this.target()) < this.distanceFromTo(here, this.target())) {
      validMoves.push("moveLeft");
    }
    // if enemy can move right, and right is closer than here, then "moveRight" is a valid move
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
