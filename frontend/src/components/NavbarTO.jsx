import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "./images/Tournahub.png";

import {useNavigate} from 'react-router-dom';

export default function NavbarC() {
  const [click, setClick] = useState(false);

  const navigate = useNavigate();
  const navigateToDashboardTOPendingCollaboration = () => {
    //navigate to /DashboardCPendingCollaboration
    navigate('/DashboardTOPendingCollaboration');
  };
  const navigateToViewTournament= () => {
    //navigate to /DashboardCPendingCollaboration
    navigate('/Tournament');
  };
  const navigateToUploadNews= () => {
    //navigate to /UploadNews
    navigate('/UploadNews');
  };

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);
  const Logout = () => {
    window.localStorage.removeItem("loggedInTO")
    window.localStorage.removeItem("verify")
    window.localStorage.removeItem("user")
  }

  return (
    <div>
      <div className="navbar">
        <div className="nav_left">
          <Link to="/DashboardTO" onClick={closeMobileMenu}>
            {<img className="nav-logo" src={logo} />}
          </Link>
          <div className="menu-icon" onClick={handleClick}>
            <MenuIcon />
          </div>
          <Link to={`/ViewTournament`} className="nav-links">
            Tournament List
          </Link>
          <Link to={`/Tournament`} className="nav-links">
            Manage Tournaments
          </Link>
          <Link to={`/DashboardTOPendingCollaboration`} className="nav-links">
            Collaboration
          </Link>
          <Link to={`/UploadNews`} className="nav-links">
            Manage News
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