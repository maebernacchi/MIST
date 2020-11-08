import React, { useState, createContext, useEffect } from 'react';
export const UserContext = createContext();

/**
 * This React Context persists the authenticated user's information throughout
 * the application. It provides the user's data (i.e. their MongoDB user
 * document with filled references) along with a function that retrieves the
 * user's data. Whenever the user's data has been changed in the server in
 * some way, we should retrieve their data again by calling the provided
 * function `updateAuthenticatedUser`.
 */
const UserContextProvider = (props) => {
  const [data, setData] = useState();
  function updateAuthenticatedUser() {
    fetch('/api?action=getUser', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
        .then((res) => res.json())
        .then(setData)
        .catch(console.log);
  };
  useEffect(() => {
    fetch('/api?action=getUser', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
        .then((res) => res.json())
        .then((user) => {
          setData(user);
        });
  }, []);

  // Fetch method to get the data
  return (
    <UserContext.Provider value={{data, updateAuthenticatedUser}}>
      { props.children }
    </UserContext.Provider>
  );
};


export default UserContextProvider;
