import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavbarTO from "./NavbarTO";

function CreateTournament() {
  const [user, setUser] = useState(null);
  const [organizerId, setorganizerId] = useState('');
  const [tournamentName, settournamentName] = useState('');
  const [tournamentSport, settournamentSport] = useState('');
  const [sportsList, setSportsList] = useState([]);
  const [tournamentSkillLevel, settournamentSkillLevel] = useState('');
  const [tournamentFormat, settournamentFormat] = useState('Single Elimination');
  const [isCustomFormat, setIsCustomFormat] = useState(false);
  const [tournamentVenue, settournamentVenue] = useState('');
  const [tournamentDetails, settournamentDetails] = useState('');
  const [tournamentStartDate, settournamentStartDate] = useState('');
  const [tournamentEndDate, settournamentEndDate] = useState('');
  const [tournamentNumberofplayers, settournamentNumberofplayers] = useState('');
  const [tournamentNumberofmatches, settournamentNumberofmatches] = useState('');
  const [tournamentStatus, settournamentStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [customFormat, setCustomFormat] = useState('');


  const navigate = useNavigate();
  axios.defaults.withCredentials = true;


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/getCurrentUser"
        );
        setUser(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  useEffect(() => {
    // Set the initial value of organizerId when the component mounts
    setorganizerId(user ? user._id : '');
  }, [user]);


  useEffect(() => {
    // Fetch the list of sports from the database
    axios
      .get('http://localhost:3001/getSports')
      .then((response) => {
        setSportsList(response.data);
      })
      .catch((err) => console.log(err));
  }, []); // Run only once when the component mounts

  useEffect(() => {
    // Calculate and update the number of matches when the number of players or format changes
    calculateNumberOfMatches();
  }, [tournamentNumberofplayers, tournamentFormat, isCustomFormat]);

  const calculateNumberOfMatches = () => {
    if (tournamentNumberofplayers <= 0) {
      // If the number of players is less than or equal to 0, set matches to 0
      settournamentNumberofmatches(0);
      setIsCustomFormat(false);
    } else if (tournamentFormat === 'Single Elimination') {
      // Single Elimination: n - 1 matches
      settournamentNumberofmatches(tournamentNumberofplayers - 1);
      setIsCustomFormat(false);
    } else if (tournamentFormat === 'Double Elimination') {
      // Double Elimination: (n - 1) * 2 + 1 matches
      settournamentNumberofmatches((tournamentNumberofplayers - 1) * 2 + 1);
      setIsCustomFormat(false);
    } else if (tournamentFormat === 'Others') {
      // Use customNumberOfMatches for "Others"
      settournamentNumberofmatches('');
      setIsCustomFormat(true);
    } else {
      // Set to false for other formats
      setIsCustomFormat(false);
    }
  };
  const handleCustomFormatChange = (e) => {
    setCustomFormat(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalTournamentFormat = tournamentFormat === 'Others' ? customFormat : tournamentFormat;
    axios
      .post('http://localhost:3001/CreateTournament', 
      { organizerId, 
        tournamentName, tournamentSport, tournamentSkillLevel,
        tournamentFormat : finalTournamentFormat,
        tournamentVenue,
        tournamentDetails, 
        tournamentStartDate, tournamentEndDate, 
        tournamentNumberofplayers, tournamentNumberofmatches, 
        tournamentStatus: 'Open for Application' })
      .then((result) => {
        console.log(result);
        alert('Tournament created successfully');
        navigate('/Tournament');
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <NavbarTO />
      <div className="d-flex justify-content-center align-items-center">
        <div className="w-50 bg-white rounded p-3">
          <form onSubmit={handleSubmit}>
            <h2>Create Tournament</h2>

            <div className="mb-2">
  <label htmlFor="organizerId">Organizer ID</label>
  <input
    type="text"
    id="organizerId"
    className="form-control"
    value={organizerId}
    onChange={(e) => setorganizerId(e.target.value)}
    readOnly
  />
</div>
            <div className="mb-2">
              <label htmlFor="tournamentName">Name</label>
              <input
                type="text"
                id="tournamentName"
                placeholder="Enter Name"
                className="form-control"
                onChange={(e) => settournamentName(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="tournamentSport">Sport</label>
              <select
                id="tournamentSport"
                className="form-control"
                value={tournamentSport}
                onChange={(e) => settournamentSport(e.target.value)}
              >
                <option value="" disabled>
                  Select Sport
                </option>
                {sportsList.map((sport) => (
                  <option key={sport._id} value={sport.name}>
                    {sport.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <label htmlFor="tournamentSkillLevel">Skill Level</label>
              <select
              id="tournamentSkillLevel"
              className="form-control"
              value={tournamentSkillLevel}
              onChange={(e) => settournamentSkillLevel(e.target.value)}
              >
                <option value="" disabled>
                  Select Skill Level
                </option>
              <option value="Beginner">Beginner</option>
              <option value="Amateur">Amateur</option>
              <option value="Professional">Professional</option>
              </select>
            </div>

            <div className="mb-2">
        <label htmlFor="tournamentFormat">Format</label>
        <select
          id="tournamentFormat"
          className="form-control"
          value={tournamentFormat}
          onChange={(e) => {
            settournamentFormat(e.target.value);
            // Reset customFormat when selecting a different format
            setCustomFormat('');
          }}
        >
          <option value="Single Elimination">Single Elimination</option>
          <option value="Double Elimination">Double Elimination</option>
          <option value="Others">Others...</option>
        </select>
      </div>
      {/* Conditionally render input for custom format when 'Others' is selected */}
      {tournamentFormat === 'Others' && (
        <div className="mb-2">
          <label htmlFor="customFormat">Custom Format</label>
          <input
            type="text"
            id="customFormat"
            placeholder="Enter Custom Format"
            className="form-control"
            value={customFormat}
            onChange={handleCustomFormatChange}
          />
        </div>
      )}

            {/* <div className="mb-2">
        <label htmlFor="tournamentFormat">Format</label>
        <select
          id="tournamentFormat"
          className="form-control"
          value={tournamentFormat}
          onChange={(e) => {
            settournamentFormat(e.target.value);
          }}
        >
          <option value="" disabled>
            Select Format
          </option>
          <option value="Single Elimination">Single Elimination</option>
          <option value="Double Elimination">Double Elimination</option>
          <option value="Others">Others...</option>
        </select>
      </div> */}

            <div className="mb-2">
              <label htmlFor="tournamentVenue">Venue</label>
              <input
                type="text"
                id="tournamentVenue"
                placeholder="Enter Venue"
                className="form-control"
                onChange={(e) => settournamentVenue(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="tournamentDetails">Details</label>
              <input
                type="text"
                id="tournamentDetails"
                placeholder="Enter Details"
                className="form-control"
                onChange={(e) => settournamentDetails(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="settournamentStartDate">Start Date</label>
              <input
                type="date"
                id="settournamentStartDate"
                className="form-control"
                value={tournamentStartDate}
                onChange={(e) => settournamentStartDate(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="settournamentEndDate">End Date</label>
              <input
                type="date"
                id="settournamentEndDate"
                className="form-control"
                onChange={(e) => settournamentEndDate(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="tournamentNumberofplayers">Number of players</label>
              <input
                type="number" // Use type="number" for numeric input
                id="tournamentNumberofplayers"
                placeholder="Enter Number of Players"
                className="form-control"
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (!isNaN(value) && value >= 0) {
                    settournamentNumberofplayers(value);
                  } else {
                    // If the value is not a valid number or is negative, set to 0
                    e.target.value = '0';
                    settournamentNumberofplayers(0);
                  }
                }}
              />
            </div>

             <div className="mb-2">
              <label htmlFor="tournamentNumberofmatches">Number of matches</label>
              <input
                type="number"
                id="tournamentNumberofmatches"
                placeholder=""
                className="form-control"
                value={tournamentNumberofmatches}
                readOnly={tournamentFormat !== 'Others'} // Set readOnly based on the format
                onChange={(e) => {
                  if (tournamentFormat === 'Others') {
                    const value = parseInt(e.target.value, 10);
                    if (!isNaN(value) && value >= 0) {
                      settournamentNumberofmatches(value);
                    } else {
                      // If the value is not a valid number or is negative, set to 0
                      e.target.value = '0';
                      settournamentNumberofmatches(0);
                    }
                  }
                }}
                step="1" // Set step to "1" to allow only integer values
              />
            </div>
            <div className="mb-2">
              <input
                type="hidden"
                id="tournamentStatus"
                value="Open for Application"
                className="form-control"
                onChange={(e) => settournamentStatus(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-success">
              Create
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateTournament;
