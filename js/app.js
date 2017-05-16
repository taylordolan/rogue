window.addEventListener("load", function() {

  ship.deployToCenterTile();
  heroA.deployToRandomEmptyTile();
  heroB.deployToRandomEmptyTile();
  createRandomEnemy();
  generateWalls();
  renderBoard();

  document.onkeydown = checkKey;
  function checkKey(e) {
    e = e || window.event;

    // up
    if (e.keyCode == '38') {
      if (turn%2 === 0) {
        if (heroA.moveUp()) {
          ShipHunterFactory.forEachShipHunter (function () {
            this.pathfind();
          });
          HeroHunterFactory.forEachHeroHunter (function () {
            this.pathfind();
          });
        }
      }
      else {
        if (heroB.moveUp()) {
          ShipHunterFactory.forEachShipHunter (function () {
            this.pathfind();
          });
          HeroHunterFactory.forEachHeroHunter (function () {
            this.pathfind();
          });
        }
      }
    }
    // down
    else if (e.keyCode == '40') {
      if (turn%2 === 0) {
        if (heroA.moveDown()) {
          ShipHunterFactory.forEachShipHunter (function () {
            this.pathfind();
          });
          HeroHunterFactory.forEachHeroHunter (function () {
            this.pathfind();
          });
        }
      }
      else {
        if (heroB.moveDown()) {
          ShipHunterFactory.forEachShipHunter (function () {
            this.pathfind();
          });
          HeroHunterFactory.forEachHeroHunter (function () {
            this.pathfind();
          });
        }
      }
    }
    // left
    else if (e.keyCode == '37') {
      if (turn%2 === 0) {
        if (heroB.moveLeft()) {
          ShipHunterFactory.forEachShipHunter (function () {
            this.pathfind();
          });
          HeroHunterFactory.forEachHeroHunter (function () {
            this.pathfind();
          });
        }
      }
      else {
        if (heroA.moveLeft()) {
          ShipHunterFactory.forEachShipHunter (function () {
            this.pathfind();
          });
          HeroHunterFactory.forEachHeroHunter (function () {
            this.pathfind();
          });
        }
      }
    }
    // right
    else if (e.keyCode == '39') {
      if (turn%2 === 0) {
        if (heroB.moveRight()) {
          ShipHunterFactory.forEachShipHunter (function () {
            this.pathfind();
          });
          HeroHunterFactory.forEachHeroHunter (function () {
            this.pathfind();
          });
        }
      }
      else {
        if (heroA.moveRight()) {
          ShipHunterFactory.forEachShipHunter (function () {
            this.pathfind();
          });
          HeroHunterFactory.forEachHeroHunter (function () {
            this.pathfind();
          });
        }
      }
    }
    if (e.keyCode == '37' || e.keyCode == '38' || e.keyCode == '39' || e.keyCode == '40') {
      if (turn && turn%4 === 0) {
        createRandomEnemy();
      }
    }
    renderBoard();
  }
});
