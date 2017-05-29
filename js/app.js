window.addEventListener("load", function() {

  ship.deployToCenterTile();
  heroA.deployNearShip();
  heroB.deployNearShip();
  fuelA.deploy();
  fuelB.deploy();
  createRandomEnemy();
  generateWalls();
  renderBoard();

  document.onkeydown = checkKey;
  function checkKey(e) {

    e = e || window.event;
    var key = e.keyCode;
    var left = "37";
    var up = "38";
    var right = "39";
    var down = "40";

    // even turns
    if (turn % 2 === 0) {
      // heroA
      if (key == up) {
        if (canMove("up", heroA.tile())) {
          heroA.moveUp();
          advanceTurn();
        }
      }
      else if (key == down) {
        if (canMove("down", heroA.tile())) {
          heroA.moveDown();
          advanceTurn();
        }
      }
      // heroB
      else if (key == left) {
        if (canMove("left", heroB.tile())) {
          heroB.moveLeft();
          advanceTurn();
        }
      }
      else if (key == right) {
        if (canMove("right", heroB.tile())) {
          heroB.moveRight();
          advanceTurn();
        }
      }
    }

    // odd turns
    else if (turn % 2 === 1) {
      // heroB
      if (key == up) {
        if (canMove("up", heroB.tile())) {
          heroB.moveUp();
          advanceTurn();
        }
      }
      else if (key == down) {
        if (canMove("down", heroB.tile())) {
          heroB.moveDown();
          advanceTurn();
        }
      }
      // heroA
      else if (key == left) {
        if (canMove("left", heroA.tile())) {
          heroA.moveLeft();
          advanceTurn();
        }
      }
      else if (key == right) {
        if (canMove("right", heroA.tile())) {
          heroA.moveRight();
          advanceTurn();
        }
      }
    }
  }
});
