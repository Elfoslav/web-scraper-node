import React from 'react';
import logo from './logo.svg';
import './App.css';
import FlatsList from './components/FlatsList';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <img src={logo} className="app-logo" alt="logo" />
      </header>
      <div className="container">
        <FlatsList />
      </div>
    </div>
  );
}

export default App;
