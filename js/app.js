window.addEventListener("load", function() {

  setUpBoard();
  var startA = boardSize * boardSize / 2 - (boardSize / 2);
  var startB = boardSize * boardSize / 2 + (boardSize / 2) - 1;

  // ship.deployToTile(startA);
  // shipB.deployToTile(startB);
  // fuelA.deployToTile(boardSize - 1);
  // fuelB.deployToTile(boardSize * boardSize - boardSize);
  // generateWalls();
  // heroA.deployToTile(ship.tile());
  // heroB.deployToTile(shipB.tile());
  // createRandomEnemy();
  // render();

  advanceLevel();

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
        if (heroA.canMove("up", heroA.tile())) {
          heroA.moveUp();
          advanceTurn();
        }
      }
      else if (key == down) {
        if (heroA.canMove("down", heroA.tile())) {
          heroA.moveDown();
          advanceTurn();
        }
      }
      // heroB
      else if (key == left) {
        if (heroB.canMove("left", heroB.tile())) {
          heroB.moveLeft();
          advanceTurn();
        }
      }
      else if (key == right) {
        if (heroB.canMove("right", heroB.tile())) {
          heroB.moveRight();
          advanceTurn();
        }
      }
    }

    // odd turns
    else if (turn % 2 === 1) {
      // heroB
      if (key == up) {
        if (heroB.canMove("up", heroB.tile())) {
          heroB.moveUp();
          advanceTurn();
        }
      }
      else if (key == down) {
        if (heroB.canMove("down", heroB.tile())) {
          heroB.moveDown();
          advanceTurn();
        }
      }
      // heroA
      else if (key == left) {
        if (heroA.canMove("left", heroA.tile())) {
          heroA.moveLeft();
          advanceTurn();
        }
      }
      else if (key == right) {
        if (heroA.canMove("right", heroA.tile())) {
          heroA.moveRight();
          advanceTurn();
        }
      }
    }
  }
});
