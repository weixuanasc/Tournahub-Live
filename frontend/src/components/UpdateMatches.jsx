import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavbarTO from './NavbarTO';

function UpdateMatches() {
  const [matchDetails, setMatchDetails] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [updatedMatches, setUpdatedMatches] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch match details when the component mounts
    axios
      .get(`http://localhost:3001/getMatches/${id}`)
      .then((response) => {
        setMatchDetails(response.data);
        // Initialize updatedMatches with the fetched data
        setUpdatedMatches(response.data.map(match => ({...match})));
      })
      .catch((error) => {
        console.error('Error fetching match details:', error);
      })
      .finally(() => {
        setLoadingMatches(false);
      });
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = new Date(dateString).toLocaleDateString('en-GB', options);
    const [day, month, year] = formattedDate.split('/');
    return `${year}-${month}-${day}`;
  };

  const updateMatch = (e, matchId) => {
    e.preventDefault();
    const updatedMatch = updatedMatches.find((match) => match._id === matchId);
    console.log('Updated Match:', updatedMatch);
  
    axios
      .put(`http://localhost:3001/updateMatches/${matchId}`, updatedMatch)
      .then((result) => {
        console.log(result);
        alert('Match updated successfully');
        navigate('/Tournament');
      })
      .catch((err) => console.log(err));
  };
  
  const handleInputChange = (e, matchId, field) => {
    setUpdatedMatches((prevMatches) =>
      prevMatches.map((match) =>
        match._id === matchId ? { ...match, [field]: e.target.value } : match
      )
    );
  };
  

  return (
    <div>
      <NavbarTO />
      <div>
        {loadingMatches ? (
          <p>Loading match details...</p>
        ) : (
          <form>
            {matchDetails.map((match, index) => (
              <div key={index}>
                <h2>
                  Match Number:{' '}
                  <input
                    type="text"
                    value={updatedMatches[index]?.MatchNumber || match.MatchNumber}
                    onChange={(e) => handleInputChange(e, match._id, 'MatchNumber')}
                  />
                </h2>
                <p>
                  Match Name:{' '}
                  <input
                    type="text"
                    value={updatedMatches[index]?.MatchName || match.MatchName}
                    onChange={(e) => handleInputChange(e, match._id, 'MatchName')}
                  />
                </p>
                <p>
                  Match Date:{' '}
                  <input
                    type="date"
                    value={formatDate(updatedMatches[index]?.MatchDate) || formatDate(match.MatchDate)}
                    onChange={(e) => handleInputChange(e, match._id, 'MatchDate')}
                  />
                </p>
                <p>
                  Match Time:{' '}
                  <input
                    type="time"
                    value={updatedMatches[index]?.MatchTime || match.MatchTime}
                    onChange={(e) => handleInputChange(e, match._id, 'MatchTime')}
                  />
                </p>
                <p>
                  Player 1:{' '}
                  <input
                    type="text"
                    value={updatedMatches[index]?.Player1 || match.Player1}
                    onChange={(e) => handleInputChange(e, match._id, 'Player1')}
                  />
                </p>
                <p>
                  Player 2:{' '}
                  <input
                    type="text"
                    value={updatedMatches[index]?.Player2 || match.Player2}
                    onChange={(e) => handleInputChange(e, match._id, 'Player2')}
                  />
                </p>
                <p>
                  Player 1 Score:{' '}
                  <input
                    type="text"
                    value={updatedMatches[index]?.Player1_Score || match.Player1_Score}
                    onChange={(e) => handleInputChange(e, match._id, 'Player1_Score')}
                  />
                </p>
                <p>
                  Player 2 Score:{' '}
                  <input
                    type="text"
                    value={updatedMatches[index]?.Player2_Score || match.Player2_Score}
                    onChange={(e) => handleInputChange(e, match._id, 'Player2_Score')}
                  />
                </p>
                <p>
                  Winner:{' '}
                  <input
                    type="text"
                    value={updatedMatches[index]?.Winner || match.Winner}
                    onChange={(e) => handleInputChange(e, match._id, 'Winner')}
                  />
                </p>
                {/* ... other input fields ... */}
                <button onClick={(e) => updateMatch(e, match._id)}>Update Match</button>
              </div>
            ))}
          </form>
        )}
      </div>
    </div>
  );
}

export default UpdateMatches;
