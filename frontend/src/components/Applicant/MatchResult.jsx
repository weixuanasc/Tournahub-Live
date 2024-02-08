import React, { useState, useEffect } from "react";
import NavbarA from "./NavbarA";

const MatchResult = () => {
  const [tournamentData, setTournamentData] = useState(null);

  useEffect(() => {
    const fetchTournamentData = async () => {
      try {
        const response = await fetch(
          "src/components/Applicant/fakeMatchResults.json"
        );
        const data = await response.json();
        setTournamentData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchTournamentData();
  }, []);

  return (
    <div>
      <NavbarA />
      {tournamentData ? (
        <div>
          <h2>{tournamentData.tournamentName}</h2>
          <div>
            {tournamentData.matches.map((match) => (
              <div key={match.matchNumber}>
                <h3>Match {match.matchNumber}</h3>
                <p>
                  {match.team1.name} {match.team1.score} - {match.team2.score}{" "}
                  {match.team2.name}
                </p>
                <div>
                  <p>
                    <strong>{match.team1.name} Players:</strong>
                  </p>
                  <ul>
                    {match.team1.players.map((player, index) => (
                      <li key={index}>{player}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p>
                    <strong>{match.team2.name} Players:</strong>
                  </p>
                  <ul>
                    {match.team2.players.map((player, index) => (
                      <li key={index}>{player}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default MatchResult;
