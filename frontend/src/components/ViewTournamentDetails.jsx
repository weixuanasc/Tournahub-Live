import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SelectNavbar from "./SelectNavbar";
import jsPDF from "jspdf";

function ViewTournamentDetails() {
  const [tournamentDetails, setTournamentDetails] = useState({});
  const [matchDetails, setMatchDetails] = useState({});
  const [rankingTableDetails, setRankingTableDetails] = useState({});
  const [loadingTournament, setLoadingTournament] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [LoadingRankingTable, setLoadingRankingTable] = useState(true);
  const [statisticsGenerated, setStatisticsGenerated] = useState(false);
  const [playerStatistics, setPlayerStatistics] = useState({});
  const { id } = useParams();

  useEffect(() => {
    // Fetch tournament details when the component mounts
    axios.get(`https://api.fyp23s424.com/getTournamentDetails/${id}`)
      .then((response) => {
        setTournamentDetails(response.data);
      })
      .catch((error) => {
        console.error('Error fetching tournament details:', error);
      })
      .finally(() => {
        setLoadingTournament(false);
      });
  }, 
  [id]);

  axios.get(`https://api.fyp23s424.com/getMatches/${id}`)
  .then((response) => {
    const matches = response.data;
    setMatchDetails(matches);
    
    // Check if there are more than one match and statistics have not been generated yet
    if (matches.length >= 1 && !statisticsGenerated) {
      generateStatistics(matches);
      setStatisticsGenerated(true); // Set the flag to true
    }
  })
  .catch((error) => {
    console.error('Error fetching match details:', error);
  })
  .finally(() => {
    setLoadingMatches(false);
  }, [id, statisticsGenerated]);

  useEffect(() => {
    // Fetch ranking table details when the component mounts
    axios.get(`https://api.fyp23s424.com/getRankingTable/${id}`)
      .then((response) => {
        setRankingTableDetails(response.data);
      })
      .catch((error) => {
        console.error('Error fetching ranking table details:', error);
      })
      .finally(() => {
        setLoadingRankingTable(false);
      });
  }, [id]);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  const exportScoresheet = () =>{
    window.open(`https://api.fyp23s424.com/scoresheet/${tournamentDetails.tournamentSport}.pdf`, "_blank", "noreferrer")
  }

  const exportMatches = () => {
    // Create a new instance of jsPDF
    const pdfDoc = new jsPDF();
  
    // Add content to the PDF
    pdfDoc.text(`${tournamentDetails.tournamentName} Matches`, 20, 10);
  
    if (Array.isArray(matchDetails) && matchDetails.length > 0) {
      let startY = 20; // Initial y-coordinate
  
      matchDetails.forEach((match, index) => {
        // Calculate required space for each line
        const lines = [
          `Match ${match.MatchNumber}`,
          `Match Name: ${match.MatchName}`,
          `Match Date: ${match.MatchDate}`,
          `Match Time: ${match.MatchTime}`,
          `Player 1: ${match.Player1}`,
          `Player 2: ${match.Player2}`,
          `${match.Player1} Score: ${match.Player1_Score}`,
          `${match.Player2} Score: ${match.Player2_Score}`,
          `Winner: ${match.Winner}`,
        ];
  
        // Calculate the height needed for this match content
        const heightNeeded = lines.length * 10 + 20; // Adjust as needed for line spacing and margins
  
        // Check if adding this match content would exceed the page height
        if (startY + heightNeeded > pdfDoc.internal.pageSize.height) {
          // Add a new page
          pdfDoc.addPage();
          startY = 20; // Reset startY for the new page
        }
  
        // Add lines to the PDF
        lines.forEach((line) => {
          pdfDoc.text(line, 20, startY);
          startY += 10; // Adjust as needed for line spacing
        });
  
        // Add space between matches
        startY += 10;
      });
    } else {
      pdfDoc.text("No match details available.", 20, 20);
    }
  
    // Save the PDF file
    pdfDoc.save(`${tournamentDetails.tournamentName} Matches.pdf`);
  };
  
 // Function to generate statistics
const generateStatistics = (matches) => {
  const updatedPlayerStatistics = {};

  // Iterate over each match
  matches.forEach((match) => {
    // Update statistics for Player 1
    if (match.Player1.trim() !== '') {
      if (!updatedPlayerStatistics[match.Player1]) {
        updatedPlayerStatistics[match.Player1] = {
          matchesPlayed: 0,
          matchesWon: 0,
          pointsScored: 0,
          averagePoints: 0,
        };
      }
      updatedPlayerStatistics[match.Player1].matchesPlayed++;
      updatedPlayerStatistics[match.Player1].pointsScored += parseInt(match.Player1_Score);
      if (match.Winner === match.Player1) {
        updatedPlayerStatistics[match.Player1].matchesWon++;
      }
    }

    // Update statistics for Player 2
    if (match.Player2.trim() !== '') {
      if (!updatedPlayerStatistics[match.Player2]) {
        updatedPlayerStatistics[match.Player2] = {
          matchesPlayed: 0,
          matchesWon: 0,
          pointsScored: 0,
          averagePoints: 0,
        };
      }
      updatedPlayerStatistics[match.Player2].matchesPlayed++;
      updatedPlayerStatistics[match.Player2].pointsScored += parseInt(match.Player2_Score);
      if (match.Winner === match.Player2) {
        updatedPlayerStatistics[match.Player2].matchesWon++;
      }
    }
  });

  // Calculate additional statistics like win percentage and average points
  Object.keys(updatedPlayerStatistics).forEach((player) => {
    const stats = updatedPlayerStatistics[player];
    stats.winPercentage = (stats.matchesPlayed !== 0) ? (stats.matchesWon / stats.matchesPlayed) * 100 : 0;
    stats.averagePoints = (stats.matchesPlayed !== 0) ? stats.pointsScored / stats.matchesPlayed : 0;
  });

  // Update state with the generated player statistics
  setPlayerStatistics(updatedPlayerStatistics);

  // Log the generated player statistics
  console.log('Generated player statistics:', updatedPlayerStatistics);
};

const sortedPlayerStatistics = Object.keys(playerStatistics).sort((a, b) => {
  const winPercentageA = playerStatistics[a].winPercentage || 0;
  const winPercentageB = playerStatistics[b].winPercentage || 0;
  return winPercentageB - winPercentageA;
});


  return (
    <div>
      {SelectNavbar()}
      {loadingTournament || loadingMatches || LoadingRankingTable ? (
        <p>Loading...</p>
      ) : (
      <div>
          <h1>Sponsor</h1>
          {tournamentDetails.tournamentSponsorIcon && (
          <>
            <img
              width={"150px"}
              src={`https://api.fyp23s424.com/tournamentsponsor/${tournamentDetails.tournamentSponsorIcon}`}
              alt={tournamentDetails.tournamentSponsorIcon}
              // onError={(e) => {
              //   // Handle image load error & display error image
              //   console.error("Error loading image:", e);
              //   e.target.src = 'https://i.imgur.com/7qHPfQf.png';
              // }}
            />
            <p><u>This tournament is brought to you by the following sponsor:</u></p>
            <p>{tournamentDetails.tournamentSponsor}</p>
          </>
        )}

        {!tournamentDetails.tournamentSponsorIcon && (
          <p>This tournament has not been sponsored yet. If interested, sponsor now!</p>
        )}
          <h1>{tournamentDetails.tournamentName}</h1>
          <p>Sport: {tournamentDetails.tournamentSport}</p>
          <p>Skill Level: {tournamentDetails.tournamentSkillLevel}</p>
          <p>Format: {tournamentDetails.tournamentFormat}</p>
          <p>Venue: {tournamentDetails.tournamentVenue}</p>
          <p>Details: {tournamentDetails.tournamentDetails}</p>
          <p>Start Date: {formatDate(tournamentDetails.tournamentStartDate)}</p>
          <p>End Date: {formatDate(tournamentDetails.tournamentEndDate)}</p>
          <p>Number of Players: {tournamentDetails.tournamentNumberofplayers}</p>
          <p>Number of Matches: {tournamentDetails.tournamentNumberofmatches}</p>
          <p>Tournament Status: {tournamentDetails.tournamentStatus}</p>
          {/* Display other tournament details as needed */}
          <button onClick={exportScoresheet}>Export Scoresheet</button>
          <h1>Matches</h1>
          {Array.isArray(matchDetails) && matchDetails.length > 0 ? (
            matchDetails.map((match, index) => (
              <div key={index}>
                <p>Match {match.MatchNumber}</p>
                <p>Match Name: {match.MatchName}</p>
                <p>Match Date: {formatDate(match.MatchDate)}</p>
                <p>Match Time: {match.MatchTime}</p>
                <p>Player 1: {match.Player1}</p>
                <p>Player 2: {match.Player2}</p>
                <p>Player 1 Score: {match.Player1_Score}</p>
                <p>Player 2 Score: {match.Player2_Score}</p>
                <p>Winner: {match.Winner}</p>
                <p>----------------------------------------</p>

                {/* Display other match details as needed */}
              </div>
            ))
          ) : (
            <p>No match details available.</p>
          )}
          <button onClick={exportMatches}>Export Matches</button>
          <div>
            <h1>Statistics</h1>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {playerStatistics && sortedPlayerStatistics.length > 0 ? (
                <table style={{ borderCollapse: 'collapse', border: '1px solid black', width: '80%', maxWidth: '800px' }}>
                  <thead>
                    <tr>
                      <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>Rank</th> {/* New column */}
                      <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>Player</th>
                      <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>Matches Played</th>
                      <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>Matches Won</th>
                      <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>Average Points</th>
                      <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>Points Scored</th>
                      <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>Win Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedPlayerStatistics.map((playerName, index) => (
                      <tr key={index}>
                        <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{index + 1}</td> {/* Display index as rank */}
                        <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>{playerName}</td>
                        <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{playerStatistics[playerName].matchesPlayed || 0}</td>
                        <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{playerStatistics[playerName].matchesWon || 0}</td>
                        <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{playerStatistics[playerName].averagePoints.toFixed(2)}</td>
                        <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{playerStatistics[playerName].pointsScored || 0}</td>
                        <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{playerStatistics[playerName].winPercentage ? playerStatistics[playerName].winPercentage.toFixed(2) + "%" : "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <p>No statistics available.</p>}
            </div>
            </div>           
            <div>
            <h1> Ranking Table</h1>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {Array.isArray(rankingTableDetails) && rankingTableDetails.length > 0 ? (
                <table style={{ borderCollapse: 'collapse', border: '1px solid black', width: '80%', maxWidth: '800px', margin: '0 auto' }}>
                  <thead>
                    <tr>
                      <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center', width: '50%' }}>Winner</th>
                      <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center', width: '50%' }}>Runner-Up</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankingTableDetails.map((rankingtables, index) => (
                      <tr key={index}>
                        <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{rankingtables.Winner}</td>
                        <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{rankingtables.RunnerUp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <p>No ranking table details available.</p>}
            </div>
          </div> 
        </div>
      )}
    </div>
  );
}

export default ViewTournamentDetails;