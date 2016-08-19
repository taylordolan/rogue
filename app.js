var map;
var score;
var tiles;

var kobold = document.createElement("div");
kobold.innerText = "k";
kobold.classList.add("char");

var hero = document.createElement("div");
hero.classList.add("char", "char--hero");
hero.innerText = "@";

var star = document.createElement("div");
star.classList.add("char", "char--star");
star.innerText = "🌟";

function spawnKobold() {
  deployToRandomEmptyTile(kobold);
}

function advanceKobold() {
  var hRow = getRow(hero);
  var hCol = getCol(hero);
  var hTile = getTile(hero);
  var kRow = getRow(kobold);
  var kCol = getCol(kobold);
  var kTile = getTile(kobold);

  if (kRow === hRow) {
    if (kTile > hTile) {
      moveLeft(kobold);
    } else {
      moveRight(kobold);
    }
  } else if (kCol === hCol) {
    if (kTile > hTile) {
      moveUp(kobold);
    } else {
      moveDown(kobold);
    }
  } else if (kCol > hCol) {
    if (kRow > hRow) {
      moveLeftOrUp(kobold);
    } else {
      moveLeftOrDown(kobold);
    }
  } else if (kCol < hCol) {
    if (kRow > hRow) {
      moveRightOrUp(kobold);
    } else {
      moveRightOrDown(kobold);
    }
  }
}

function getTile(char) {
  for (i=0; i<tiles.length; i++) {
    if (char.parentNode == tiles[i]) {
      return i;
    }
  }
}

function getCol(char) {
  if (getTile(char) === 0 || getTile(char) % 4 === 0) {
    return 0;
  } else if (getTile(char) === 1 || getTile(char) === 5 || getTile(char) === 9 || getTile(char) === 13) {
    return 1;
  } else if (getTile(char) === 2 || getTile(char) === 6 || getTile(char) === 10 || getTile(char) === 14) {
    return 2;
  } else if (getTile(char) === 3 || getTile(char) === 7 || getTile(char) === 11 || getTile(char) === 15) {
    return 3;
  }
}

function getRow(char) {
  if (getTile(char) >= 0 && getTile(char) <= 3) {
    return 0;
  } else if (getTile(char) >= 4 && getTile(char) <= 7) {
    return 1;
  } else if (getTile(char) >= 8 && getTile(char) <= 11) {
    return 2;
  } else if (getTile(char) >= 12 && getTile(char) <= 15) {
    return 3;
  }
}

function deployToRandomEmptyTile(char) {
  var emptyTiles = [];
  for(i=0; i<tiles.length; i++) {
    if (tiles[i].childNodes.length === 0) {
      emptyTiles.push(tiles[i]);
    }
  }
  emptyTiles[Math.floor(Math.random()*emptyTiles.length)].appendChild(char);
}

function moveToTile(char, tile) {
  char.parentNode.removeChild(char);
  tiles[tile].appendChild(char);
  checkForScore();
  if (char === hero) {
    advanceKobold();
  }
}

function moveUp(char) {
  if (getRow(char) > 0) {
    moveToTile(char, (getTile(char) - 4));
  }
}

function moveDown(char) {
  if (getRow(char) < 3) {
    moveToTile(char, (getTile(char) + 4));
  }
}

function moveLeft(char) {
  if (getCol(char) > 0) {
    moveToTile(char, (getTile(char) - 1));
  }
}

function moveRight(char) {
  if (getCol(char) < 3) {
    moveToTile(char, (getTile(char) + 1));
  }
}

function moveRightOrDown(char) {
  if (Math.floor(Math.random() * 2) == 0) {
    moveRight(char);
  } else {
    moveDown(char);
  }
}

function moveRightOrUp(char) {
  if (Math.floor(Math.random() * 2) == 0) {
    moveRight(char);
  } else {
    moveUp(char);
  }
}

function moveLeftOrDown(char) {
  if (Math.floor(Math.random() * 2) == 0) {
    moveLeft(char);
  } else {
    moveDown(char);
  }
}

function moveLeftOrUp(char) {
  if (Math.floor(Math.random() * 2) == 0) {
    moveLeft(char);
  } else {
    moveUp(char);
  }
}

function checkForScore() {
  if (hero.parentNode === star.parentNode) {
    scoreValue++;
    score.innerText = scoreValue;
    star.parentNode.removeChild(star);
    deployToRandomEmptyTile(star);
  }
}

window.addEventListener("load", function(){
  map = document.getElementsByClassName("map")[0];
  score = document.getElementsByClassName("score")[0];
  tiles = document.getElementsByClassName("tile");

  scoreValue = 0;
  score.innerText = scoreValue;

  deployToRandomEmptyTile(hero);
  deployToRandomEmptyTile(star);
  spawnKobold();

  document.onkeydown = checkKey;

  function checkKey(e) {
    e = e || window.event;

    if (e.keyCode == '38') {
      moveUp(hero);
    }
    else if (e.keyCode == '40') {
      moveDown(hero);
    }
    else if (e.keyCode == '37') {
      moveLeft(hero);
    }
    else if (e.keyCode == '39') {
      moveRight(hero);
    }
  }
});
