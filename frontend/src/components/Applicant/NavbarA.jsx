import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../Navbar.css";
import logo from "../images/Tournahub.png";

export default function NavbarA() {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);

  const Logout = () => {
    window.localStorage.removeItem("loggedInA");
    window.localStorage.removeItem("verify");
    window.localStorage.removeItem("user");
  };

  return (
    <div>
      <div className="navbar">
        <div className="nav_left">
          <Link to="/home">{<img className="nav-logo" src={logo} />}</Link>
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
          <Link to={`/Apply`} className="nav-links">
            Apply
          </Link>
          <Link to={`/userapplicationstatus`} className="nav-links">
            Application Status
          </Link>
          <Link to={`/RatingAndReview`} className="nav-links">
            Rating
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
