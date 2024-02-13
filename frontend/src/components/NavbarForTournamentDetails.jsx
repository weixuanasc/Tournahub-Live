import React from "react";

const NavbarForTournamentDetails = () => {
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="toleft">
      <ul className="mininavbar">
        <p className="minilinks" onClick={() => scrollToSection("sponsor")}>
          Sponsor
        </p>
        <p className="minilinks" onClick={() => scrollToSection("details")}>
          Tournament Details
        </p>
        <p className="minilinks" onClick={() => scrollToSection("players")}>
          Players
        </p>
        <p className="minilinks" onClick={() => scrollToSection("matches")}>
          Matches
        </p>
        <p className="minilinks" onClick={() => scrollToSection("statistics")}>
          Statistics
        </p>
        <p
          className="minilinks"
          onClick={() => scrollToSection("rankingtable")}
        >
          Ranking Table
        </p>
      </ul>
    </nav>
  );
};

export default NavbarForTournamentDetails;
