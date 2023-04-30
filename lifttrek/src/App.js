import React from 'react';
import './App.css';
import {
  NavLink,
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';
import Home from './components/Home';
import { Button, ButtonGroup } from '@mui/material';
import CreateWorkout from './components/CreateWorkout';
import Login from './components/Login';
import CreatePost from './components/CreatePost';
import PostFeed from './components/PostFeed';
import DisplayWorkout from './components/DisplayWorkout';

function App() {
  return (
    <Router>
      <div>
        <header className='appHeader'>
          <h1 className='appTitle'>
            LiftTrek
          </h1>
          <nav>
            <ButtonGroup id='navGroup' variant='outlined'>
              <Button id='navButton' variant='contained'>
                <NavLink to='/'>
                  Home
                </NavLink>
              </Button>
              <Button id='navButton' variant='contained'>
                <NavLink to='/feed'>
                  View Feed
                </NavLink>
              </Button>
              <Button id='navButton' variant='contained'>
                <NavLink to='/createworkout'>
                  Create Workout
                </NavLink>
              </Button>
              <Button id='navButton' variant='contained'>
                <NavLink to='/createpost'>
                  Create Post
                </NavLink>
              </Button>
              <Button id='navButton' variant='contained'>
                <NavLink to='/login'>
                  Login
                </NavLink>
              </Button>
              <Button id='navButton' variant='contained'>
                <NavLink to='/displayworkout'>
                  Test
                </NavLink>
              </Button>
            </ButtonGroup>
          </nav>
        </header>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/feed' element={<PostFeed />} />
          <Route path='/createworkout' element={<CreateWorkout />} />
          <Route path='/createpost' element={<CreatePost />} />
          <Route path='/displayworkout' element={<DisplayWorkout/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
