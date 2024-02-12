import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Navbar from "./Navbar";
import "../App.css";
import "./Home.css";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import GroupsIcon from "@mui/icons-material/Groups";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
export default function AboutUs() {
  return (
    <>
      <Navbar />
      <div className="coloredbg">
        <h2>
          <GroupsIcon style={{ marginRight: "10px", fontSize: 40 }} />
          About Us
        </h2>
        <br />

        <h5>
          <LibraryBooksIcon style={{ fontSize: 35 }} /> Our Mission:
        </h5>
        <h6>
          Empower sports enthusiasts to seamlessly organize and participate in
          diverse leagues and tournaments across multiple sports through an
          intuitive and collaborative online platform.
        </h6>
        <h5>
          <br />
          <VolunteerActivismIcon style={{ fontSize: 45 }} />
          Core Value:
        </h5>
        <h6>Integrity</h6>
        <h6>Innovation</h6>
        <h6>Collaboration</h6>
        <h6>User-Centricity</h6>
        <h6>Diversity and Inclusion</h6>
        <br />
        <h5>
          <ReportProblemIcon style={{ fontSize: 45 }} />
          Problem:
        </h5>
        <h6>
          Coordinating and managing leagues or tournaments for various sports
          often involves complex logistics, scheduling, and communication
          challenges. Existing solutions lack comprehensive features for
          customization and collaboration, hindering a smooth and personalized
          user experience.
        </h6>
        <br />
        <h5>
          <EmojiObjectsIcon style={{ fontSize: 45 }} />
          Solution:
        </h5>
        <h6>
          Our platform provides a user-friendly interface to effortlessly plan,
          run, and personalize leagues or tournaments. With customizable
          formats, multi-user collaboration, and robust reporting capabilities,
          users can efficiently manage every aspect of their sports events. This
          all-in-one solution enhances the overall experience for event
          organizers and participants alike.
        </h6>
        <br />
      </div>
    </>
  );
}
