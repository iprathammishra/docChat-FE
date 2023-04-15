import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <header>
      <img src="GutenbergLogo.png" alt="Logo" className="logo" />
      <NavLink to="/">
        <p className="nav-chat">Chat</p>
      </NavLink>
      <NavLink to="/linkedin">
        <p className="nav-linkedin">LinkedIn Connections</p>
      </NavLink>
    </header>
  );
};

export default Navbar;
