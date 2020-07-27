
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import UserContextProvider from './Contexts/UserContext';

ReactDOM.render(
  <UserContextProvider>
  <App />
  </UserContextProvider>,
  document.getElementById('root')
);