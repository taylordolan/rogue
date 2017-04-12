window.addEventListener("load", function() {

  heroA.deployToRandomEmptyTile();
  heroB.deployToRandomEmptyTile();
  KoboldFactory.forEachKobold (function () {
    this.deployToRandomEmptyCorner();
    this.char = "k";
  });
  renderBoard();

  document.onkeydown = checkKey;
  function checkKey(e) {
    e = e || window.event;

    // up
    if (e.keyCode == '38') {
      if (turn%2 === 0) {
        if (heroA.moveUp()) {
          turn++;
          KoboldFactory.forEachKobold (function () {
            this.pathfind();
          });
        }
      }
      else {
        if (heroB.moveUp()) {
          turn++;
          KoboldFactory.forEachKobold (function () {
            this.pathfind();
          });
        }
      }
    }
    // down
    else if (e.keyCode == '40') {
      if (turn%2 === 0) {
        if (heroA.moveDown()) {
          turn++;
          KoboldFactory.forEachKobold (function () {
            this.pathfind();
          });
        }
      }
      else {
        if (heroB.moveDown()) {
          turn++;
          KoboldFactory.forEachKobold (function () {
            this.pathfind();
          });
        }
      }
    }
    // left
    else if (e.keyCode == '37') {
      if (turn%2 === 0) {
        if (heroB.moveLeft()) {
          turn++;
          KoboldFactory.forEachKobold (function () {
            this.pathfind();
          });
        }
      }
      else {
        if (heroA.moveLeft()) {
          turn++;
          KoboldFactory.forEachKobold (function () {
            this.pathfind();
          });
        }
      }
    }
    // right
    else if (e.keyCode == '39') {
      if (turn%2 === 0) {
        if (heroB.moveRight()) {
          turn++;
          KoboldFactory.forEachKobold (function () {
            this.pathfind();
          });
        }
      }
      else {
        if (heroA.moveRight()) {
          turn++;
          KoboldFactory.forEachKobold (function () {
            this.pathfind();
          });
        }
      }
    }
    if (e.keyCode == '37' || e.keyCode == '38' || e.keyCode == '39' || e.keyCode == '40') {
      if (turn%2 === 0) {
        KoboldFactory.createKobold(turn);
        KoboldFactory.forEachKobold (function () {
          if(!this.getTile()) {
            this.deployToRandomEmptyCorner();
            this.char = "k";
          }
        });
      }
    }
    renderBoard();
  }
});
