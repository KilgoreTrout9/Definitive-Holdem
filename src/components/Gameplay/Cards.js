
// Ordered deck generator provided for your testing convenience
// (You may alter this function, but an unaltered copy will be used for tests.)
export const orderedDeck = () => {
  var suits = ['♥', '♣', '♠', '♦'];
  var values = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];
  var deck = [];

  suits.forEach(function (suit) {
    values.forEach(function (value) {
      deck.push(value + suit);
    });
  });

  return deck;
};

export const shuffleDeck = (deck) => {
  // initialize a new array
  var shuffledDeck = [];
  var tempDeck = orderedDeck();
  // iterate through the deck backward
  for (var i = tempDeck.length - 1; i >= 0; i--) {
    // pull out a card at random
    let newCard = Math.floor(Math.random() * (i + 1));
    shuffledDeck.push(tempDeck[newCard]);
    tempDeck.splice(newCard, 1);
  }
  return shuffledDeck;
};

export const dealHoldEm = (playersArray, deck) => {
  const numPlayers = playersArray.length
  const results = {};
  playersArray.forEach((player, ind) => {
    results[player] = [deck[ind], deck[ind + numPlayers]];
  })
  results['board'] = {
    'flop': [deck.slice((numPlayers * 2) + 1, (numPlayers * 2) + 4)],
    'turn': [deck[(numPlayers * 2) + 5]],
    'river': [deck[(numPlayers * 2) + 7]],
  }
  return results
}