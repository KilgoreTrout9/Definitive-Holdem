import React, { useState } from 'react';

const User = ({ users, setUsers, userCount, setUserCount }) => {
  const [currentUser, setCurrentUser] = useState('');

  const handleUserChange = (event) => {
    setCurrentUser(event.target.value);
  }

  const handleUserSubmit = (event) => {
    event.preventDefault();
    setUserCount(userCount += 1);
    setUsers([...users, currentUser])
    setCurrentUser('')
  }

  const handleRemoveUser = (name) => {
    setUsers(users.filter((user) => user !== name))
    setUserCount(userCount -= 1);
  }

  return (
    <div>
      <form className="user" onSubmit={handleUserSubmit}>
        <input
          className="user0"
          placeholder="Name"
          type="text"
          value={currentUser}
          onChange={handleUserChange} />
        <button className="user1" onClick={handleUserSubmit}>Add</button>
      </form>
      <span>Number of Players: {userCount}</span>
      <ul>
        {userCount > 0 &&
          users.map((name, ind) => (
            <ul key={ind}>
              <button onClick={() => handleRemoveUser(name)}>X</button>
              <span>   {name}   </span>
            </ul>
          ))
        }
      </ul>
    </div>
  )
}

export default User;