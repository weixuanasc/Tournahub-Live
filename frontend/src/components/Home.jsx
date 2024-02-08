import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Navbar from "./Navbar";
import "../App.css";
import "./Home.css";
import LandingOne from "./LandingOne";

export default function Home() {
  return (
    <div>
      <div> 
        <Navbar /> 
      </div>
      <div> 
        <LandingOne />
      </div>
    </div>
  );
}
