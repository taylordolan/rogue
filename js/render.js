var tileElements = [];
var healthElement;

function newRender() {
  for (var i = 0; i < board.length; i++) {
    boardElement.innerHTML += "<span data-id='" + i + "'></span>"
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
    if (tileIncludes(i, "heroA")) {
      var span = document.createElement("span");
      span.innerHTML = tileIncludes(i, "heroA").char;
      span.classList.add("hero-a");
      tileElements[i].appendChild(span);
    }
    else if (tileIncludes(i, "heroB")) {
      var span = document.createElement("span");
      span.innerHTML = tileIncludes(i, "heroB").char;
      span.classList.add("hero-b");
      tileElements[i].appendChild(span);
    }
    else if (tileIncludes(i, "ship")) {
      var span = document.createElement("span");
      span.innerHTML = tileIncludes(i, "ship").char;
      tileElements[i].appendChild(span);
    }
    else if (tileIncludes(i, "wall")) {
      var span = document.createElement("span");
      span.innerHTML = tileIncludes(i, "wall").char;
      tileElements[i].appendChild(span);
    }
    else if (tileIncludes(i, "enemy")) {
      var span = document.createElement("span");
      span.innerHTML = tileIncludes(i, "enemy").char;
      tileElements[i].appendChild(span);
    }
    if (tileIncludes(i, "web")) {
      var span = document.createElement("span");
      span.classList.add("web");
      span.innerHTML = tileIncludes(i, "web").char;
      tileElements[i].appendChild(span);
    }
    if (tileIncludes(i, "fuel")) {
      var span = document.createElement("span");
      span.innerHTML = tileIncludes(i, "fuel").char;
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
