var map = document.getElementsByClassName("map")[0];
var tiles = document.getElementsByClassName("tile");
var hero = document.createElement("div");
hero.classList.add("char", "char--hero");
hero.innerText = "@";
var star = document.createElement("div");
star.classList.add("char", "char--star");
star.innerText = "🌟";

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

window.addEventListener("load", function(){
  deployToRandomEmptyTile(hero);
  deployToRandomEmptyTile(star);

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
