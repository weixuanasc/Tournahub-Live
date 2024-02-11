import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import NavbarTO from "./NavbarTO";

function AddMatches() {
    const { tournamentId } = useParams();
    const [MatchNumber, setMatchNumber] = useState('');
    const [MatchName, setMatchName] = useState('');
    const [MatchDate, setMatchDate] = useState('');
    const [MatchTime, setMatchTime] = useState('');
    const [Player1, setPlayer1] = useState('');
    const [Player2, setPlayer2] = useState('');
    const [Player1_Score, setPlayer1_Score] = useState('');
    const [Player2_Score, setPlayer2_Score] = useState('');
    const [Winner, setWinner] = useState('');
    const navigate = useNavigate();
 
    const handleSubmit = (e) => {
      e.preventDefault();
      axios
        .post('http://localhost:3001/CreateMatches', 
        { tournamentId, MatchNumber, MatchName, MatchDate, MatchTime, Player1, Player2, Player1_Score, Player2_Score, Winner })
        .then((result) => {
          console.log(result);
          alert('Match created successfully');
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
            <h2>Create Match</h2>
              <div className="mb-2">
                <label htmlFor="tournamentId"></label>
                <input
                  type="text"
                  id="tournamentId"
                  value={tournamentId}
                  className="form-control"
                  hidden
                />
              </div>
              <div className="mb-2">
                <label htmlFor="MatchNumber">Match Number</label>
                <input
                  type="text"
                  id="MatchNumber"
                  placeholder="Enter Match Number"
                  className="form-control"
                  onChange={(e) => setMatchNumber(e.target.value)}
                  required
                />
              </div>
              <div className="mb-2">
                <label htmlFor="MatchName">Match Name</label>
                <input
                  type="text"
                  id="MatchName"
                  placeholder="Enter Match Name"
                  className="form-control"
                  onChange={(e) => setMatchName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-2">
                <label htmlFor="MatchDate">Match Date</label>
                <input
                  type="Date"
                  id="MatchDate"
                  placeholder="Enter Match Date"
                  className="form-control"
                  onChange={(e) => setMatchDate(e.target.value)}
                  required
                />
              </div>
              <div className="mb-2">
                <label htmlFor="MatchTime">Match Time</label>
                <input
                  type="Time"
                  id="MatchTime"
                  placeholder="Enter Match Time"
                  className="form-control"
                  onChange={(e) => setMatchTime(e.target.value)}
                  required
                />
              </div>
              <div className="mb-2">
                <label htmlFor="Player1">Player 1</label>
                <input
                  type="text"
                  id="Player1"
                  placeholder="Player 1 Name"
                  className="form-control"
                  onChange={(e) => setPlayer1(e.target.value)}
                  required
                />
              </div>
              <div className="mb-2">
                <label htmlFor="Player2">Player 2</label>
                <input
                  type="text"
                  id="Player2"
                  placeholder="Player 2 Name"
                  className="form-control"
                  onChange={(e) => setPlayer2(e.target.value)}
                  required
                />
              </div>
              {/* <div className="mb-2">
                <label htmlFor="Player1_Score">Player 1 Score</label>
                <input
                  type="text"
                  id="Player1_Score"
                  placeholder="Player 1 Score"
                  className="form-control"
                  onChange={(e) => setPlayer1_Score(e.target.value)}
                />
              </div>
              <div className="mb-2">
                <label htmlFor="Player2_Score">Player 2 Score</label>
                <input
                  type="text"
                  id="Player2_Score"
                  placeholder="Player 2 Score"
                  className="form-control"
                  onChange={(e) => setPlayer2_Score(e.target.value)}
                />
              </div>
              <div className="mb-2">
                <label htmlFor="Winner">Winner</label>
                <input
                  type="text"
                  id="Winner"
                  placeholder="Winner"
                  className="form-control"
                  onChange={(e) => setWinner(e.target.value)}
                />
              </div> */}
              <button type="submit" className="btn btn-success">
                Create
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }
  
  export default AddMatches;