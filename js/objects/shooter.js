function Shooter() {

    Enemy.call(this);
    this.char = "s";
    this.avoids = ["wall", "enemy"];
    this.shoots = true;
    this.target = function() {
      // var validTargets = [];
      // if (this.canShoot(heroA)) {
      //   validTargets.push(heroA);
      // }
      // if (this.canShoot(heroB)) {
      //   validTargets.push(heroB);
      // }
      // if (validTargets.length) {
      //   health--;
      // }

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

    // this.canShoot = function() {

    //   // if target is left of enemy
    //   // if (target.col() === this.col() && target.tile() < this.tile()) {
    //   var n = leftFrom(this.tile());
    //   while (!isInTile(n, "wall") && !isInTile(n, "enemy") && !isInTile(n, "hero")) {
    //     if (isAdjacent(n, leftFrom(n))) {
    //       n = leftFrom(n);
    //     }
    //     else {
    //       break;
    //     }
    //   }
    //   if (isInTile(n, "hero")) {
    //     return isInTile(n, "hero").tile();
    //   }
    //   // }
    //   return false;
    // }

    this.die = function() {
      switch (Math.floor(Math.random() * 3)) {
        case 0:
          new Blue().deployToTile(this.tile());
          break;
        case 1:
          new Red().deployToTile(this.tile());
          break;
        case 2:
          new Green().deployToTile(this.tile());
          break;
      }

      removeFromArray(board[this.tile()], this);
      removeFromArray(ShooterFactory.allShooters, this);
    }
  }

  ShooterFactory = {

    createShooter: function () {
      var newShooter = {};
      Shooter.apply(newShooter, arguments);
      this.allShooters.push(newShooter);
      return newShooter;
    },

    allShooters: [],

    forEachShooter: function (action) {
      for (var i = this.allShooters.length; i > 0; i--){
        action.call(this.allShooters[i - 1]);
      }
    }
  };