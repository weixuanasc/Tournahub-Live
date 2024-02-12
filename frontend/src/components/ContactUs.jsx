import React, { useState } from "react";
import Navbar from "./Navbar";
import "../App.css";
import "./Home.css";
import PhoneIcon from "@mui/icons-material/Phone";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default function ContactUs() {
  return (
    <>
      <Navbar />
      <div className="bgColour">
        <h2>
          <PhoneIcon style={{ color: "white", fontSize: 35 }} />
          Get In Touch
        </h2>
        <br />
        <h5>
          <MailOutlineIcon style={{ fontSize: 35 }} />: tournahub@gmail.com
        </h5>
        <br />
        <h5>
          <PhoneAndroidIcon style={{ fontSize: 35 }} />
          :+65 9123 4567
        </h5>
        <br />
        <br />
        <br /> <br />
        <br />
        <h3>
          <AccessTimeIcon style={{ fontSize: 35 }} />
          Opening Hours:{" "}
        </h3>
        <br />
        <h6>Mon - Fri: 09:00 - 18:00 </h6>
        <h6>Sat & PH: 09:00 - 13:00 </h6>
        <h6>Closed on Sun</h6>
      </div>
    </>
  );
}
