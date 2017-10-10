function Fuel() {

  Item.call(this);
  this.char = "f";
  this.avoids = ["wall"];
  this.type = "fuel";

  this.deployToTile = function(tile) {
    board[tile].push(this);
  }

  this.deployToEmptyCorner = function() {
    var emptyCorners = [];
    console.log(corners);
    for (var i = 0; i < corners.length; i++) {
      if (!board[corners[i]].length) {
        emptyCorners.push(corners[i]);
        console.log(emptyCorners);
      }
    }
    var destination = emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
    console.log(destination);
    this.deployToTile(destination);
  }

  this.destroy = function() {
    collectedFuel++;
    removeFromArray(board[this.tile()], this);
    advanceTurn();
    advanceLevel();
  }
}
