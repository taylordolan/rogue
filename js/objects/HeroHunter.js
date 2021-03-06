function HeroHunter (name) {

  Enemy.call(this);
  this.char = "h";
  this.avoids = ["wall", "ship", "enemy"];
  this.target = function() {
    var distA = (this.distanceFromTo(this.tile(), heroA.tile()));
    var distB = (this.distanceFromTo(this.tile(), heroB.tile()));
    if (distA < distB) {
      return heroA.tile();
    }
    else {
      return heroB.tile();
    }
  }

  this.die = function() {
    removeFromArray(board[this.tile()], this);
    removeFromArray(HeroHunterFactory.allHeroHunters, this);
  }
}

HeroHunterFactory = {

  createHeroHunter: function () {
    var newHeroHunter = {};
    HeroHunter.apply(newHeroHunter, arguments);
    this.allHeroHunters.push(newHeroHunter);
    return newHeroHunter;
  },

  allHeroHunters: [],

  forEachHeroHunter: function (action) {
    for (var i = 0; i < this.allHeroHunters.length; i++){
      action.call(this.allHeroHunters[i]);
    }
  }
};
