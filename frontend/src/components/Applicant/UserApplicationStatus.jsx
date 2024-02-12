import React, { useEffect, useState } from "react";
import axios from "axios";
import NavbarA from "./NavbarA";
import "./TournamentApplication.css";
import { useNavigate } from "react-router-dom";
import SportsHandballIcon from "@mui/icons-material/SportsHandball";

const UserApplicationStatus = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  const handleNavigateToViewTournamentDetails = (tournamentId) => {
    navigate(`/ViewTournamentDetails/${tournamentId}`);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          "https://api.fyp23s424.com/getCurrentUser",
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

    fetchData();
  }, []);

  useEffect(() => {
    const fetchAppliedTournaments = async () => {
      try {
        const response = await axios.get(
          `https://api.fyp23s424.com/api/applicationstatus/getUserApplications/${user?._id}`
        );
        setApplications(response.data); // Update here
      } catch (error) {
        console.error("Error fetching user applications:", error);
      }
    };

    if (user) {
      fetchAppliedTournaments();
    }
  }, [user]);

  return (
    <>
      <NavbarA />
      <div>
        <br />
        <h2>
          <SportsHandballIcon style={{ marginRight: "10px", fontSize: 45 }} />
          Your Application Status
        </h2>
        <br />
        {applications.length > 0 ? (
          <ul>
            {applications.map((application) => (
              <div className="Tframe" key={application.tournamentId}>
                <p>Tournament: {application.tournamentName}</p>
                <p>Status: {application.action}</p>
                <button
                  onClick={() =>
                    handleNavigateToViewTournamentDetails(
                      application.tournamentId
                    )
                  }
                  className="btn btn-sm btn-info mr-2"
                >
                  View
                </button>
              </div>
            ))}
          </ul>
        ) : (
          <p>No applications found.</p>
        )}
      </div>
    </>
  );
};

export default UserApplicationStatus;
