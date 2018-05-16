function PotentialTile() {

  Item.call(this);
  this.char = "•";
  this.type = "potentialTile";
  this.color = "";

  this.setRandomColor = function() {
    var possibleColors = ["green", "blue", "red", "purple"];
    var randomColor = possibleColors[Math.floor(Math.random() * possibleColors.length)];
    this.color = randomColor;
  }

  this.deploy = () => {
    let options = [];
    let minDistance = 2;
    for (let i = 0; i < board.length; i++) {
      if (
        board[i].length === 0 &&
        heroA.distanceFromTo(heroA.tile(), i) >= minDistance &&
        heroA.distanceFromTo(heroB.tile(), i) >= minDistance
      ) {
        options.push(i);
      }
    }
    let randomOption = Math.floor(Math.random() * options.length);
    this.deployToTile(options[randomOption]);
  }
}

PotentialTileFactory = {

  createPotentialTile: function() {
    var newPotentialTile = {};
    PotentialTile.apply(newPotentialTile, arguments);
    this.allPotentialTiles.push(newPotentialTile);
    return newPotentialTile;
  },

  allPotentialTiles: [],

  forEachPotentialTile: function(action) {
    for (var i = this.allPotentialTiles.length; i > 0; i--){
      action.call(this.allPotentialTiles[i - 1]);
    }
  },
};
