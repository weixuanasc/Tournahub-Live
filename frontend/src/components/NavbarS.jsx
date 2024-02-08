import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "./images/Tournahub.png";

export default function NavbarS() {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);
  
  const Logout = () => {
    window.localStorage.removeItem("loggedInS")
    window.localStorage.removeItem("verify")
    window.localStorage.removeItem("user")
  }

  return (
    <div>
      <div className="navbar">
        <div className="nav_left">
          <Link to="/DashboardS" onClick={closeMobileMenu}>
            {<img className="nav-logo" src={logo} />}
          </Link>
          <div className="menu-icon" onClick={handleClick}>
            <MenuIcon />
          </div>
          <Link to={`/TournamentSchedule`} className="nav-links">
            Tournament Schedule
          </Link>
          <Link to={`/ViewTournament`} className="nav-links">
            Tournament List
          </Link>
          <Link to={`/SponsorshipModels`} className="nav-links">
            Sponsorship
          </Link>
          
          <li className="nav-links">
            <a href="/" className="nav-links" onClick={() => Logout()}>
              LogOut
            </a>
          </li>
        </div>
      </div>
    </div>
  );
}