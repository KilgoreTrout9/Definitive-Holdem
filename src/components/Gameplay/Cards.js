
// Ordered deck generator provided for your testing convenience
// (You may alter this function, but an unaltered copy will be used for tests.)
export const orderedDeck = () => {
  // var suits = ['♥', '♣', '♠', '♦'];
  // var values = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 'T', 'J', 'Q', 'K'];
  var suits = ['C', 'D', 'H', 'S'];
  var values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  var deck = [];

  suits.forEach(function (suit) {
    values.forEach(function (value) {
      deck.push([value, suit]);
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

export const dealHoldEm = (playersArray, deck, position) => {
  const numPlayers = playersArray.length
  const results = {};

  // deal hands for each player
  playersArray.forEach((player, ind) => {
    if (ind - position >= 0) {
      results[player] = [deck[ind - position], deck[ind - position + numPlayers]];
    } else {
      results[player] = [deck[ind - position + numPlayers], deck[ind - position + 2 * numPlayers]];
    }
  })

  // deal the community cards
  results['board'] = {
    'flop': deck.slice((numPlayers * 2) + 1, (numPlayers * 2) + 4),
    'turn': [deck[(numPlayers * 2) + 5]],
    'river': [deck[(numPlayers * 2) + 7]],
  }
  return results
}

const objectifyHand = (player, hand) => {
  // adds player hand to the community cards and returns an object
  let playerHand = hand[player].concat(hand.board.flop, hand.board.turn, hand.board.river)
  const handObject = {
    'ranks': {},
    'suits': {},
  };
  playerHand.forEach((card) => {
    const rank = card[0];
    const suit = card[1];
    handObject.ranks[rank] = handObject.ranks[rank] + 1 || 1;
    handObject.suits[suit] = handObject.suits[suit] + 1 || 1;
  })
  return handObject;
}

const evaluateHand = (handObj) => {
  let result = {
    hasAce: false,
    hasFlush: '',
    hasPair: false,
    hasTrips: false,
    possibleStraight: 1,
    hasStraight: false,
    handStrength: 9,
    straightRank: 0,
    keyCards: [],
    kickers: [],
  }
  let lastRank = 0
  // check for an Ace (used for straight determination)
  if (handObj.ranks['14']) result.hasAce = true;
  // check for flush
  for (let suit in handObj.suits) {
    if (handObj.suits[suit] >= 5) {
      result.hasFlush = suit;
      result.handStrength = 4;
      result.keyCards.push(suit);
      return result
    }
  }
  for (let rank in handObj.ranks) {
    // check for quads
    if (handObj.ranks[rank] === 4) {
      result.handStrength = 2;
      result.keyCards.push(rank);
      const values = Object.keys(handObj.ranks).reverse();
      if (values[0] === rank) result.kickers.push(values[1]);
      else result.kickers.push(values[0])
      return result
    }

    // check for trips
    if (handObj.ranks[rank] === 3) {
      result.hasTrips = true;
      result.keyCards.unshift(rank)
      // check for full house
      if (result.hasPair) {
        result.handStrength = 3;
        return result;
      }
      else { result.handStrength = 6 }
    }

    // check for pair
    if (handObj.ranks[rank] === 2) {
      // check for trips
      if (result.hasTrips) {
        result.handStrength = 3;
        result.keyCards.push(rank);
        return result;
      }
      // check for three pair
      result.keyCards.unshift(rank)
      if (result.keyCards.length === 3) result.keyCards.pop()
      // check for two pair
      else if (result.hasPair) { result.handStrength = 7 }
      else {
        result.hasPair = true;
        result.handStrength = 8;
      }
    }

    // check for a straight
    if (lastRank) {
      if (lastRank + 1 === parseInt(rank)) {
        result.possibleStraight += 1;
      } else {
        result.possibleStraight = 1;
      }
      if (result.possibleStraight > 4 ||
        (result.possibleStraight === 4 && rank === 5 && result.hasAce)) {
        result.hasStraight = true;
        result.handStrength = 5;
        result.keyCards = [rank];
      }
    }
    lastRank = parseInt(rank);
  }

  // fill out kicker array
  const values = Object.keys(handObj.ranks);
  if (result.handStrength === 9) {
    result.kickers = values.reverse().slice(0, 5);
  } else if (result.handStrength === 8) {
    let iterator = values.length - 1
    while (result.kickers.length < 3) {
      if (values[iterator] !== result.keyCards[0]) {
        result.kickers.push(values[iterator])
      }
      iterator--
    }
  } else if (result.handStrength === 6) {
    let iterator = values.length - 1
    while (result.kickers.length < 2) {
      if (values[iterator] !== result.keyCards[0]) {
        result.kickers.push(values[iterator])
      }
      iterator--
    }
  } else if (result.handStrength === 7) {
    let iterator = values.length - 1
    while (result.kickers.length < 1) {
      if (values[iterator] !== result.keyCards[0] && values[iterator] !== result.keyCards[1]) {
        result.kickers.push(values[iterator])
      }
      iterator--
    }
  }
  return result;
}

export const handEvaluator = (hand) => {
  const rankings = {
    winner: {}
  };
  for (let player in hand) {
    if (player !== 'board') {
      const playerHandObj = objectifyHand(player, hand);
      rankings[player] = evaluateHand(playerHandObj);

      //fill out key cards for flush
      if (rankings[player].hasFlush) {
        let fullHand = hand[player].concat(hand.board.flop, hand.board.turn, hand.board.river);
        let flushvalues = [];
        for (let i = 0; i < fullHand.length; i++) {
          if (fullHand[i][1] === rankings[player].hasFlush) {
            flushvalues.push(fullHand[i][0]);
          }
        }
        flushvalues.sort((a, b) => a - b);
        rankings[player].keyCards = flushvalues.reverse().slice(0, 5)

        //check for straight flush
        if (rankings[player].hasStraight) {
          let possibleStraightFlush = 1
          for (let j = 1; j < flushvalues.length; j++) {
            if (flushvalues[j] === flushvalues[j] + 1) {
              possibleStraightFlush++;
            } else {
              possibleStraightFlush = 1;
            }
            if (possibleStraightFlush > 4) {
              rankings[player].handStrength = 1;
              rankings[player].keyCards = [flushvalues[j]];
            }
          }
        }
      }

      // find out who won
      console.log(rankings.winner, player)
      let hasChop;
      if (!rankings.winner.name || rankings.winner.hand[0] > rankings[player].handStrength) {
        rankings.winner.name = [player];
        rankings.winner.hand = [rankings[player].handStrength, rankings[player].keyCards, rankings[player].kickers];
      } else if (rankings.winner.hand[0] === rankings[player].handStrength) {
        hasChop = true;
        let position = 0;
        let winnerCards = [...rankings.winner.hand[1], ...rankings.winner.hand[2]];
        let playerCards = [...rankings[player].keyCards, ...rankings[player].kickers];
        while (hasChop && position < winnerCards.length) {
          if (winnerCards[position] === playerCards[position]) {
            position++
          } else {
            if (winnerCards[position] < playerCards[position]) {
              rankings.winner.name = [player];
              rankings.winner.hand = [rankings[player].handStrength, rankings[player].keyCards, rankings[player].kickers];
            }
            hasChop = false;
          }
        }
        console.log(winnerCards, playerCards)
        if (hasChop) {
          rankings.winner.name.push(player);
        }
      }
    }
  }
  return rankings
}