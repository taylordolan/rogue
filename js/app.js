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
    var key = e.keyCode;
    var left = "37";
    var up = "38";
    var right = "39";
    var down = "40";

    // even turns
    if (turn % 2 === 0) {
      // heroA
      if (key == up) {
        if (canMove("up", heroA.getTile())) {
          heroA.moveUp();
          advanceTurn();
        }
      }
      else if (key == down) {
        if (canMove("down", heroA.getTile())) {
          heroA.moveDown();
          advanceTurn();
        }
      }
      // heroB
      else if (key == left) {
        if (canMove("left", heroB.getTile())) {
          heroB.moveLeft();
          advanceTurn();
        }
      }
      else if (key == right) {
        if (canMove("right", heroB.getTile())) {
          heroB.moveRight();
          advanceTurn();
        }
      }
    }

    // odd turns
    else if (turn % 2 === 1) {
      // heroB
      if (key == up) {
        if (canMove("up", heroB.getTile())) {
          heroB.moveUp();
          advanceTurn();
        }
      }
      else if (key == down) {
        if (canMove("down", heroB.getTile())) {
          heroB.moveDown();
          advanceTurn();
        }
      }
      // heroA
      else if (key == left) {
        if (canMove("left", heroA.getTile())) {
          heroA.moveLeft();
          advanceTurn();
        }
      }
      else if (key == right) {
        if (canMove("right", heroA.getTile())) {
          heroA.moveRight();
          advanceTurn();
        }
      }
    }
  }
});
