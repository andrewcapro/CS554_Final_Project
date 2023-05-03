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
              <Button component={NavLink} to={'/'} id='navButton' variant='contained'>
                  Home
              </Button>
              <Button component={NavLink} to={'/feed'} id='navButton2' variant='contained'>
                  View Feed
              </Button>
              <Button component={NavLink} to={"/createworkout"}id='navButton3' variant='contained'>
                  Create Workout
              </Button>
              <Button component={NavLink} to={"/createpost"}id='navButton4' variant='contained'>
                  Create Post
              </Button>
              <Button component={NavLink} to={"/login"}id='navButton5' variant='contained'>
                  Login
              </Button>
              <Button component={NavLink} to={"/displayworkout"}id='navButton6' variant='contained'>
                  Test
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
