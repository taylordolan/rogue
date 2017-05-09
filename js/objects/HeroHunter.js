function HeroHunter (name) {

  Enemy.call(this);
  this.type = "enemy";
  this.char = "h";
  this.target = function() {
    var distA = (this.distanceToTile(this.getTile(), heroA.getTile()));
    var distB = (this.distanceToTile(this.getTile(), heroB.getTile()));
    if (distA < distB) {
      return heroA.getTile();
    }
    else {
      return heroB.getTile();
    }
  }

  this.die = function() {
    board[this.getTile()].splice(board[this.getTile])
    HeroHunterFactory.allHeroHunters.splice(HeroHunterFactory.allHeroHunters.indexOf(this),1);
    score++;
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
