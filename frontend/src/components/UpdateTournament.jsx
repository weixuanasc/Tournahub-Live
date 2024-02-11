import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavbarTO from './NavbarTO';
import "./UpdateTournament.css";

function UpdateTournament() {
  const [tournamentDetails, setTournamentDetails] = useState([]);
  const [updatedTournaments, setUpdatedTournaments] = useState([]);
  const [loadingTournament, setLoadingTournament] = useState(true);
  const [sportsList, setSportsList] = useState([]);
  const [tournamentFormat, settournamentFormat] = useState('');
  const [customFormat, setCustomFormat] = useState('');
  const [showCustomFormatInput, setShowCustomFormatInput] = useState(false);
  const [tournamentNumberofplayers, settournamentNumberofplayers] = useState('');
  const [tournamentNumberofmatches, settournamentNumberofmatches] = useState('');
  const [manualNumberOfMatches, setManualNumberOfMatches] = useState('');
  const [manualNumberOfMatchesInput, setManualNumberOfMatchesInput] = useState(false);
  
  const { id } = useParams();
  const navigate = useNavigate();
  
  const calculateNumberOfMatches = (format, numberOfPlayers) => {
    const parsedNumberOfPlayers = parseInt(numberOfPlayers, 10);
    
    if (isNaN(parsedNumberOfPlayers)) {
      console.error('Error: Unable to parse number of players to an integer.', numberOfPlayers);
      return 0;  // Default value when parsing fails
    }  
    if (format === 'Single Elimination') {
      return parsedNumberOfPlayers - 1;
    } else if (format === 'Double Elimination') {
      return (parsedNumberOfPlayers - 1) * 2 + 1;
    }
    
    // Add more conditions for other formats as needed
    return 0; // Default value if format is not recognized
  };
  
  
  useEffect(() => {
    axios
    .get(`http://localhost:3001/getTournamentDetails/${id}`)
    .then((response) => {
      setTournamentDetails(response.data);
      setUpdatedTournaments([response.data]);
    })
    .catch((error) => {
      console.error('Error fetching tournament details:', error);
    })
    .finally(() => {
      setLoadingTournament(false);
    });
  }, [id]);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = new Date(dateString).toLocaleDateString('en-GB', options);
    const [day, month, year] = formattedDate.split('/');
    return `${year}-${month}-${day}`;
  };
  
  const updateTournament = (e, tournamentId) => {
    e.preventDefault();
    const updatedTournament = updatedTournaments.find(
      (tournament) => tournament._id === tournamentId
      );
      console.log('Updated Tournament:', updatedTournament);
      if (customFormat !== '') {
        updatedTournament.tournamentFormat = customFormat;
      }
      
      updatedTournament.tournamentNumberofmatches = manualNumberOfMatchesInput
      ? manualNumberOfMatches
      : calculateNumberOfMatches(
        updatedTournament.tournamentFormat || '',
        updatedTournament.tournamentNumberofplayers || ''
        );
        axios
        .put(`http://localhost:3001/updateTournament/${tournamentId}`, updatedTournament)
        .then((result) => {
          console.log(result);
          alert('Tournament updated successfully');
          navigate('/Tournament');
        })
        .catch((err) => console.log(err));
      };
      
      const handleInputChange = (e, tournamentId, field) => {
        const value = e.target.value;
        
        setUpdatedTournaments((prevTournaments) =>
        prevTournaments.map((tournament) =>
        tournament._id === tournamentId ? { ...tournament, [field]: value } : tournament
        )
        );
        
        setUpdatedTournaments((prevTournaments) =>
        prevTournaments.map((tournament) => {
          if (field === 'tournamentNumberofplayers') {
            const parsedValue = parseInt(value, 10);
            const updatedMatches = calculateNumberOfMatches(
              tournament.tournamentFormat || '',
              parsedValue
              );
              
              return {
                ...tournament,
                tournamentNumberofplayers: parsedValue,
                tournamentNumberofmatches: updatedMatches,
              };
            }
            
            if (field === 'tournamentFormat') {
              if (value === 'Others') {
                setShowCustomFormatInput(true);
                setManualNumberOfMatchesInput(true);
              } else {
                setShowCustomFormatInput(false);
                setCustomFormat('');
                setManualNumberOfMatches('');
              }
              
              const isOthers = value === 'Others';
              const updatedMatches = calculateNumberOfMatches(
                isOthers ? customFormat || '' : value,
                tournament.tournamentNumberofplayers || 0
                );
                
                return {
                  ...tournament,
                  tournamentFormat: isOthers ? (customFormat ? customFormat : 'Others') : value,
                  tournamentNumberofmatches: manualNumberOfMatchesInput ? manualNumberOfMatches : updatedMatches,
                };
              }
              
              return tournament;
            })
            );
          };
          
          
          useEffect(() => {
            // Fetch the list of sports from the database
            axios
            .get('http://localhost:3001/getSports')
            .then((response) => {
              setSportsList(response.data);
            })
            .catch((err) => console.log(err));
          }, []); // Run only once when the component mounts
          
          return (
            <div className="update-tournament-container">
            <NavbarTO />
            {loadingTournament ? (
              <p>Loading...</p>
              ) : (
                <div>
                <div className="form-group">
                <label htmlFor="tournamentName">Tournament Name:</label>
                <input
                type="text"
                className="form-control"
                value={updatedTournaments.find((tournament) => tournament._id === id)?.tournamentName || ''}
                onChange={(e) => handleInputChange(e, id, 'tournamentName')}
                />
                </div>
                
                <div className="form-group">
                <label htmlFor="tournamentSport">Sport:</label>
                <select
                className="form-control"
                value={updatedTournaments.find((tournament) => tournament._id === id)?.tournamentSport || ''}
                onChange={(e) => handleInputChange(e, id, 'tournamentSport')}
                >
                {sportsList.map((sport) => (
                  <option key={sport._id} value={sport.name}>
                  {sport.name}
                  </option>
                  ))}
                  </select>
                  </div>
                  
                  <div className="form-group">
                  <label htmlFor="tournamentFormat">Format:</label>
                  <select
                  className="form-control"
                  value={updatedTournaments.find((tournament) => tournament._id === id)?.tournamentFormat || ''}
                  onChange={(e) => handleInputChange(e, id, 'tournamentFormat')}
                  >
                  <option value="Single Elimination">Single Elimination</option>
                  <option value="Double Elimination">Double Elimination</option>
                  <option value="Others">Others...</option>
                  </select>
                  {updatedTournaments.find((tournament) => tournament._id === id)?.tournamentFormat === 'Others' && (
                    <div className="form-group">
                    <label htmlFor="customFormat">Custom Format:</label>
                    <input
                    type="text"
                    className="form-control"
                    value={customFormat}
                    onChange={(e) => setCustomFormat(e.target.value)}
                    />
                    </div>
                    )}
                    </div>
                    
                    <div className="form-group">
                    <label htmlFor="tournamentVenue">Venue:</label>
                    <input
                    type="text"
                    className="form-control"
                    value={updatedTournaments.find((tournament) => tournament._id === id)?.tournamentVenue || ''}
                    onChange={(e) => handleInputChange(e, id, 'tournamentVenue')}
                    />
                    </div>
                    
                    <div className="form-group">
                    <label htmlFor="tournamentDetails">Details:</label>
                    <input
                    type="text"
                    className="form-control"
                    value={updatedTournaments.find((tournament) => tournament._id === id)?.tournamentDetails || ''}
                    onChange={(e) => handleInputChange(e, id, 'tournamentDetails')}
                    />
                    </div>
                    
                    <div className="form-group">
                    <label htmlFor="tournamentStartDate">Start Date:</label>
                    <input
                    type="date"
                    className="form-control"
                    value={formatDate(updatedTournaments.find((tournament) => tournament._id === id)?.tournamentStartDate || '')}
                    onChange={(e) => handleInputChange(e, id, 'tournamentStartDate')}
                    />
                    </div>
                    
                    <div className="form-group">
                    <label htmlFor="tournamentEndDate">End Date:</label>
                    <input
                    type="date"
                    className="form-control"
                    value={formatDate(updatedTournaments.find((tournament) => tournament._id === id)?.tournamentEndDate || '')}
                    onChange={(e) => handleInputChange(e, id, 'tournamentEndDate')}
                    />
                    </div>
                    
                    <div className="form-group">
                    <label htmlFor="tournamentNumberofplayers">Number of Players:</label>
                    <input
                    type="text"
                    className="form-control"
                    value={updatedTournaments.find((tournament) => tournament._id === id)?.tournamentNumberofplayers || ''}
                    onChange={(e) => handleInputChange(e, id, 'tournamentNumberofplayers')}
                    />
                    </div>
                    
                    <div className="form-group">
                    <label htmlFor="tournamentNumberofMatches">Number of Matches:</label>
                    <input
                    type="text"
                    className="form-control"
                    value={manualNumberOfMatchesInput ? manualNumberOfMatches : calculateNumberOfMatches(
                      updatedTournaments.find((tournament) => tournament._id === id)?.tournamentFormat || '',
                      updatedTournaments.find((tournament) => tournament._id === id)?.tournamentNumberofplayers || ''
                      )}
                      onChange={(e) => setManualNumberOfMatches(e.target.value)}
                      disabled={!manualNumberOfMatchesInput}
                      />
                      </div>
                      
                      <div className="form-group">
                      <label htmlFor="tournamentStatus">Tournament Status:</label>
                      <select
                      className="form-control"
                      value={(updatedTournaments.find((tournament) => tournament._id === id) || {}).tournamentStatus || ''}
                      onChange={(e) => handleInputChange(e, id, 'tournamentStatus')}
                      >
                      <option value="Open for Application">Open for Application</option>
                      <option value="Closed Application">Closed Application</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                      {/* Add more options as needed */}
                      </select>
                      </div>
                      
                      {/* Add more input fields and labels for other fields as needed */}
                      
                      <div className="form-group">
                      <button className="btn btn-primary" onClick={(e) => updateTournament(e, id)}>Update Tournament</button>
                      </div>
                      </div>
                      )}
                      </div>
                      );
                      
                    }
                    
                    export default UpdateTournament;