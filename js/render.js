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
    if (tileElements[i].getAttribute("data-id") == tile) {
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
  for (var i = 0; i < tileElements.length; i++) {
    tileElements[i].innerHTML = "";
    if (i === heroA.tile()) {
      var span = document.createElement("span");
      span.innerHTML = isInTile(i, "hero").char;
      span.classList.add("hero-a");
      tileElements[i].appendChild(span);
    }
    else if (i === heroB.tile()) {
      var span = document.createElement("span");
      span.innerHTML = isInTile(i, "hero").char;
      span.classList.add("hero-b");
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
    else {
      var span = document.createElement("span");
      span.innerHTML = "·";
      tileElements[i].appendChild(span);
    }
  }

  var heroATile = getElement(heroA.tile());
  var heroBTile = getElement(heroB.tile());
  var heroAElement = heroATile.children[0];
  var heroBElement = heroBTile.children[0];

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

  renderHealth();
}
