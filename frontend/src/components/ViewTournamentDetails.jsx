import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SelectNavbar from "./SelectNavbar";
import jsPDF from "jspdf";

function ViewTournamentDetails() {
  const domainName = "http://localhost:3001" ;
  const [tournamentDetails, setTournamentDetails] = useState({});
  const [matchDetails, setMatchDetails] = useState({});
  const [rankingTableDetails, setRankingTableDetails] = useState({});
  const [statisticsDetails, setStatisticsDetails] = useState({});
  const [loadingTournament, setLoadingTournament] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [LoadingRankingTable, setLoadingRankingTable] = useState(true);
  const [LoadingStatistics, setLoadingStatistics] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    // Fetch tournament details when the component mounts
    axios.get(`http://localhost:3001/getTournamentDetails/${id}`)
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

  useEffect(() => {
    // Fetch match details when the component mounts
    axios.get(`http://localhost:3001/getMatches/${id}`)
      .then((response) => {
        setMatchDetails(response.data);
      })
      .catch((error) => {
        console.error('Error fetching match details:', error);
      })
      .finally(() => {
        setLoadingMatches(false);
      });
  }, [id]);

  useEffect(() => {
    // Fetch ranking table details when the component mounts
    axios.get(`http://localhost:3001/getRankingTable/${id}`)
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

  useEffect(() => {
    // Fetch statistics table details when the component mounts
    axios.get(`http://localhost:3001/getStatistics/${id}`)
      .then((response) => {
        setStatisticsDetails(response.data);
      })
      .catch((error) => {
        console.error('Error fetching ranking table details:', error);
      })
      .finally(() => {
        setLoadingStatistics(false);
      });
  }, [id]);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  const exportScoresheet = () =>{
    window.open(`http://localhost:3001/scoresheet/${tournamentDetails.tournamentSport}.pdf`, "_blank", "noreferrer")
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
  


  return (
    <div>
      {SelectNavbar()}
      {loadingTournament || loadingMatches || LoadingRankingTable || LoadingStatistics ? (
        <p>Loading...</p>
      ) : (
<div>
          <h1>Sponsor</h1>
          {tournamentDetails.tournamentSponsorIcon && (
          <>
            <img
              width={"150px"}
              src={`${domainName}/tournamentsponsor/${tournamentDetails.tournamentSponsorIcon}`}
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
            <h1>Ranking Table</h1>
            {Array.isArray(rankingTableDetails) && rankingTableDetails.length > 0 ? (
            rankingTableDetails.map((rankingtables, index) => (
              <div key={index}>
                <p>Winner: {rankingtables.Winner}</p>
                <p>Runner-Up: {rankingtables.RunnerUp}</p>
                {/* Display other ranking table as needed */}
              </div>
              
            ))

          ) : (
            <p>No ranking table details available.</p>
          )}
              </div>
              <div>
            <h1>Statistics</h1>
            {Array.isArray(statisticsDetails) && statisticsDetails.length > 0 ? (
            statisticsDetails.map((statistics, index) => (
              <div key={index}>
                <p>Paricipant: {statistics.Participant}</p>
                <p>Score(W/L) : {statistics.Score}</p>
                <p>Average Score: {statistics.AverageScore}</p>
                <p>Total Score: {statistics.TotalScore}</p>
                <p>----------------------------------------</p>
                {/* Display other statistics as needed */}
              </div>
              
            ))

          ) : (
            <p>No Statistics available.</p>
          )}
              </div>
        </div>
      )}
    </div>
  );
}

export default ViewTournamentDetails;