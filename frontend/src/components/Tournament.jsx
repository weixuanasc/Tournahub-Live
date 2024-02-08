import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SearchBar from './SearchBarSA';
import NavbarTO from "./NavbarTO";


function ViewTournament() {
  axios.defaults.withCredentials = true;
  const [user, setUser] = useState(null);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const [statusFilter, setStatusFilter] = useState(''); // State to store selected status filter
  
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
  const handleNavigateToAddStatistics = (tournamentId) => {
    navigate(`/AddStatistics/${tournamentId}`);
  };
  const handleNavigateToUpdateStatistics = (tournamentId) => {
    navigate(`/UpdateStatistics/${tournamentId}`);
  };      
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
    
    return (
      <div> 
      <NavbarTO />    
      {/* Button to navigate to the form page */}
      <h1>Manage Tournaments:</h1>
      <SearchBar onSearch={handleSearch} />
      <p></p>
      <label htmlFor="statusFilter">Filter by Status: </label>
      <select id="statusFilter" value={statusFilter} onChange={handleStatusFilterChange}>
      <option value="">All</option>
      <option value="Open for Application">Open for Application</option>
      <option value="Closed Application">Closed Application</option>
      <option value="Ongoing">Ongoing</option>
      <option value="Completed">Completed</option>
      <option value="Cancelled">Cancelled</option>
      </select>
      <p></p>
      <button
      onClick={handleNavigateToCreateTournament}
      className="btn btn-primary mt-3"
      >
      Create Tournament
      </button>
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
              <th>Actions</th>
              <th>Tournament Status</th>
              <th>Applications</th>
              <th>Send Invite</th>
              </tr>
              </thead>
              <tbody>
              {(searchTerm.trim() === '' ? tournaments : filteredTournaments)
              .filter(tournament => !statusFilter || tournament.tournamentStatus === statusFilter) // Apply status filter
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
                <td style={{ padding: '10px' }}>
                <button
                onClick={() => handleNavigateToViewTournamentDeatils(tournament._id)}
                className="btn btn-sm btn-info mr-2"
                >
                View
                </button>
                <button
                onClick={() => handleNavigateToUpdateTournament(tournament._id)}
                className="btn btn-sm btn-warning mr-2"
                >
                Edit Tournament
                </button>
                <button
                onClick={() => handleNavigateToAddMatches(tournament._id)}
                className="btn btn-sm btn-success mr-2"
                >
                Add Matches
                </button>
                <button
                onClick={() =>  handleNavigateToUpdateMatches(tournament._id)}
                className="btn btn-sm btn-warning mr-2"
                >
                Edit Matches
                </button>
                <button
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
                </button>
                <button
                onClick={() => handleNavigateToCreateRankingTable(tournament._id)}
                className="btn btn-sm btn-primary mr-2"
                >
                Add Ranking Table
                </button>
                <button
                onClick={() => handleDelete(tournament._id)}
                className="btn btn-sm btn-danger"
                >
                Delete
                </button>
                </td>
                <td style={{ padding: '10px' }}>{tournament.tournamentStatus}</td>
                <td style={{ padding: '10px' }}>
                <button onClick={() => handleNavigateViewApplicants(tournament._id)}
                className="btn btn-sm btn-info"
                >
                View
                </button>
                </td>
                <td style={{ padding: '10px' }}>
                <button onClick={() => handleNavigateInvitationPage(tournament._id)}
                className="btn btn-sm btn-info"
                >
                Invite
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
              export default ViewTournament;
              