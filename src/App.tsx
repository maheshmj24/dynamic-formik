import React from 'react';
import { Route } from 'react-router';
import './App.css';
import HomePage from './components/HomePage/homepage';

function App() {
  return (
    <div>
        <Route exact path='/' component={HomePage} />
      </div>
  );
}

export default App;
