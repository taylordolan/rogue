window.addEventListener("load", function() {

  setUpBoard();
  health = maxHealth;
  heroA.deployToTile(center - boardSize + 1);
  heroB.deployToTile(center + boardSize - 1);
  HunterFactory.createHunter();
  HunterFactory.forEachHunter (function() {
    if(!this.tile()) {
      this.deployToRandomEmptyEdge();
    }
  });
  PotentialTileFactory.createPotentialTile();
  PotentialTileFactory.createPotentialTile();
  PotentialTileFactory.forEachPotentialTile (function() {
    this.setRandomColor();
    this.deployToRandomEmptyTile();
  });
  advanceLevel();

  document.onkeydown = checkKey;
  function checkKey(e) {

    e = e || window.event;
    var key = e.keyCode;
    var left = 37;
    var up = 38;
    var right = 39;
    var down = 40;

    // even turns
    if (turn % 2 === 0) {
      // heroA
      if (key === up) {
        heroA.moveUp();
        advanceTurn();
      }
      else if (key === down) {
        heroA.moveDown();
        advanceTurn();
      }
      // heroB
      else if (key === left) {
        heroB.moveLeft();
        advanceTurn();
      }
      else if (key === right) {
        heroB.moveRight();
        advanceTurn();
      }
    }

    // odd turns
    else if (turn % 2 === 1) {
      // heroB
      if (key === up) {
        heroB.moveUp();
        advanceTurn();
      }
      else if (key === down) {
        heroB.moveDown();
        advanceTurn();
      }
      // heroA
      else if (key === left) {
        heroA.moveLeft();
        advanceTurn();
      }
      else if (key === right) {
        heroA.moveRight();
        advanceTurn();
      }
    }
  }
});
