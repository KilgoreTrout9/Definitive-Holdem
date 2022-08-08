import React, { useState } from 'react';

const User = ({ users, setUsers, userCount, setUserCount }) => {
  const [currentUser, setCurrentUser] = useState('');

  const handleUserChange = (event) => {
    setCurrentUser(event.target.value);
  }

  const handleUserSubmit = (event) => {
    event.preventDefault();
    alert('The new user is: ' + currentUser);
    setUserCount(userCount += 1);
    setUsers([...users, currentUser])
    setCurrentUser('')
  }

  const handleRemoveUser = (name) => {
    setUsers(users.filter((user) => user !== name))
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
          users.map((name) => (
            <li>
              <span>{name}   </span>
              <button onClick={() => handleRemoveUser(name)}>remove</button>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default User;