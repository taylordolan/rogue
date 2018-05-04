Array.min = function( array ){
  return Math.min.apply( Math, array );
};

function Hunter() {

  Enemy.call(this);
  this.char = "h";
  this.avoids = ["wall", "enemy"];
  this.target = function() {
    var distHeroA = (this.distanceFromTo(this.tile(), heroA.tile()));
    var distHeroB = (this.distanceFromTo(this.tile(), heroB.tile()));
    var distances = [distHeroA, distHeroB];
    var shortest = Array.min(distances);
    var closest = [];

    if (distHeroA === shortest) {
      closest.push(heroA.tile());
    }
    if (distHeroB === shortest) {
      closest.push(heroB.tile());
    }

    return closest[Math.floor(Math.random() * closest.length)];
  }

  this.die = function() {

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
