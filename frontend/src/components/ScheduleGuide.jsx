import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import NavbarTO from "./NavbarTO";

function ScheduleGuide({ }) {
  const [loadingTournament, setLoadingTournament] = useState(false);
  const [tournamentDetails, setTournamentDetails] = useState(null);
  const [noRounds, setNoRounds] = useState(0);
  const [matchesPerRound, setMatchesPerRound] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    setLoadingTournament(true);
    axios.get(`http://localhost:3001/getTournamentDetails/${id}`)
      .then((response) => {
        setTournamentDetails(response.data);
        console.log(response.data);
        const { noRounds, matchesPerRound } = calculateTournamentSchedule(response.data);
        console.log('Number of rounds:', noRounds);
        console.log('Matches per round:', matchesPerRound);
        setNoRounds(noRounds);
        setMatchesPerRound(matchesPerRound);
      })
      .catch((error) => {
        console.error('Error fetching tournament details:', error);
        setTournamentDetails(null);
      })
      .finally(() => {
        setLoadingTournament(false);
      });
  }, [id]);

  //
  const calculateTournamentSchedule = (tournamentData) => {
    if (!tournamentData) return { noRounds: 0, matchesPerRound: [] };
    const { tournamentFormat, tournamentNumberofplayers } = tournamentData;
    const numberOfPlayers = parseInt(tournamentNumberofplayers);

    if (numberOfPlayers === 1 || numberOfPlayers === 0) {
        return { noRounds: 0, matchesPerRound: [] };
    }

    let noRounds = 0;
    let matchesPerRound = [];

    if (tournamentFormat === 'Single Elimination') {
        if (numberOfPlayers === 2) {
            noRounds = 1;
            matchesPerRound = [1];
            return { noRounds, matchesPerRound };
        } else if (numberOfPlayers === 3) {
            noRounds = 2;
            matchesPerRound = [2, 1];
            return { noRounds, matchesPerRound };
        }

        if ((numberOfPlayers & (numberOfPlayers - 1)) === 0 && numberOfPlayers !== 0) {
            const noRoundsGenerated = Math.ceil(Math.log2(numberOfPlayers));
            noRounds = noRoundsGenerated;

            for (let i = 0; i < noRoundsGenerated; i++) {
                matchesPerRound.push((numberOfPlayers / Math.pow(2, i)) / 2);
            }
            return { noRounds, matchesPerRound };
        } else {
            const nextPowerOfTwo = numberOfPlayers <= 0 ? 1 : 2 ** Math.ceil(Math.log2(numberOfPlayers));
            let firstRound = (numberOfPlayers - (nextPowerOfTwo - numberOfPlayers)) / 2;
            const remainingPlayers = numberOfPlayers - firstRound;

            const noRoundsGenerated = Math.ceil(Math.log2(remainingPlayers));
            noRounds = noRoundsGenerated + 1;

            matchesPerRound[0] = firstRound;

            for (let i = 1; i < noRoundsGenerated + 1; i++) {
                matchesPerRound.push((remainingPlayers / Math.pow(2, i - 1)) / 2);
            }
            return { noRounds, matchesPerRound };
        }
    } else if (tournamentFormat === 'Double Elimination') {
      let winnerBracket = [];
      if ((numberOfPlayers & (numberOfPlayers - 1)) === 0 && numberOfPlayers !== 0) {
          const noRoundsGenerated = Math.ceil(Math.log2(numberOfPlayers));

          for (let i = 0; i < noRoundsGenerated; i++) {
              winnerBracket.push((numberOfPlayers / Math.pow(2, i)) / 2);
          }
      } else {
          const nextPowerOfTwo = numberOfPlayers <= 0 ? 1 : 2 ** Math.ceil(Math.log2(numberOfPlayers));
          let firstRound = (numberOfPlayers - (nextPowerOfTwo - numberOfPlayers)) / 2;
          const remainingParticipants = numberOfPlayers - firstRound;
          const noRoundsGenerated = Math.ceil(Math.log2(remainingParticipants));

          winnerBracket[0] = firstRound;

          for (let i = 1; i < noRoundsGenerated + 1; i++) {
              winnerBracket.push((remainingParticipants / Math.pow(2, i - 1)) / 2);
          }
      }

      let combinedBracket = [];
      let loserBracket = [];
      let addParticipants = 0;
      let prevWinner = 0;

      combinedBracket.push(winnerBracket[0]);

      for (let q = 0; q < winnerBracket.length - 1; q++) {
          while ((addParticipants + prevWinner) > winnerBracket[q]) {
              let participants = addParticipants + prevWinner;
              let matchesThisRnd = Math.floor(participants / 2);
              loserBracket.push(matchesThisRnd);
              addParticipants = participants - matchesThisRnd * 2;
              prevWinner = matchesThisRnd;
              combinedBracket.push(matchesThisRnd);
          }
          let participants = winnerBracket[q] + addParticipants + prevWinner;
          let matchesThisRnd = Math.floor(participants / 2);
          loserBracket.push(matchesThisRnd);
          addParticipants = participants - matchesThisRnd * 2;
          prevWinner = matchesThisRnd;
          combinedBracket.push(matchesThisRnd + winnerBracket[q + 1]);
      }

      while (addParticipants >= 1 || prevWinner > 1) {
          let participants = addParticipants + prevWinner;
          let matchesThisRnd = Math.floor(participants / 2);
          loserBracket.push(matchesThisRnd);
          addParticipants = participants - matchesThisRnd * 2;
          prevWinner = matchesThisRnd;
          combinedBracket.push(matchesThisRnd);
      }

      let participants = 1 + prevWinner;
      let matchesThisRnd = Math.floor(participants / 2);
      loserBracket.push(matchesThisRnd);
      addParticipants = participants - matchesThisRnd * 2;
      prevWinner = matchesThisRnd;
      combinedBracket.push(matchesThisRnd);

      let z = 2;
      for (let q = 0; q < z; q++) {
          combinedBracket.push(1);
          winnerBracket.push(1);
      }

      noRounds = combinedBracket.length;
      matchesPerRound = combinedBracket;
  } else {
    noRounds = 0;
    matchesPerRound = []; //If they select a custom format, do not generate data
  }

  return { noRounds, matchesPerRound };
};

