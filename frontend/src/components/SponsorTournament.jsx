import { useState, useEffect } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

function SponsorTournament(){
    const [Id , setId] = useState();
    const [tournamentSponsor , setTournamentSponsor] = useState();
    const [icon , setIcon] = useState("");;
    const [tournament, setTournamentData] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchTournaments = async () => {
          try {
            const response = await axios.get("http://localhost:3001/getSponsorableTournaments");
            setTournamentData(response.data);
            console.log(response.data);
          } catch (error) {
            console.log(error);
          }
        };
    
        fetchTournaments();
      }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("id", Id)
        formData.append("tournamentSponsor", tournamentSponsor)
        formData.append("icon", icon)
        const submit = await axios.post('http://localhost:3001/sponsorTournament' , formData, {
            headers: {"Content-Type": "multipart/form-data"}
        })
        .then(result => {console.log(result)
            alert("Sponsored Tournament sucessfully")
            navigate('/ViewTournament')
        })
        .catch(err => console.log(err))
    }

    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
        <div className="bg-white p-3 rounded w-25">
            <h2>Sponsor Tournament</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="mb-3">
                <label htmlFor="Id">
                <strong>Tournament Name</strong>
                </label>
                <select
                type="select"
                name="Id"
                className="form-control rounded-0"
                value={Id}
                onChange={(e) => setId(e.target.value)}
                >
                {tournament.map((tournaments) => (
                    <option key={tournaments.tournamentName} value={tournaments._id}>
                    {tournaments.tournamentName}
                    </option>
                ))}
                </select>
            </div>
            <div className="mb-3">
                <label htmlFor="tournamentSponsor">
                    <strong>Sponsor Name</strong>    
                </label>
                <input
                    type="text"
                    placeholder="Enter your Sponsor title"
                    autoComplete="off"
                    name="tournamentSponsor"
                    className="form-control rounded-0"
                    onChange={(e) => setTournamentSponsor(e.target.value)}
                    required             
                />
            </div>
            <div className="mb-3">
                    <label htmlFor="icon">
                        <strong>Icon (Image)</strong>
                    </label>
                    <input
                        type="file"
                        name="icon"
                        className="form-control rounded-0"
                        onChange={(e) => setIcon(e.target.files[0])}
                        accept=".jpeg, .png, .jpg"
                        required
                    />
            </div>
                <button type="submit" className="btn btn-success w-100 rounded-0">Sponsor</button>
            </form> 
        </div>
        </div>
    );
}

export default SponsorTournament;