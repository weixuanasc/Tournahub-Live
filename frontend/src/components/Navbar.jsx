import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "./images/Tournahub.png";

export default function Navbar() {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  return (
    <div>
      <div className="navbar">
        <div className="navbar-container">
          <Link to="/" onClick={closeMobileMenu}>
            {<img className="nav-logo" src={logo} />}
          </Link>
            <MenuIcon />
              <Link to="/" className="nav-links" onClick={closeMobileMenu}>
                About Us
              </Link>        
              <Link to="/" className="nav-links" onClick={closeMobileMenu}>
                Contact Us
              </Link>
            
              <Link to= "/Signup" className="nav-links" onClick={handleClick}>
                Sign Up
              </Link>
            
              <Link to= "/Login" className="nav-links" onClick={handleClick}>
                Log In
              </Link>            
        </div>
      </div>
    </div>
  );
}
