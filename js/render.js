function setUpBoard() {
  for (var i = 0; i < board.length; i++) {
    boardElement.innerHTML += "<span class='tile' data-id='" + i + "'></span>"
    if ((i + 1) % boardSize === 0) {
      boardElement.innerHTML += "<br>";
    }
  }
  tileElements = boardElement.querySelectorAll("[data-id]");
  healthElement = document.createElement("span");
  healthElement.classList.add("health");
  boardElement.appendChild(healthElement);
}

function getElement(tile) {
  for (var i = 0; i < tileElements.length; i++) {
    if (tileElements[i].getAttribute("data-id") == tile.toString()) {
      return tileElements[i];
    }
  }
}

function renderHealth() {
  healthElement.innerHTML = "";
  for (var i = 0; i < health; i++) {
    healthElement.innerHTML += "❤️";
  }
  healthElement.innerHTML += "<br>";
}

function render() {
  renderHealth();
  for (var i = 0; i < tileElements.length; i++) {
    tileElements[i].innerHTML = "";
    if (isInTile(i, "heroA")) {
      var span = document.createElement("span");
      span.innerHTML = isInTile(i, "heroA").char;
      span.classList.add("hero-a");
      tileElements[i].appendChild(span);
    }
    else if (isInTile(i, "heroB")) {
      var span = document.createElement("span");
      span.innerHTML = isInTile(i, "heroB").char;
      span.classList.add("hero-b");
      tileElements[i].appendChild(span);
    }
    else if (isInTile(i, "ship")) {
      var span = document.createElement("span");
      span.innerHTML = isInTile(i, "ship").char;
      tileElements[i].appendChild(span);
    }
    else if (isInTile(i, "wall")) {
      var span = document.createElement("span");
      span.innerHTML = isInTile(i, "wall").char;
      tileElements[i].appendChild(span);
    }
    else if (isInTile(i, "enemy")) {
      var span = document.createElement("span");
      span.innerHTML = isInTile(i, "enemy").char;
      tileElements[i].appendChild(span);
    }
    if (isInTile(i, "web")) {
      var span = document.createElement("span");
      span.innerHTML = isInTile(i, "web").char;
      tileElements[i].appendChild(span);
    }
    if (isInTile(i, "fuel")) {
      var span = document.createElement("span");
      span.innerHTML = isInTile(i, "fuel").char;
      tileElements[i].appendChild(span);
    }
    if (!board[i].length)  {
      var span = document.createElement("span");
      span.innerHTML = "·";
      tileElements[i].appendChild(span);
    }
  }

  var heroAElement = document.getElementsByClassName("hero-a")[0];
  var heroBElement = document.getElementsByClassName("hero-b")[0];
  if (turn % 2 === 0) {
    if (heroA.canMove("up", heroA.tile())) {
      heroAElement.classList.add("up");
    }
    if (heroA.canMove("down", heroA.tile())) {
      heroAElement.classList.add("down");
    }
    if (heroB.canMove("left", heroB.tile())) {
      heroBElement.classList.add("left");
    }
    if (heroB.canMove("right", heroB.tile())) {
      heroBElement.classList.add("right");
    }
  }
  if ((turn + 1) % 2 === 0) {
    if (heroB.canMove("up", heroB.tile())) {
      heroBElement.classList.add("up");
    }
    if (heroB.canMove("down", heroB.tile())) {
      heroBElement.classList.add("down");
    }
    if (heroA.canMove("left", heroA.tile())) {
      heroAElement.classList.add("left");
    }
    if (heroA.canMove("right", heroA.tile())) {
      heroAElement.classList.add("right");
    }
  }
}
