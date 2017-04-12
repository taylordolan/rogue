function getColFromTile(n) {
  for (var i=0; i<boardSize; i++) {
    if ((n - i) % boardSize === 0) {
      return i;
    }
  }
}

function getRowFromTile(n) {
  for (var i=0; i<boardSize; i++) {
    if (n < boardSize * (i + 1)) {
      return i;
    }
  }
}

function renderBoard() {
  // reset score contents
  scoreElement.innerHTML = '';
  scoreElement.innerHTML += health;
  for (var i=0; i<boardSize-3; i++) {
    scoreElement.innerHTML += "&nbsp;";
  }
  if (score < 9) {
    scoreElement.innerHTML += "&nbsp;";
  }
  scoreElement.innerHTML += score;
  scoreElement.innerHTML += "<br><br>";

  // reset board contents
  boardElement.innerHTML = '';
  if (health < 1) {
    for (var i=0; i<boardSize; i++) {
      for (var j=0; j<boardSize; j++) {
        boardElement.innerHTML += "x";
      }
      boardElement.innerHTML += "<br>";
    }
  } else {
    for (var i=0; i<board.length; i++) {
      // for tiles that are populated, render their letters
      if (board[i].length) {
        boardElement.innerHTML += board[i][0].char;
      }
      // on even numbered turns, put '•' above and below hero A
      else if (turn % 2 === 0 && (i === heroA.getTile() - boardSize || i === heroA.getTile() + boardSize)) {
        boardElement.innerHTML += '•';
      }
      // on odd numbered turns, put '•' above and below hero B
      else if (i === heroB.getTile() - boardSize && (turn + 1) % 2 === 0 || i === heroB.getTile() + boardSize && (turn + 1) % 2 === 0) {
        boardElement.innerHTML += '•';
      }
      // on odd numbered turns, put '•' to the left and right of hero A
      else if ((turn + 1) % 2 === 0 && (i === heroA.getTile() - 1 && (i + 1) % boardSize !== 0 || i === heroA.getTile() + 1 && i % boardSize !== 0)) {
        boardElement.innerHTML += '•';
      }
      // on odd numbered turns, put '•' to the left and right of hero B
      else if (turn % 2 === 0 && (i === heroB.getTile() - 1 && (i + 1) % boardSize !== 0 || i === heroB.getTile() + 1 && i % boardSize !== 0)) {
        boardElement.innerHTML += '•';
      }
      // put '.' on empty tiles
      else if (board[i].length === 0) {
        boardElement.innerHTML += '.';
      }
      // insert line breaks
      if ((i + 1) % boardSize === 0) {
        boardElement.innerHTML += '<br>';
      }
    }
  }
  boardElement.innerHTML += "<br><br>";
}
