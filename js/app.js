window.addEventListener("load", function() {

  setUpBoard();
  // var startA = boardSize * boardSize / 2 - (boardSize / 2);
  // var startB = boardSize * boardSize / 2 + (boardSize / 2) - 1;
  health = maxHealth;
  ship.deployToTile(start);
  heroA.deployToTile(ship.tile() - boardSize + 1);
  heroB.deployToTile(ship.tile() + boardSize - 1);
  createRandomEnemy();
  advanceLevel();

  document.onkeydown = checkKey;
  function checkKey(e) {

    e = e || window.event;
    var key = e.keyCode;
    var left = "37";
    var up = "38";
    var right = "39";
    var down = "40";
    var rest = "32";
    var shif = "16";

    // if (key = shift) {
    //   shift();
    // }

    if (key == rest) {
      advanceTurn();
    }

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
