Array.min = function( array ){
  return Math.min.apply( Math, array );
};

function Hunter (name) {

  Enemy.call(this);
  this.char = "h";
  this.avoids = ["wall", "enemy"];
  this.target = function() {
    var distHeroA = (this.distanceFromTo(this.tile(), heroA.tile()));
    var distHeroB = (this.distanceFromTo(this.tile(), heroB.tile()));
    var distShip = (this.distanceFromTo(this.tile(), ship.tile()));
    var distances = [distHeroA, distHeroB, distShip, distShip];
    var shortest = Array.min(distances);
    var closest = [];

    if (distHeroA === shortest) {
      closest.push(heroA.tile());
    }
    if (distHeroB === shortest) {
      closest.push(heroB.tile());
    }
    if (distShip === shortest) {
      closest.push(ship.tile());
    }

    return closest[Math.floor(Math.random() * closest.length)];
  }

  this.die = function() {
    if (Math.floor(Math.random() * 2)) {
      new Blue().deployToTile(this.tile());
    }
    else {
      new Red().deployToTile(this.tile());
    }
    removeFromArray(board[this.tile()], this);
    removeFromArray(HunterFactory.allHunters, this);
  }
}

HunterFactory = {

  createHunter: function () {
    var newHunter = {};
    Hunter.apply(newHunter, arguments);
    this.allHunters.push(newHunter);
    return newHunter;
  },

  allHunters: [],

  forEachHunter: function (action) {
    for (var i = this.allHunters.length; i > 0; i--){
      action.call(this.allHunters[i - 1]);
    }
  }
};
