function AdvanceTile() {

  Item.call(this);
  this.char = "O";
  this.avoids = ["wall"];
  this.type = "advanceTile";

  this.minDistance = 4;

  this.deployToTile = function(tile) {
    board[tile].push(this);
  }

  this.deployToRandomTile = function() {
    // var otherAdvanceTileExists = false;
    // var validDestinations = [];

    // for (var i = 0; i < board.length(); i++) {
    //   if (!board[i].length) {
    //     validDestinations.push(i);
    //   }
    //   if (isInTile(i, "advanceTile")) {
    //     otherAdvanceTileExists = true;
    //   }
    // }

    // if (otherAdvanceTileExists) {
    //   for (validDestinations.length)
    // }

    var destination;
    do {
      destination = Math.floor(Math.random() * board.length);
    } while (board[destination].length || heroA.distanceFromTo(heroA.tile(), destination) < this.minDistance || heroB.distanceFromTo(heroB.tile(), destination) < this.minDistance);
    this.deployToTile(destination);
  }

  this.destroy = function() {
    removeFromArray(board[this.tile()], this);
  }
}
