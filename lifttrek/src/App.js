import React from "react";
import "./App.css";
import {
  NavLink,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Home from "./components/Home";
import { Button, ButtonGroup } from "@mui/material";
import CreateWorkout from "./components/CreateWorkout";
import Login from "./components/Login";
import CreatePost from "./components/CreatePost";
import PostFeed from "./components/PostFeed";
import DisplayWorkout from "./components/DisplayWorkout";
import DisplayPost from './components/DisplayPost'
import SignUp from "./components/SignUp";
import Navigation from "./components/Navigation";
import { AuthProvider } from "./firebase/Auth";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <header className="appHeader">
            <h1 className="appTitle">LiftTrek</h1>
            {/* <nav>
              <ButtonGroup id="navGroup" variant="outlined">
                <Button id="navButton" variant="contained">
                  <NavLink to="/">Home</NavLink>
                </Button>
                <Button id="navButton" variant="contained">
                  <NavLink to="/feed">View Feed</NavLink>
                </Button>
                <Button id="navButton" variant="contained">
                  <NavLink to="/createworkout">Create Workout</NavLink>
                </Button>
                <Button id="navButton" variant="contained">
                  <NavLink to="/createpost">Create Post</NavLink>
                </Button>
                <Button id="navButton" variant="contained">
                  <NavLink to="/login">Login</NavLink>
                </Button>
                <Button id="navButton" variant="contained">
                  <NavLink to="/displayworkout">Test</NavLink>
                </Button>
              </ButtonGroup>
            </nav> */}
            <Navigation/>
          </header>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            
            <Route path="/feed" element={<PrivateRoute />}>
              <Route path="/feed" element={<PostFeed />} />
            </Route>
            <Route path="/createworkout" element={<PrivateRoute />}>
              <Route path="/createworkout" element={<CreateWorkout />} />
            </Route>
            <Route path="/createpost" element={<PrivateRoute />}>
              <Route path="/createpost" element={<CreatePost />} />
            </Route>
            <Route path="/displayworkout" element={<PrivateRoute />}>
              <Route path="/displayworkout" element={<DisplayWorkout />} />
            </Route>
            <Route path='/post/:id' element={<PrivateRoute/>}>
              <Route path='/post/:id' element={<DisplayPost/>}/>
            </Route>
            {/* <Route path="/feed" element={<PrivateRoute />} />
            <Route path="/feed" element={<PostFeed />} />
            </Route> */}
            {/* <Route path="/createworkout" element={<CreateWorkout />} />
            <Route path="/createpost" element={<CreatePost />} />
            <Route path="/displayworkout" element={<DisplayWorkout />} /> */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
