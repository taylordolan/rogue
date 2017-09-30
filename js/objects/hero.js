function Hero() {

  Item.call(this);
  this.hasHealth = true;
  this.avoids = ["wall", "ship", "hero"];
  this.type = "hero";

  this.setTile = function(n) {
    var destroyWalls = player.abilities.destroyWalls.enabled;
    var shoot = player.abilities.shoot.enabled;
    var webs = player.abilities.webs.enabled;

    if (destroyWalls) {
      removeFromArray(this.avoids, "wall");
    }

    if (destroyWalls && this.destroyWalls(n)) {
      removeFromArray(board[this.tile()], this);
      board[n].push(this);
      return;
    }

    if (shoot) {

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
      isInTile(n, "fuel").destroy();
      if (webs && !isInTile(this.tile(), "web")) {
        this.web(this.tile());
      }
      removeFromArray(board[this.tile()], this);
      board[n].push(this);
    }

    else if (!this.shouldAvoid(n)) {
      if (webs && !isInTile(this.tile(), "web")) {
        this.web(this.tile());
      }
      removeFromArray(board[this.tile()], this);
      board[n].push(this);
    }
  }

  this.web = function(tile) {
    new Web().deploy(tile);
  }

  this.destroyWalls = function(n) {
    var surrounding = [];
    for (var i = 0; i < board.length; i++) {
      if (this.distanceFromTo(i, n) <= 4) {
        surrounding.push(i);
      }
      // xxxxx
      // xxxxx
      // xxaxx
      // xxxxx
      // xxxxx
      // if (this.col() >= 2 && this.row() >= 2) {
      //   surrounding.push(this.tile() - boardSize * 2 - 2);
      // }
      // if (this.col() >= 1 && this.row() >= 2) {
      //   surrounding.push(this.tile() - boardSize * 2 - 1);
      // }
      // if (this.col() <= boardSize - 2 && this.row() >= 2) {
      //   surrounding.push(this.tile() - boardSize * 2 + 1);
      // }
      // if (this.col() <= boardSize - 3 && this.row() >= 2) {
      //   surrounding.push(this.tile() - boardSize * 2 + 2);
      // }
      // if (this.col() >= 2 && this.row() >= 1) {
      //   surrounding.push(this.tile() - boardSize - 2);
      // }
      // if (this.col() <= boardSize - 3 && this.row() >= 1) {
      //   surrounding.push(this.tile() - boardSize + 2);
      // }
      // if (this.col() >= 2 && this.row() <= boardSize - 2) {
      //   surrounding.push(this.tile() + boardSize - 2);
      // }
      // if (this.col() <= boardSize - 3 && this.row() <=  boardSize - 2) {
      //   surrounding.push(this.tile() + boardSize + 2);
      // }
      // if (this.col >= 2 && this.row <= boardSize - 3) {
      //   surrounding.push(this.tile() + boardSize * 2 - 2);
      // }
      // if (this.col >= 1 && this.row <= boardSize - 3) {
      //   surrounding.push(this.tile() + boardSize * 2 - 1);
      // }
      // if (this.col <= boardSize - 2 && this.row <= boardSize - 3) {
      //   surrounding.push(this.tile() + boardSize * 2 + 1);
      // }
      // if (this.col <= boardSize - 3 && this.row <= boardSize - 3) {
      //   surrounding.push(this.tile() + boardSize * 2 + 2);
      // }
    }
    if (isWall(n)) {
      board[n][0].destroy();
      for (var i = 0; i < surrounding.length; i++) {
        surrounding[i]
      }
      for (var i = 0; i < surrounding.length; i++) {
        if (isInTile(surrounding[i], "enemy")) {
          isInTile(surrounding[i], "enemy").die();
        }
      }
      // HeroHunterFactory.forEachHeroHunter(function() {this.die()});
      // ShipHunterFactory.forEachShipHunter(function() {this.die()});
      return true;
    }
    else {
      return false;
    }
  }

  this.shoot = function(direction, n) {

    if (direction === "up") {
      while (!isInTile(n, "wall") && !isInTile(n, "enemy") && !isInTile(n, "hero") && !isInTile(n, "ship")) {
        if (isAdjacent(n, upFrom(n))) {
          n = upFrom(n);
        }
        else {
          break;
        }
      }
    }
    if (direction === "down") {
      while (!isInTile(n, "wall") && !isInTile(n, "enemy") && !isInTile(n, "hero") && !isInTile(n, "ship")) {
        if (isAdjacent(n, downFrom(n))) {
          n = downFrom(n);
        }
        else {
          break;
        }
      }
    }
    if (direction === "left") {
      while (!isInTile(n, "wall") && !isInTile(n, "enemy") && !isInTile(n, "hero") && !isInTile(n, "ship")) {
        if (isAdjacent(n, leftFrom(n))) {
          n = leftFrom(n);
        }
        else {
          break;
        }
      }
    }
    if (direction === "right") {
      while (!isInTile(n, "wall") && !isInTile(n, "enemy") && !isInTile(n, "hero") && !isInTile(n, "ship")) {
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

  this.deployNearShip = function() {
    if (this.tile()) {
      removeFromArray(board[this.tile()], this);
    }
    var here = ship.tile();
    var up = upFrom(here);
    var down = downFrom(here);
    var left = leftFrom(here);
    var right = rightFrom(here);
    var upLeft = upFrom(here) - 1;
    var upRight = upFrom(here) + 1;
    var downLeft = downFrom(here) - 1;
    var downRight = downFrom(here) + 1;
    var nearShip = [up, down, left, right, upLeft, upRight, downLeft, downRight];
    var nearShipAndEmpty = [];

    for (var i = 0; i < nearShip.length; i++) {
      if (!board[nearShip[i]].length) {
        nearShipAndEmpty.push(nearShip[i]);
      }
    }

    board[nearShipAndEmpty[Math.floor(Math.random()*nearShipAndEmpty.length)]].push(this);
  }
}

var heroA = new Hero();
var heroB = new Hero();
heroA.char = "a";
heroB.char = "b";
