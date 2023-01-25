import React, { useState, useEffect } from 'react';
// import { getShuffledDeck, Deal } from './Dealer.jsx';
// import { styles } from './Archetype.jsx';
import User from './Login.jsx'
import { shuffleDeck, dealHoldEm, handEvaluator } from './Gameplay/Cards';

const App = () => {

  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState();
  const [currentHand, setHand] = useState({});
  const [dealerPosition, setDeal] = useState(0);
  const [outcome, setOutcome] = useState({})

  const startingPlayers = [
    'Pete', 'Robert', 'Dave', 'Shane', 'Larry', 'Brenna', 'Shawn', 'Matt'
  ]

  const handTypes = [
    'Straight Flush', 'Quads', 'Full House', 'Flush', 'Straight', '3 of a Kind', '2 Pair', '1 Pair', 'High Card'
  ]

  useEffect(() => {
    setUserCount(startingPlayers.length);
    setUsers(startingPlayers);
    setDeal(0);
  }, []);

  const handleNewDeal = () => {
    const newDeck = shuffleDeck();
    const dealResults = dealHoldEm(users, newDeck, dealerPosition);
    setHand(dealResults);
    if (dealerPosition < users.length - 1) setDeal(dealerPosition + 1);
    else setDeal(0);
    const handResults = handEvaluator(dealResults);
    console.log('Full Deal; ', dealResults, handResults);
    setOutcome(handResults);
  }

  const DisplayHand = () => {
    return (
      <div>
        <div className="board">
          <span>{currentHand.board.flop} </span>
          <span>{currentHand.board.turn} </span>
          <span>{currentHand.board.river} </span>
        </div>
        {users.map((player, ind) => (
          <div key={ind}>
            <span>{player}: </span>
            <span>{currentHand[player]} </span>
            <span>{handTypes[outcome[player].handStrength - 1]}</span>
            <span> Key cards: {outcome[player].keyCards}</span>
            <span> kickers: {outcome[player].kickers}</span>
          </div>
        ))}
        <h3>Winner: {outcome.winner.name}  Hand: {handTypes[outcome.winner.hand[0] - 1]}</h3>
      </div>
    )
  }

  return (
    <div>
      <div className="main-title">
        <h1>Pete's Poker Palace</h1>
      </div>
      <h3>Who is playing?</h3>
      <User
        users={users}
        setUsers={setUsers}
        userCount={userCount}
        setUserCount={setUserCount} />
      <button onClick={handleNewDeal}>Dealer is {users[dealerPosition]}</button>
      {currentHand.board &&
        <DisplayHand />
      }
    </div>
  )

}

export default App;