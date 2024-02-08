import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "./images/Tournahub.png";

export default function NavbarA() {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);
  const Logout = () => {
    window.localStorage.removeItem("loggedInA");
    window.localStorage.removeItem("verify")
    window.localStorage.removeItem("user")
  };

  return (
    <div>
      <div className="navbar">
        <div className="navbar-container">
          <Link to="/home" onClick={closeMobileMenu}>
            {<img className="nav-logo" src={logo} />}
          </Link>
          <Link to={`/UpdateProfile`} className="nav-links">
            Profile
          </Link>
          <Link to={`/home`} className="nav-links">
            Home
          </Link>
          <Link to={`/TournamentSchedule`} className="nav-links">
            Tournament Schedule
          </Link>
          <Link to={`/ViewTournament`} className="nav-links">
            Tournament List
          </Link>
          <Link to={`/MatchResult`} className="nav-links">
            Match Result
          </Link>
          <Link to={`/MatchStatistic`} className="nav-links">
            Match Statistic
          </Link>
          <Link to={`/Apply`} className="nav-links">
            Apply
          </Link>
          <Link to={`/RatingAndReview`} className="nav-links">
            Rating
          </Link>
          <div className="menu-icon" onClick={handleClick}>
            <MenuIcon />
          </div>
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <a href="/" className="nav-links" onClick={() => Logout()}>
                LogOut
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
