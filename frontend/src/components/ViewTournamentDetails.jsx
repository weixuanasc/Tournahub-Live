import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SelectNavbar from "./SelectNavbar";
import NavbarForTournamentDetails from "./NavbarForTournamentDetails";
import jsPDF from "jspdf";
import "./ViewTournamentDetails.css"; // Import CSS file
import SportsRugbyIcon from "@mui/icons-material/SportsRugby";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import SportsKabaddiIcon from "@mui/icons-material/SportsKabaddi";
import SportsScoreIcon from "@mui/icons-material/SportsScore";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import bgmImage2 from "../components/images/details.jpg";

function ViewTournamentDetails() {
  const [userDetails, setUserDetails] = useState({});
  const [tournamentDetails, setTournamentDetails] = useState({});
  const [matchDetails, setMatchDetails] = useState({});
  const [rankingTableDetails, setRankingTableDetails] = useState({});
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingTournament, setLoadingTournament] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [LoadingRankingTable, setLoadingRankingTable] = useState(true);
  const [statisticsGenerated, setStatisticsGenerated] = useState(false);
  const [playerStatistics, setPlayerStatistics] = useState({});
  const { id } = useParams();
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
  useEffect(() => {
    // Fetch user details when the component mounts
    axios
      .get(`https://api.fyp23s424.com/getAllUser`)
      .then((response) => {
        setUserDetails(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      })
      .finally(() => {
        setLoadingUsers(false);
      });
  }, [id]);

  useEffect(() => {
    // Fetch tournament details when the component mounts
    axios
      .get(`https://api.fyp23s424.com/getTournamentDetails/${id}`)
      .then((response) => {
        setTournamentDetails(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tournament details:", error);
      })
      .finally(() => {
        setLoadingTournament(false);
      });
  }, [id]);

  axios
    .get(`https://api.fyp23s424.com/getMatches/${id}`)
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
      console.error("Error fetching match details:", error);
    })
    .finally(() => {
      setLoadingMatches(false);
    }, [id, statisticsGenerated]);

  useEffect(() => {
    // Fetch ranking table details when the component mounts
    axios
      .get(`https://api.fyp23s424.com/getRankingTable/${id}`)
      .then((response) => {
        setRankingTableDetails(response.data);
      })
      .catch((error) => {
        console.error("Error fetching ranking table details:", error);
      })
      .finally(() => {
        setLoadingRankingTable(false);
      });
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const exportScoresheet = () => {
    window.open(
      `https://api.fyp23s424.com/scoresheet/${tournamentDetails.tournamentSport}.pdf`,
      "_blank",
      "noreferrer"
    );
  };

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
      if (match.Player1.trim() !== "") {
        if (!updatedPlayerStatistics[match.Player1]) {
          updatedPlayerStatistics[match.Player1] = {
            matchesPlayed: 0,
            matchesWon: 0,
            pointsScored: 0,
            averagePoints: 0,
          };
        }
        updatedPlayerStatistics[match.Player1].matchesPlayed++;
        updatedPlayerStatistics[match.Player1].pointsScored += parseInt(
          match.Player1_Score
        );
        if (match.Winner === match.Player1) {
          updatedPlayerStatistics[match.Player1].matchesWon++;
        }
      }

      // Update statistics for Player 2
      if (match.Player2.trim() !== "") {
        if (!updatedPlayerStatistics[match.Player2]) {
          updatedPlayerStatistics[match.Player2] = {
            matchesPlayed: 0,
            matchesWon: 0,
            pointsScored: 0,
            averagePoints: 0,
          };
        }
        updatedPlayerStatistics[match.Player2].matchesPlayed++;
        updatedPlayerStatistics[match.Player2].pointsScored += parseInt(
          match.Player2_Score
        );
        if (match.Winner === match.Player2) {
          updatedPlayerStatistics[match.Player2].matchesWon++;
        }
      }
    });

    // Calculate additional statistics like win percentage and average points
    Object.keys(updatedPlayerStatistics).forEach((player) => {
      const stats = updatedPlayerStatistics[player];
      stats.winPercentage =
        stats.matchesPlayed !== 0
          ? (stats.matchesWon / stats.matchesPlayed) * 100
          : 0;
      stats.averagePoints =
        stats.matchesPlayed !== 0
          ? stats.pointsScored / stats.matchesPlayed
          : 0;
    });

    // Update state with the generated player statistics
    setPlayerStatistics(updatedPlayerStatistics);

    // Log the generated player statistics
    console.log("Generated player statistics:", updatedPlayerStatistics);
  };

  const sortedPlayerStatistics = Object.keys(playerStatistics).sort((a, b) => {
    const winPercentageA = playerStatistics[a].winPercentage || 0;
    const winPercentageB = playerStatistics[b].winPercentage || 0;
    return winPercentageB - winPercentageA;
  });

  const getUserName = (userId) => {
    const user = userDetails.find((user) => user._id === userId);
    return user ? user.name : "";
  };

  const updateTournamentStatus = (status) => {
    setTournamentDetails((prevState) => ({
      ...prevState,
      tournamentStatus: status,
    }));
  };

  return (
    <div className="container">
      <img
        className="bg"
        src={bgmImage2}
        alt="Background"
        style={{ transform: `translateY(${scrollY * 0.001}px)` }}
      />
      {SelectNavbar()}

      {loadingTournament ||
      loadingMatches ||
      LoadingRankingTable ||
      loadingUsers ? (
        <p>Loading...</p>
      ) : (
        <>
          <NavbarForTournamentDetails />
          <div className="header box">
            <h1 id="sponsor">Sponsor</h1>
            {tournamentDetails.tournamentSponsorIcon && (
              <>
                <div className="sponsor">
                  <img
                    width={"150px"}
                    src={`https://api.fyp23s424.com/tournamentsponsor/${tournamentDetails.tournamentSponsorIcon}`}
                    alt={tournamentDetails.tournamentSponsorIcon}
                  />
                  <p>
                    <u>
                      This tournament is brought to you by the following
                      sponsor:
                    </u>
                  </p>
                  <h2>{tournamentDetails.tournamentSponsor}</h2>
                </div>
              </>
            )}
            {!tournamentDetails.tournamentSponsorIcon && (
              <div className="sponsor">
                <p>
                  This tournament has not been sponsored yet. If interested,
                  sponsor now!
                </p>
              </div>
            )}
          </div>
          <div className="flex-container">
            <div className="tournament-details-container">
              <div className="tournament-details box">
                <div className="sporty">
                  <h1 id="details">{tournamentDetails.tournamentName}</h1>

                  <p>
                    <SportsScoreIcon />
                    Sport: {tournamentDetails.tournamentSport}
                  </p>
                  <p>Skill Level: {tournamentDetails.tournamentSkillLevel}</p>
                  <p>Format: {tournamentDetails.tournamentFormat}</p>
                  <p>
                    <WarehouseIcon />
                    Venue: {tournamentDetails.tournamentVenue}
                  </p>
                  <p>Details: {tournamentDetails.tournamentDetails}</p>
                  <p>
                    Start Date:{"  "}
                    {formatDate(tournamentDetails.tournamentStartDate)} -{" "}
                    {formatDate(tournamentDetails.tournamentEndDate)}
                  </p>
                  <p>
                    Number of Players:{" "}
                    {tournamentDetails.tournamentNumberofplayers}
                  </p>
                  <p>
                    Number of Matches:{" "}
                    {tournamentDetails.tournamentNumberofmatches}
                  </p>
                  <p>Tournament Status: {tournamentDetails.tournamentStatus}</p>
                  <button
                    className="btn btn-warning"
                    onClick={exportScoresheet}
                  >
                    Export Scoresheet
                  </button>
                </div>{" "}
              </div>
            </div>
            <div className="player-list-container">
              <div className="player-list box">
                <h1 id="players">
                  <SportsKabaddiIcon
                    style={{
                      marginRight: "10px",
                      fontSize: 35,
                    }}
                  />
                  Players
                </h1>
                <div className="sporty">
                  {tournamentDetails.tournamentPlayers &&
                    tournamentDetails.tournamentPlayers.map((player, index) => (
                      <p key={index}>{getUserName(player)}</p>
                    ))}
                </div>
              </div>
            </div>
          </div>
          <div className="matches box">
            <h1 id="matches">Matches</h1>
            {Array.isArray(matchDetails) && matchDetails.length > 0 ? (
              matchDetails.map((match, index) => (
                <div className="match" key={index}>
                  <div className="sporty">
                    <h3>Match {match.MatchNumber}</h3>
                    <br />
                    <h2>{match.MatchName}</h2>
                    <p>Match Date: {formatDate(match.MatchDate)}</p>
                    <p>Match Time: {match.MatchTime}</p>
                    <div className="playerList">
                      <p1>
                        <SportsRugbyIcon
                          style={{
                            marginRight: "10px",
                            fontSize: 45,
                            color: "orange",
                          }}
                        />
                        {match.Player1}
                      </p1>
                      <p>Vs</p>
                      <p2>
                        {match.Player2}
                        <SportsRugbyIcon
                          style={{
                            marginRight: "10px",
                            fontSize: 45,
                            color: "blue",
                          }}
                        />
                      </p2>
                    </div>
                    <div className="scoreList">
                      <p1>{match.Player1_Score}</p1>
                      <p2>{match.Player2_Score}</p2>
                    </div>
                    <h3>
                      <div className="winner">
                        <EmojiEventsOutlinedIcon
                          style={{
                            marginRight: "10px",
                            fontSize: 45,
                          }}
                        />
                        Winner: {match.Winner}
                      </div>
                      <br />
                    </h3>
                  </div>
                </div>
              ))
            ) : (
              <p>No match details available.</p>
            )}
            <button className="btn btn-warning" onClick={exportMatches}>
              Export Matches
            </button>
          </div>
          <div className="flex-container-horizontal">
            <div className="statistics box">
              <h1 id="statistics">
                <TrendingUpIcon
                  style={{
                    marginRight: "10px",
                    fontSize: 45,
                  }}
                />
                Statistics
              </h1>
              <div style={{ display: "flex", justifyContent: "center" }}>
                {playerStatistics && sortedPlayerStatistics.length > 0 ? (
                  <table className="statistics-table">
                    <thead>
                      <tr>
                        <th>Rank</th> {/* New column */}
                        <th>Player</th>
                        <th>Matches Played</th>
                        <th>Matches Won</th>
                        <th>Average Points</th>
                        <th>Points Scored</th>
                        <th>Win Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedPlayerStatistics.map((playerName, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td> {/* Display index as rank */}
                          <td>{playerName}</td>
                          <td>
                            {playerStatistics[playerName].matchesPlayed || 0}
                          </td>
                          <td>
                            {playerStatistics[playerName].matchesWon || 0}
                          </td>
                          <td>
                            {playerStatistics[playerName].averagePoints.toFixed(
                              2
                            )}
                          </td>
                          <td>
                            {playerStatistics[playerName].pointsScored || 0}
                          </td>
                          <td>
                            {playerStatistics[playerName].winPercentage
                              ? playerStatistics[
                                  playerName
                                ].winPercentage.toFixed(2) + "%"
                              : "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No statistics available.</p>
                )}
              </div>
            </div>
            <div className="ranking-table box">
              <h1 id="rankingtable">
                <MilitaryTechIcon
                  style={{
                    marginRight: "5px",
                    fontSize: 45,
                  }}
                />
                Ranking Table
              </h1>
              <div style={{ display: "flex", justifyContent: "center" }}>
                {Array.isArray(rankingTableDetails) &&
                rankingTableDetails.length > 0 ? (
                  <table className="ranking-table-table">
                    <thead>
                      <tr>
                        <th>Winner</th>
                        <th>Runner-Up</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rankingTableDetails.map((rankingtables, index) => (
                        <tr key={index}>
                          <td>{rankingtables.Winner}</td>
                          <td>{rankingtables.RunnerUp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No ranking table details available.</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
export default ViewTournamentDetails;
