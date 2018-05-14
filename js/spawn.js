// set up decks and draw rate
let enemyDeck = [];
let enemyDiscard = [];
let increaseDeck = [];
let increaseDiscard = [];
let drawRate = 4;

// populate enemy deck
for (let i = 0; i < 75; i++) {
  enemyDeck.push(0);
}

for (let i = 0; i < 3; i++) {
  enemyDeck.push(1);
}

// populate increase deck
for (let i = 0; i < 30; i++) {
  increaseDeck.push(0);
}

for (let i = 0; i < 1; i++) {
  increaseDeck.push(1);
}


let getIndex = (deck) => {
  let index = Math.floor(Math.random() * deck.length);
  return index;
}

let discardAtIndex = (index, deck, discard) => {
  discard.push(deck[index]);
  deck.splice(index, 1);
}

let maybeSpawnEnemies = () => {

  // draw a card from the increase deck. if it's a 1, increase the spawn rate.
  let increaseIndex = getIndex(increaseDeck);
  if (increaseDeck[increaseIndex]) {
    drawRate++;
  }
  discardAtIndex(increaseIndex, increaseDeck, increaseDiscard);
  // if the increase deck is empty, create a new increase deck from the discard pile
  if (increaseDeck.length === 0) {
    increaseDeck = increaseDiscard.slice(0);
    increaseDiscard.length = 0;
  }

  // draw cards from the enemy deck equal to the draw rate. for each 1, spawn an enemy.
  for (let i = 0; i < drawRate; i++) {
    let enemyIndex = getIndex(enemyDeck);
    if (enemyDeck[enemyIndex]) {
      HunterFactory.createHunter();
      HunterFactory.forEachHunter (function() {
        if(!this.tile()) {
          this.deployToRandomEmptyEdge();
        }
      });
    }
    discardAtIndex(enemyIndex, enemyDeck, enemyDiscard);
    // if the enemy deck is empty, create a new enemy deck from the discard pile
    if (enemyDeck.length === 0) {
      enemyDeck = enemyDiscard.slice(0);
      enemyDiscard.length = 0;
    }
  }
}
