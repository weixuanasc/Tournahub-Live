import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SelectNavbar from "./SelectNavbar";
import SearchBar from './SearchBarSA';
import "./Tournament.css";


function ViewTournament() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [sportFilter, setSportFilter] = useState(''); // State to store selected sport filter
  const [sportsList, setSportsList] = useState([]);
  const navigate = useNavigate();
  const handleNavigateToViewTournamentDeatils = (tournamentId) => {
    navigate(`/ViewTournamentDetails/${tournamentId}`);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
  useEffect(() => {
    // Fetch tournaments when the component mounts
    axios.get('https://api.fyp23s424.com/getTournamentsNonTO')
    .then((response) => {
      setTournaments(response.data);
    })
    .catch((error) => {
      console.error('Error fetching tournaments:', error);
    })
    .finally(() => {
      setLoading(false); // Set loading to false whether the request is successful or not
    });
  }, []);
  
  const handleViewDetails = (tournamentId) => {
    // Navigate to a details page or perform some action with the tournamentId
    console.log(`View details for tournament with ID: ${tournamentId}`);
  };
  
  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };
  const handleSportFilterChange = (event) => {
    setSportFilter(event.target.value);
  };
  
  const handleSearch = async (searchTerm) => {
    setSearchTerm(searchTerm);
    
    if (searchTerm.trim() === '') {
      setFilteredTournaments([]);
    } else {
      try {
        const response = await axios.get(`https://api.fyp23s424.com/searchTournamentsNonTO/${searchTerm}/`);
        console.log(response.data);
        setFilteredTournaments(response.data)
      } catch (error) {
        console.log(error);
      }
    }
  };
  
  useEffect(() => {
    // Fetch the list of sports from the database
    axios
    .get('https://api.fyp23s424.com/getSports')
    .then((response) => {
      setSportsList(response.data);
    })
    .catch((err) => console.log(err));
  }, []); // Run only once when the component mounts
  
  
  return (
    <div> 
    {SelectNavbar()}
    <h1>Tournament List:</h1>
    <div className="search-filters-container">
      <div className="filters-container">
      <div className="filter-container">
      <label htmlFor="statusFilter">Filter by Status </label>
      <select id="statusFilter" value={statusFilter} onChange={handleStatusFilterChange} className="filter-select">
      <option value="">All</option>
      <option value="Open for Application">Open for Application</option>
      <option value="Closed Application">Closed Application</option>
      <option value="Ongoing">Ongoing</option>
      <option value="Completed">Completed</option>
      <option value="Cancelled">Cancelled</option>
      </select>
      </div>
      <div className="filter-container">
      <label htmlFor="sportFilter">Filter by Sport </label>
      <select id="sportFilter" value={sportFilter} onChange={handleSportFilterChange} className="filter-select">
      <option value="">All</option>
      {sportsList.map((sport) => (
        <option key={sport._id} value={sport.name}>
        {sport.name}
        </option>
        ))}
        </select>
        </div>
        </div>
        <div className="search-bar-container">
        <SearchBar onSearch={handleSearch} />
        </div>
        </div>
        {/* Add other sports options as needed */}
      <p></p>
      {loading ? (
        <p>Loading tournaments...</p>
        ) : (
          <>
          {((searchTerm.trim() === '' ? tournaments : filteredTournaments)
          .filter(tournament => !statusFilter || tournament.tournamentStatus === statusFilter)).length === 0 ? (
            <p>There are no tournaments here</p>
            ) : (
              <table style={{ margin: 'auto', textAlign: 'left', borderCollapse: 'collapse', width: '70%' }}>
              <thead>
              <tr>
              <th>Tournament Name</th>
              <th>Sport</th>
              <th>Format</th>
              <th>Number of Matches</th>
              <th>Date</th>             
              <th>Tournament Status</th>
              <th>Details</th>
              </tr>
              </thead>
              <tbody>
              {(searchTerm.trim() === '' ? tournaments : filteredTournaments)
              .filter(tournament => (!statusFilter || tournament.tournamentStatus === statusFilter) && (!sportFilter || tournament.tournamentSport === sportFilter))
              .map(tournament => (
                <tr key={tournament._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>{tournament.tournamentName}</td>
                <td style={{ padding: '10px' }}>{tournament.tournamentSport}</td>
                <td style={{ padding: '10px' }}>{tournament.tournamentFormat}</td>
                <td style={{ padding: '10px' }}>{tournament.tournamentNumberofmatches}</td>
                <td style={{ padding: "10px" }}>
                {formatDate(tournament.tournamentStartDate)} -{" "}
                {formatDate(tournament.tournamentEndDate)}
                </td>                                           
                <td style={{ padding: '10px' }}>{tournament.tournamentStatus}</td>
                <td style={{ padding: '10px' }}>
                <button
                onClick={() => handleNavigateToViewTournamentDeatils(tournament._id)}
                className="btn btn-sm btn-info mr-2"
                >
                View
                </button>
                </td>
                </tr>
                ))}
                </tbody>
                </table>
                )}
                </>
                )}
                </div>
                );
              }
              export default ViewTournament
              