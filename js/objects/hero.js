function Hero() {

  Item.call(this);
  this.hasHealth = true;
  this.avoids = ["wall", "ship"];
  this.type = "hero";

  this.setTile = function(n) {
    if (board[n][0] && board[n][0].type === "enemy") {
      board[n][0].die();
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

    // can potentially deploy a hero to a space occupied by another hero.
    // I'm going to leave this as-is for now.
    board[nearShip[Math.floor(Math.random()*nearShip.length)]].push(this);
  }
}

var heroA = new Hero();
var heroB = new Hero();
heroA.char = 'a';
heroB.char = 'b';