const DisplayTournamentSchedule = ({ noRounds, matchesPerRound }) => {
  if (noRounds === 0 && matchesPerRound.length === 0) {
      return (
          <div>
              <h2><u>Tournament Schedule</u></h2>
              <p>No schedule guide available as your selected a custom format</p>
          </div>
      );
  }

  return (
      <div>
          <h2><u>Tournament Schedule Sample</u></h2>
          <ul>
              {matchesPerRound.map((matches, index) => (
                  <p key={index}>Round {index + 1}: {matches} Matches</p>
              ))}
          </ul>
      </div>
  );
};

  return (
    <div>
      <NavbarTO />
      <h1>Schedule Guide</h1>
      <p>
        This is an automatically generated tournament schedule guide to help you understand how to format your tournament
        based on the number of players and format you have selected. Add your matches now!
    </p>
    <p>
        <strong>Disclaimer:</strong> You have to seed your byes and name your rounds accordingly based on your number of players and format. 
    </p>
    <p>
        <strong>Tip:</strong> Tournaments with odd number of players typically require at least 1 bye in Round 1 
    </p>
      {loadingTournament ? (
                <p>Loading tournament...</p>
            ) : (
                <>
                    <h2><u>Tournament Details</u></h2>
                    {tournamentDetails && (
                        <ul>
                            <p>Format: {tournamentDetails.tournamentFormat}</p>
                            <p>Number of Players: {tournamentDetails.tournamentNumberofplayers}</p>
                            <p>Number of Matches: {tournamentDetails.tournamentNumberofmatches}</p>
                        </ul>
                    )}
                    <DisplayTournamentSchedule noRounds={noRounds} matchesPerRound={matchesPerRound} />
                </>
      )}
    </div>
  );
}

export default ScheduleGuide;