import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SearchBar from './SearchBarSA';
import NavbarTO from "./NavbarTO";
import "./Tournament.css";


function ViewTournament() {
  axios.defaults.withCredentials = true;
  const [user, setUser] = useState(null);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const [statusFilter, setStatusFilter] = useState(''); // State to store selected status filter
  const [sportFilter, setSportFilter] = useState(''); // State to store selected sport filter
  const [sportsList, setSportsList] = useState([]);
  
  const navigate = useNavigate();
  const handleNavigateToViewTournamentDeatils = (tournamentId) => {
    navigate(`/ViewTournamentDetails/${tournamentId}`);
  };
  const handleNavigateToCreateTournament = () => {
    navigate('/CreateTournament');
  };
  const handleNavigateToAddMatches = (tournamentId) => {
    navigate(`/AddMatches/${tournamentId}`);
  };
  const handleNavigateToUpdateMatches = (tournamentId) => {
    navigate(`/UpdateMatches/${tournamentId}`);
  };
  // const handleNavigateToAddStatistics = (tournamentId) => {
  //   navigate(`/AddStatistics/${tournamentId}`);
  // };
  // const handleNavigateToUpdateStatistics = (tournamentId) => {
  //   navigate(`/UpdateStatistics/${tournamentId}`);
  // };      
  const handleNavigateToCreateRankingTable = (tournamentId) => {
    navigate(`/CreateRankingTable/${tournamentId}`);
  };
  const handleNavigateToUpdateTournament = (tournamentId) => {
    navigate(`/UpdateTournament/${tournamentId}`);
  };
  const handleNavigateViewApplicants = (tournamentId) => {
    navigate(`/ViewApplicants/${tournamentId}`);
  };
  const handleNavigateInvitationPage = (tournamentId) => {
    navigate(`/InvitationPage/${tournamentId}`);
  };
  const handleNavigateToScheduleGuide = (tournamentId) => {
    navigate(`/ScheduleGuide/${tournamentId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
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
    
    // useEffect(() => {
    //   // Fetch tournaments when the component mounts
    //     axios.get(`http://localhost:3001/getTournaments`)
    //       .then((response) => {
    //         setTournaments(response.data);
    //       })
    //       .catch((error) => {
    //         console.error('Error fetching tournaments:', error);
    //       })
    //       .finally(() => {
    //         setLoading(false);
    //       });
    //   }, []);
    
    useEffect(() => {
      const fetchData = async () => {
        try {
          if (user) {
            const response = await axios.get(`http://localhost:3001/getTournaments/${user._id}?sortBy=tournamentStartDate`);
            // Parse dates if needed
            const tournamentsWithParsedDates = response.data.map(tournament => ({
              ...tournament,
              tournamentStartDate: new Date(tournament.tournamentStartDate)
            }));
            // Sort the tournaments by start date
            tournamentsWithParsedDates.sort((a, b) => new Date(a.tournamentStartDate) - new Date(b.tournamentStartDate));
            setTournaments(tournamentsWithParsedDates);
          }
        } catch (error) {
          console.error('Error fetching tournaments:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
    }, [user]);
    
    const handleStatusFilterChange = (event) => {
      setStatusFilter(event.target.value);
    };
    
    const handleSportFilterChange = (event) => {
      setSportFilter(event.target.value);
    };
    
    const handleDelete = async (id) => {
      if (window.confirm('Confirm deletion?')) {
        try {
          await axios.delete(`http://localhost:3001/deleteTournament/${id}`);
          // Update the local state by filtering out the deleted tournament
          setTournaments((prevTournaments) => prevTournaments.filter(tournament => tournament._id !== id));
        } catch (error) {
          console.log(error);
        }
      }
    };
    
    const handleSearch = async (searchTerm) => {
      setSearchTerm(searchTerm);
      
      if (searchTerm.trim() === '') {
        setFilteredTournaments([]);
      } else {
        try {
          const response = await axios.get(`http://localhost:3001/searchTournaments/${searchTerm}/${user._id}`);
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
      .get('http://localhost:3001/getSports')
      .then((response) => {
        setSportsList(response.data);
      })
      .catch((err) => console.log(err));
    }, []); // Run only once when the component mounts
    
    return (
      <div> 
      <NavbarTO />    
      <div className="create-tournament-container">
      <button
      onClick={handleNavigateToCreateTournament}
      className="btn btn-primary create-tournament-btn"
      >
      Create Tournament
      </button>
      </div>
      
      {/* Button to navigate to the form page */}
      <h1>Manage My Tournaments</h1>
      
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
                
                </thead>
                <tbody>
                {(searchTerm.trim() === '' ? tournaments : filteredTournaments)
                .filter(tournament => (!statusFilter || tournament.tournamentStatus === statusFilter) && (!sportFilter || tournament.tournamentSport === sportFilter))
                .map(tournament => (
                  <tr key={tournament._id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td className="tournament-box">
                  <div>
                  <p><strong>Tournament Name:</strong> {tournament.tournamentName}</p>
                  <p><strong>Sport:</strong> {tournament.tournamentSport}</p>
                  <p><strong>Format:</strong> {tournament.tournamentFormat}</p>
                  <p><strong>Number of Matches:</strong> {tournament.tournamentNumberofmatches}</p>
                  <p><strong>Date:</strong> {formatDate(tournament.tournamentStartDate)} - {formatDate(tournament.tournamentEndDate)}</p>
                  <p><strong>Tournament Status:</strong> {tournament.tournamentStatus}</p>
                  </div>
                  <div className="action-buttons">
                  <button onClick={() => handleNavigateToViewTournamentDeatils(tournament._id)} className="btn btn-sm btn-info mr-2">View</button>
                  <button onClick={() => handleNavigateToUpdateTournament(tournament._id)} className="btn btn-sm btn-warning mr-2">Edit Tournament</button>
                  <button onClick={() => handleNavigateToAddMatches(tournament._id)} className="btn btn-sm btn-success mr-2">Add Matches</button>
                  <button onClick={() => handleNavigateToUpdateMatches(tournament._id)} className="btn btn-sm btn-warning mr-2">Edit Matches</button>
                  <button onClick={() => handleNavigateToCreateRankingTable(tournament._id)} className="btn btn-sm btn-primary mr-2">Add Ranking Table</button>
                  <button onClick={() => handleDelete(tournament._id)} className="btn btn-sm btn-danger">Delete</button>
                  </div>
                  
                  <div className="additional-buttons">
                  <button onClick={() => handleNavigateViewApplicants(tournament._id)} className="btn btn-sm btn-info">View Applicants</button>
                  <button onClick={() => handleNavigateInvitationPage(tournament._id)} className="btn btn-sm btn-info">Send Invite</button>
                  <button onClick={() => handleNavigateToScheduleGuide(tournament._id)} className="btn btn-sm btn-success mr-2">Schedule Guide</button>
                  </div>
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
                export default ViewTournament;
                
                
                
                {/* <button
                onClick={() =>  handleNavigateToAddStatistics(tournament._id)}
                className="btn btn-sm btn-success mr-2"
                >
                Add Statistics
                </button>
                <button
                onClick={() =>  handleNavigateToUpdateStatistics(tournament._id)}
                className="btn btn-sm btn-warning mr-2"
                >
                Edit Statistics
              </button> */}
              