function getCol(n) {
  for (var i=0; i<mapSize; i++) {
    if ((n - i) % mapSize === 0) {
      return i;
    }
  }
}

function getRow(n) {
  for (var i=1; i<=mapSize; i++) {
    if (n < mapSize * i) {
      return i - 1;
    }
  }
}

KoboldFactory = {
  createKobold: function () {
    var newKobold = {};
    Kobold.apply(newKobold, arguments);
    this.allKobolds.push(newKobold);
    return newKobold;
  },

  allKobolds: [],

  forEachKobold: function (action) {
    for (var i = 0; i < this.allKobolds.length; i++){
      action.call(this.allKobolds[i]);
    }
  }
};

function renderBoard() {
  map = document.getElementsByClassName("map")[0];
  map.innerHTML = '';
  if (health > 0) {
    map.innerHTML += health;
  } else {
    map.innerHTML += "0";
  }
  // map.innerHTML += "&nbsp";
  if (score > 9) {
    for (var i=0; i<mapSize-3; i++) {
      map.innerHTML += "&nbsp;";
    }
  } else {
    for (var i=0; i<mapSize-2; i++) {
      map.innerHTML += "&nbsp;";
    }
  }
  map.innerHTML += score + "<br><br>";
  if (health < 1) {
    for (var i=0; i<mapSize; i++) {
      for (var j=0; j<mapSize; j++) {
        map.innerHTML += "x";
      }
      map.innerHTML += "<br>";
    }
  } else {
    for (var i=0; i<board.length; i++) {
      // for tiles that are populated, render their letters
      if (board[i].length) {
        map.innerHTML += board[i][0].char;
      }
      // on even numbered turns, put '•' above and below hero A
      else if (turn % 2 === 0 && (i === heroA.getTile() - mapSize || i === heroA.getTile() + mapSize)) {
        map.innerHTML += '•';
      }
      // on odd numbered turns, put '•' above and below hero B
      else if (i === heroB.getTile() - mapSize && (turn + 1) % 2 === 0 || i === heroB.getTile() + mapSize && (turn + 1) % 2 === 0) {
        map.innerHTML += '•';
      }
      // on odd numbered turns, put '•' to the left and right of hero A
      else if ((turn + 1) % 2 === 0 && (i === heroA.getTile() - 1 && (i + 1) % mapSize !== 0 || i === heroA.getTile() + 1 && i % mapSize !== 0)) {
        map.innerHTML += '•';
      }
      // on odd numbered turns, put '•' to the left and right of hero B
      else if (turn % 2 === 0 && (i === heroB.getTile() - 1 && (i + 1) % mapSize !== 0 || i === heroB.getTile() + 1 && i % mapSize !== 0)) {
        map.innerHTML += '•';
      }
      // put '.' on empty tiles
      else if (board[i].length === 0) {
        map.innerHTML += '.';
      }
      // insert line breaks
      if ((i + 1) % mapSize === 0) {
        map.innerHTML += '<br>';
      }
    }
  }
  map.innerHTML += "<br><br>";
}

KoboldFactory.createKobold("hi");
