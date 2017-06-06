function Hero() {

  Item.call(this);
  this.hasHealth = true;
  this.avoids = ["wall", "ship"];
  this.type = "hero";

  this.setTile = function(n) {
    if (board[n][0] && board[n][0].type === "enemy") {
      board[n][0].die();
    }

    else if (player.lunge && this.lunge(n)) {
      return
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
      this.avoids = ["wall"];
    }
  }

  this.lunge = function(n) {

    var here = this.tile();
    var dest = n;

    if (dest === here - boardSize && isAdjacent(dest, dest - boardSize)) {
      var lungeTarget = dest - boardSize;
    }
    else if (dest === here + boardSize && isAdjacent(dest, dest + boardSize)) {
      var lungeTarget = dest + boardSize;
    }
    else if (dest === here + 1 && isAdjacent(dest, dest + 1)) {
      var lungeTarget = dest + 1;
    }
    else if (dest === here - 1 && isAdjacent(dest, dest - 1)) {
      var lungeTarget = dest - 1;
    }

    if (lungeTarget) {
      if (board[lungeTarget][0] && board[lungeTarget][0].type === "enemy") {
        board[lungeTarget][0].die();
        board[this.tile()].pop(this);
        board[dest].push(this);
        return true;
      }
    }
    else return false;
  }

  this.deployNearShip = function() {
    var here = ship.tile();
    var up = here - boardSize;
    var down = here + boardSize;
    var left = here - 1;
    var right = here + 1;
    var upLeft = up - 1;
    var upRight = up + 1;
    var downLeft = down - 1;
    var downRight = down + 1;
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
