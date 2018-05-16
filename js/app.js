window.addEventListener("load", function() {

  setUpBoard();
  health = maxHealth;
  heroA.deployToTile(heroAStart);
  heroB.deployToTile(heroBStart);
  generateWalls();
  PotentialTileFactory.createPotentialTile();
  PotentialTileFactory.createPotentialTile();
  PotentialTileFactory.createPotentialTile();
  PotentialTileFactory.forEachPotentialTile (function() {
    this.setRandomColor();
    this.deploy();
  });
  render();

  document.onkeyup = checkKeyUp;
  function checkKeyUp(e) {
    e = e || window.event;
    if (e.keyCode === 16) {
      shiftKeyDown = false;
      render();
    }
  }

  document.onkeydown = checkKeyDown;
  function checkKeyDown(e) {

    e = e || window.event;
    var key = e.keyCode;
    var shift = e.shiftKey;
    var left = 37;
    var up = 38;
    var right = 39;
    var down = 40;

    if (key === 16) {
      shiftKeyDown = true;
      render();
    }

    // heroA
    if (!shift) {
      if (key === up) {
        heroA.moveUp();
        advanceTurn();
      }
      else if (key === down) {
        heroA.moveDown();
        advanceTurn();
      }
      else if (key === left) {
        heroA.moveLeft();
        advanceTurn();
      }
      else if (key === right) {
        heroA.moveRight();
        advanceTurn();
      }
    }
    // heroB
    else {
      if (key === up) {
        heroB.moveUp();
        advanceTurn();
      }
      else if (key === down) {
        heroB.moveDown();
        advanceTurn();
      }
      else if (key === left) {
        heroB.moveLeft();
        advanceTurn();
      }
      else if (key === right) {
        heroB.moveRight();
        advanceTurn();
      }
    }
  }
});
