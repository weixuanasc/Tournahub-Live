import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import NavbarTO from "./NavbarTO";

function AddStatistics() {
    const { tournamentId } = useParams();
    const [Participant, setParticipant] = useState('');
    const [Score, setScore] = useState('');
    const [AverageScore, setAverageScore] = useState('');
    const [TotalScore, setTotalScore] = useState('');

    const navigate = useNavigate();
 
    const handleSubmit = (e) => {
      e.preventDefault();
      axios
        .post('http://localhost:3001/CreateStatistics', 
        { tournamentId, Participant, Score, AverageScore, TotalScore })
        .then((result) => {
          console.log(result);
          alert('Statistics created successfully');
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
            <h2>Create Statistics</h2>
            <div className="mb-2">
                <label htmlFor="tournamentId">Tournament ID</label>
                <input
                  type="text"
                  id="tournamentId"
                  value={tournamentId}
                  className="form-control"
                  readOnly
                />
              </div>
              <div className="mb-2">
                <label htmlFor="Participant">Participant</label>
                <input
                  type="text"
                  id="Participant"
                  placeholder="Enter Participant"
                  className="form-control"
                  onChange={(e) => setParticipant(e.target.value)}
                />
              </div>
              <div className="mb-2">
                <label htmlFor="Score">Score (W/L)</label>
                <input
                  type="text"
                  id="Score"
                  placeholder="Enter Score"
                  className="form-control"
                  onChange={(e) => setScore(e.target.value)}
                />
              </div>
              <div className="mb-2">
                <label htmlFor="AverageScore">Average Score</label>
                <input
                  type="text"
                  id="AverageScore"
                  placeholder="Enter Average Score"
                  className="form-control"
                  onChange={(e) => setAverageScore(e.target.value)}
                />
              </div>
              <div className="mb-2">
                <label htmlFor="TotalScore">Total Score</label>
                <input
                  type="text"
                  id="TotalScore"
                  placeholder="Enter Total Score"
                  className="form-control"
                  onChange={(e) => setTotalScore(e.target.value)}
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
  
  export default AddStatistics;