import React, { useEffect, useState } from "react";
import axios from "axios";
import NavbarA from "./NavbarA";
import "./TournamentApplication.css";
import bgmImage from "../images/background_application.jpg";

const TournamentApplication = () => {
  const [openTournaments, setOpenTournaments] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [appliedTournaments, setAppliedTournaments] = useState([]);

  //scrolling animation
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3001/getCurrentUser",
          {
            withCredentials: true,
          }
        );
        setUser(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchOpenTournaments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/applicationstatus/getOpenTournaments"
        );
        setOpenTournaments(response.data);
      } catch (error) {
        console.error("Error fetching open tournaments:", error);
      }
    };

    fetchData();
    fetchOpenTournaments();
  }, []);

  useEffect(() => {
    const fetchAppliedTournaments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/applicationstatus/getUserApplications/${user?._id}`
        );
        setAppliedTournaments(response.data);
      } catch (error) {
        console.error("Error fetching user applications:", error);
      }
    };

    if (user) {
      fetchAppliedTournaments();
    }
  }, [user]);

  const applyForTournament = async (tournamentId) => {
    if (!user) return;
    try {
      const response = await axios.post(
        `http://localhost:3001/api/applicationstatus/applyForTournament/${tournamentId}`,
        {
          userId: user?._id,
        }
      );
      console.log("Application response:", response.data);
      setAppliedTournaments((prevApplied) => [...prevApplied, tournamentId]);
      setOpenTournaments((prevTournaments) =>
        prevTournaments.map((tournament) =>
          tournament._id === tournamentId
            ? {
                ...tournament,
                applications: [
                  ...(tournament.applications || []),
                  { user: user },
                ],
              }
            : tournament
        )
      );

      console.log("Application response:", response.data);
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.error ===
          "You have already applied for this tournament"
      ) {
        console.log("User has already applied for this tournament");
        // Handle the case where the user has already applied
        window.alert("You have already applied for this tournament");
      } else {
        console.error("Error applying for tournament:", error);
        console.log("Error response:", error.response);
        window.alert("Error applying for the tournament. Please try again");
      }
    }
  };

  const renderTournament = (tournament) => {
    const userAlreadyApplied = appliedTournaments.includes(tournament?._id);

    return (
      <div className="displayall" key={tournament._id}>
        <div className="Tframe">
          <h4> {tournament.tournamentName}</h4>
          <p>Tournament details: {tournament.tournamentDetails}</p>
          <p>Skill Level: {tournament.tournamentSkillLevel}</p>
          <p>Sport Category: {tournament.tournamentSport}</p>
          <button
            className="mainBtns"
            onClick={() => applyForTournament(tournament._id)}
            disabled={userAlreadyApplied}
          >
            {userAlreadyApplied ? "Already Applied" : "Apply"}
          </button>
        </div>
      </div>
    );
  };

  const renderFilteredTournaments = (filterFn) =>
    filteredTournaments(filterFn).map(renderTournament);

  const filteredTournaments = (filterFn) => openTournaments.filter(filterFn);

  return (
    <>
      <NavbarA />
      <img
        className="bg"
        src={bgmImage}
        alt="Background"
        style={{ transform: `translateY(${scrollY * 0.01}px)` }}
      />
      <h2>Open Tournaments</h2>
      <h4>Recommended match for your skill level:</h4>
      <div className="direction">
        {renderFilteredTournaments((tournament) => {
          const skillLevelMatches =
            tournament.tournamentSkillLevel?.toLowerCase() ===
            user?.skillLevel?.toLowerCase();
          return skillLevelMatches;
        })}
      </div>
      <div className="newline">
        <h4>Other matches:</h4>
        {renderFilteredTournaments((tournament) => {
          const skillLevelDiffers =
            tournament.tournamentSkillLevel?.toLowerCase() !==
            user?.skillLevel?.toLowerCase();
          return skillLevelDiffers;
        })}
      </div>
    </>
  );
};

export default TournamentApplication;
