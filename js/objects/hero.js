function Hero() {

  Item.call(this);
  this.hasHealth = true;
  this.avoids = ["wall", "ship"];
  this.type = "hero";

  this.setTile = function(n) {

    if (player.moveThroughWalls || player.destroyWalls) {
      var index = this.avoids.indexOf("wall");
      if (index !== -1) {
        this.avoids.splice(index, 1);
      }
    }

    if (player.destroyWalls && this.destroyWalls(n)) {
      board[this.tile()].pop(this);
      board[n].push(this);
      return;
    }

    if (player.shoot) {

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

    if (board[n][0] && board[n][0].type === "enemy") {
      board[n][0].die();
    }

    else if (isWall(n) && player.moveThroughWalls) {

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
      this.setTile(this.moveThroughWalls(d, n));
    }

    else if (player.lunge && this.lunge(n)) {
      return;
    }

    else if (board[n][0] && board[n][0].type === "fuel") {
      board[n][0].destroy();
      board[this.tile()].pop(this);
      board[n].push(this);
    }

    else if (!this.shouldAvoid(n)) {
      board[this.tile()].pop(this);
      board[n].push(this);
    }

    if (score === 2) {
      var index = this.avoids.indexOf("ship");
      if (index !== -1) {
        this.avoids.splice(index, 1);
      }
    }
  }

  this.destroyWalls = function(n) {

    var surrounding = [];
    for (var i = 0; i < board.length; i++) {
      if (this.distanceFromTo(i, n) <= 3) {
        // console.log(i);
        surrounding.push(i);
      }
    }

    if (isWall(n)) {
      board[n][0].destroy();

      for (var i = 0; i < surrounding.length; i++) {
        if (isEnemy(surrounding[i])) {
          board[surrounding[i]][0].die();
        }
      }
      return true;
    }
    else {
      return false;
    }
  }

  this.shoot = function(direction, n) {

    if (direction === "up") {
      console.log(n);
      while (!isWall(n) && !isEnemy(n)) {
        if (isAdjacent(n, upFrom(n))) {
          n = upFrom(n);
        }
        else {
          break;
        }
      }
    }
    if (direction === "down") {
      console.log(n);
      while (!isWall(n) && !isEnemy(n)) {
        if (isAdjacent(n, downFrom(n))) {
          n = downFrom(n);
        }
        else {
          break;
        }
      }
    }
    if (direction === "left") {
      console.log(n);
      while (!isWall(n) && !isEnemy(n)) {
        if (isAdjacent(n, leftFrom(n))) {
          n = leftFrom(n);
        }
        else {
          break;
        }
      }
    }
    if (direction === "right") {
      console.log(n);
      while (!isWall(n) && !isEnemy(n)) {
        if (isAdjacent(n, rightFrom(n))) {
          n = rightFrom(n);
        }
        else {
          break;
        }
      }
    }
    if (isEnemy(n)) {
      board[n][0].die();
      return true;
    }
    else {
      return false;
    }
  }

  this.lunge = function(n) {

    var here = this.tile();

    if (n === upFrom(here) && isAdjacent(n, upFrom(n))) {
      var target = upFrom(n);
    }
    else if (n === downFrom(here) && isAdjacent(n, downFrom(n))) {
      var target = downFrom(n);
    }
    else if (n === rightFrom(here) && isAdjacent(n, rightFrom(n))) {
      var target = rightFrom(n);
    }
    else if (n === leftFrom(here) && isAdjacent(n, leftFrom(n))) {
      var target = leftFrom(n);
    }

    if (target) {
      if (board[target][0] && board[target][0].type === "enemy") {
        board[target][0].die();
        board[this.tile()].pop(this);
        board[n].push(this);
        return true;
      }
    }
    else return false;
  }

  this.moveThroughWalls = function(direction, n) {

    if (direction === "up") {
      while (isWall(n)) {
        n = upFrom(n);
      }
    }
    else if (direction === "down") {
      while (isWall(n)) {
        n = downFrom(n);
      }
    }
    else if (direction === "left") {
      while (isWall(n)) {
        n = leftFrom(n);
      }
    }
    else if (direction === "right") {
      while (isWall(n)) {
        n = rightFrom(n);
      }
    }
    return n;
  }

  this.deployNearShip = function() {
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
heroA.char = 'a';
heroB.char = 'b';
