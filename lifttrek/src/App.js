import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Home from "./components/Home";
import CreateWorkout from "./components/CreateWorkout";
import Login from "./components/Login";
import CreatePost from "./components/CreatePost";
import PostFeed from "./components/PostFeed";
import DisplayWorkout from "./components/DisplayWorkout";
import DisplayPost from './components/DisplayPost'
import SignUp from "./components/SignUp";
import Navigation from "./components/Navigation";
import Account from "./components/Account";
import { AuthProvider } from "./firebase/Auth";
import PrivateRoute from "./components/PrivateRoute";
import MyWorkouts from "./components/MyWorkouts";
import EditWorkout from "./components/EditWorkout";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <header className="appHeader">
            <h1 className="appTitle">LiftTrek</h1>
            <Navigation/>
          </header>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            
            <Route path="/feed" element={<PrivateRoute />}>
              <Route path="/feed" element={<PostFeed />} />
            </Route>
            <Route path="/account/:id" element={<PrivateRoute />}>
              <Route path="/account/:id" element={<Account />} />
            </Route>
            <Route path="/createworkout" element={<PrivateRoute />}>
              <Route path="/createworkout" element={<CreateWorkout />} />
            </Route>
            <Route path="/createpost" element={<PrivateRoute />}>
              <Route path="/createpost" element={<CreatePost />} />
            </Route>
            <Route path="/myworkouts/:id" element={<PrivateRoute />}>
              <Route path="/myworkouts/:id" element={<DisplayWorkout />} />
            </Route>
            <Route path="/myworkouts" element={<PrivateRoute />}>
              <Route path="/myworkouts" element={<MyWorkouts />} />
            </Route>
            <Route path="/editworkout/:id" element={<PrivateRoute />}>
              <Route path="/editworkout/:id" element={<EditWorkout />} />
            </Route>
            <Route path='/post/:id' element={<PrivateRoute/>}>
              <Route path='/post/:id' element={<DisplayPost/>}/>
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
