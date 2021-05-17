import React from 'react';
import { Route } from 'react-router';
import './App.css';
import HomePage from './components/HomePage/homepage';
import SuccessPage from './components/HomePage/successpage';

function App() {
  return (
    <div>
        {/* <Route exact path='/' component={RegistrationForm} /> */}
        <Route exact path='/' component={HomePage} />
        <Route exact path='/success' component={SuccessPage} />
      </div>
  );
}

export default App;
