import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { Button, ButtonGroup } from "@mui/material";
import { AuthContext } from "../firebase/Auth";
import SignOutButton from "./SignOutButton";
import "../App.css";

const Navigation = () => {
  const { currentUser } = useContext(AuthContext);
  return <div>{currentUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>;
};

const NavigationAuth = () => {
  return (
    <nav>
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
          <NavLink to="/displayworkout">Test</NavLink>
        </Button>
        <SignOutButton />
      </ButtonGroup>
    </nav>
  );
};

const NavigationNonAuth = () => {
  return (
    <nav>
      <ButtonGroup id="navGroup" variant="outlined">
        <Button id="navButton" variant="contained">
          <NavLink to="/">Home</NavLink>
        </Button>
        <Button id="navButton" variant="contained">
          <NavLink to="/signup">Sign Up</NavLink>
        </Button>
        <Button id="navButton" variant="contained">
          <NavLink to="/login">Login</NavLink>
        </Button>
      </ButtonGroup>
    </nav>
  );
};

export default Navigation;
