import React from 'react';
import './App.css';
import {
  NavLink,
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <div>
        <header className='App-header'>
          <h1 className='App-title'>
            LiftTrek
          </h1>
          <nav>
            <NavLink className='navlink' to='/'>
              Home
            </NavLink>
          </nav>
        </header>
        <Routes>
          <Route path='/' element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
