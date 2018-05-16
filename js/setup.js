let board = [];
let boardElement = document.getElementsByClassName("board")[0];
let boardSize = 9;
let corners = [0, boardSize - 1, boardSize * boardSize - boardSize, boardSize * boardSize - 1];
let healthElement;
let heroAStart;
let heroBStart;
let level = 0;
let maxHealth = 4;
let score = 0;
let tileElements = [];
let turn = 0;
let shiftKeyDown = false;
let powerStart1;
let powerStart2;

// if boardSize is odd
if (boardSize % 2) {
  let half = Math.floor(boardSize * boardSize / 2);
  heroAStart = half - boardSize + 1;
  heroBStart = half + boardSize - 1;
  powerStart1 = heroAStart - 2;
  powerStart2 = heroBStart + 2;
}
// if boardSize is even
else {
  let half = boardSize * boardSize / 2;
  heroAStart = half - boardSize / 2;
  heroBStart = half + boardSize / 2 - 1;
  powerStart1 = heroAStart - 1 - boardSize;
  powerStart2 = heroBStart + 1 + boardSize;
}

for (let i = 0; i < boardSize * boardSize; i++) {
  board[i] = [];
}
