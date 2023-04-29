import React from 'react';
import './App.css';
import {
  NavLink,
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';
import Home from './components/Home';
import { Button } from '@mui/material';
import CreateWorkout from './components/CreateWorkout';
import Login from './components/Login';
import CreatePost from './components/CreatePost';
import PostFeed from './components/PostFeed';
import DisplayWorkout from './components/DisplayWorkout';

function App() {
  return (
    <Router>
      <div>
        <header className='App-header'>
          <h1 className='App-title'>
            LiftTrek
          </h1>
          <nav>
            <Button>
              <NavLink className='navlink' to='/'>
                Home
              </NavLink>
            </Button>
            <Button>
              <NavLink className='navlink' to='/feed'>
                View Feed
              </NavLink>
            </Button>
            <Button>
              <NavLink className='navlink' to='/createworkout'>
                Create Workout
              </NavLink>
            </Button>
            <Button>
              <NavLink className='navlink' to='/createpost'>
                Create Post
              </NavLink>
            </Button>
            <Button>
              <NavLink className='navlink' to='/login'>
                Login
              </NavLink>
            </Button>
            <Button>
              <NavLink className='navlink' to='/displayworkout'>
                Test
              </NavLink>
            </Button>
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
