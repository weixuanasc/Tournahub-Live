import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NavbarTO from "./NavbarTO";
import bgmImage from "./images/background_application.jpg";

function ViewApplicants() {
  const { tournamentId } = useParams();
  const [tournament, setTournament] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatedPlayer, setUpdatedPlayer] = useState(null);
  const [error, setError] = useState(null);
  const [scrollY, setScrollY] = useState(0);
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

  const fetchApplicationsOfTournaments = async () => {
    if (!tournamentId) return;
    try {
      const { data } = await axios.get(
        `https://api.fyp23s424.com/api/applicationstatus/getApplicationOfTournament/${tournamentId}`
      );
      setApplicants(data.message);
    } catch (error) {
      setError("Error fetching applicants: " + error.message);
    }
  };

  const fetchTournamentData = async () => {
    try {
      const { data } = await axios.get(
        `https://api.fyp23s424.com/getTournamentDetails/${tournamentId}`
      );
      setTournament(data);
    } catch (error) {
      setError("Error fetching tournament data: " + error.message);
    }
  };

  const updateApplicationStatus = async (applicationId, action) => {
    try {
      await axios.put(
        `https://api.fyp23s424.com/api/applicationstatus/updateApplicationStatus/${applicationId}`,
        { action }
      );
      fetchApplicationsOfTournaments();

      if (action === "APPROVED") {
        const updatedApplicants = applicants.map((application) => {
          if (application._id === applicationId) {
            return {
              ...application,
              action: action,
            };
          }
          return application;
        });

        // Update state with the new array of applicants
        setApplicants(updatedApplicants);

        // Retrieve userId from the approved application
        const approvedApplication = updatedApplicants.find(
          (application) => application._id === applicationId
        );

        if (approvedApplication && approvedApplication.user) {
          const userId = approvedApplication.user._id;
          const tournamentPlayersCount = tournament.tournamentPlayers.length;
          const tournamentMaxPlayers = parseInt(
            tournament.tournamentNumberofplayers
          );

          const tournamentPlayers = [...tournament.tournamentPlayers, userId];

          // Update tournament players
          await axios.put(
            `https://api.fyp23s424.com/updateTournamentPlayers/${tournamentId}`,
            { tournamentPlayers }
          );

          // // Check if the tournament is now full
          // if (tournamentPlayersCount + 1 >= tournamentMaxPlayers) {
          //   // Update tournament status to 'Closed Application'
          //   await axios.put(
          //     `https://api.fyp23s424.com/updateClosedTournamentStatus/${tournamentId}`,
          //     { tournamentStatus: "Closed Application" }
          //   );
          //   console.log("Tournament status updated to 'Closed Application'");
          // }
          console.log("Tournament updated successfully");
        }
      }
    } catch (error) {
      setError("Error updating application status: " + error.message);
    }
  };

  useEffect(() => {
    if (!tournamentId) return;
    fetchApplicationsOfTournaments();
    fetchTournamentData();
  }, [tournamentId]);

  return (
    <>
      <NavbarTO />
      <img
        className="bg"
        src={bgmImage}
        alt="Background"
        style={{ transform: `translateY(${scrollY * 0.001}px)` }}
      />
      <div>
        <h2>Applicants for {tournament?.tournamentName}</h2>

        {applicants?.length > 0 ? (
          <ol>
            {applicants.map((application) => (
              <li key={application._id}>
                <p>username: {application?.user?.name}</p>
                <p>email: {application?.user?.email}</p>
                <p>status: {application.action}</p>
                <button
                  onClick={() =>
                    updateApplicationStatus(application._id, "APPROVED")
                  }
                  disabled={application.action !== "REQUESTED"}
                >
                  Accept
                </button>
                <button
                  onClick={() =>
                    updateApplicationStatus(application._id, "REJECTED")
                  }
                  disabled={application.action !== "REQUESTED"}
                >
                  Reject
                </button>
              </li>
            ))}
          </ol>
        ) : (
          <p>No applicants for this tournament.</p>
        )}
      </div>
    </>
  );
}

export default ViewApplicants;
