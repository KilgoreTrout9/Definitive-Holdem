import React, { useState, useEffect } from 'react';
// import { getShuffledDeck, Deal } from './Dealer.jsx';
// import { styles } from './Archetype.jsx';
import User from './Login.jsx'
import { shuffleDeck, dealHoldEm } from './Gameplay/Cards';

const App = () => {
  // this.state = {
  //   user: '',
  //   deck: [],
  //   numberOfPlayers: 2,
  //   playerSyles: []
  // }

  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);

  const startingPlayers = [
    'Pete', 'Robert', 'Dave', 'Shane', 'Larry', 'Brenna', 'Shawn', 'Matt'
  ]

  useEffect(() => {
    setUsers(startingPlayers);
  }, []);

  const handleNewDeal = () => {
    const newDeck = shuffleDeck();
    const dealResults = dealHoldEm(users, newDeck);
    console.log(dealResults, newDeck)
  }

  return (
    <div>
      <div className="main-title">
        <h1>Pete's Poker Palace</h1>
      </div>
      <h3>Who is playing?</h3>
      <div>
        <User
          users={users}
          setUsers={setUsers}
          userCount={userCount}
          setUserCount={setUserCount} />
      </div>
      <button onClick={handleNewDeal}>Deal Sucker!</button>
    </div>
  )

}

export default App;