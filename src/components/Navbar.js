import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import ContextData from "../contexts/contextData";

const Navbar = () => {
  const { setUserId } = useContext(ContextData);

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    setUserId("");
  };
  return (
    <header>
      <img src="GutenbergLogo.png" alt="Logo" className="logo" />
      <div className="nav-items">
        <NavLink to="/">
          <p className="nav-item nav-chat">Chat</p>
        </NavLink>
        <i
          title="Log Out"
          style={{ color: "white", cursor: "pointer" }}
          onClick={logout}
          className="fa-solid fa-right-from-bracket"
        ></i>
      </div>
    </header>
  );
};

export default Navbar;
