function Blue() {

  Item.call(this);
  this.avoids = ["wall"];
  this.type = "blue";

  this.deployToTile = function(tile) {
    board[tile].push(this);
  }
}

function Red() {

  Item.call(this);
  this.avoids = ["wall"];
  this.type = "red";

  this.deployToTile = function(tile) {
    board[tile].push(this);
  }
}

function Green() {

    Item.call(this);
    this.avoids = ["wall"];
    this.type = "green";

    this.deployToTile = function(tile) {
      board[tile].push(this);
    }
  }
