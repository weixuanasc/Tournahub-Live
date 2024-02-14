import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "./images/Tournahub.png";
import HomeIcon from "@mui/icons-material/Home";

export default function NavbarSA() {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);
  const Logout = () => {
    window.localStorage.removeItem("loggedInSA");
    window.localStorage.removeItem("verify");
    window.localStorage.removeItem("user");
  };

  return (
    <div>
      <div className="navbar">
        <div className="navbar-container">
          <Link to="/DashboardSA">
            {<img className="nav-logo" src={logo} />}
          </Link>
          <Link to="/DashboardSA" className="nav-links">
            <HomeIcon
              className="icon"
              style={{ color: "white", marginRight: "0px" }}
            />
          </Link>
          <Link to={`/AddScoresheet`} className="nav-links">
            Add Scoresheet
          </Link>
          <Link to={`/CreateSport`} className="nav-links">
            Create Sport
          </Link>
          <Link to={`/ManageSports`} className="nav-links">
            Manage Sport
          </Link>
          <Link to={`/ManageNewsArticles`} className="nav-links">
            Manage News
          </Link>
          <Link to={`/ManageUsers`} className="nav-links">
            Manage Users
          </Link>
          <Link to={`/verifyUsers`} className="nav-links">
            Verify Users
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
