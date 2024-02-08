import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import NavbarTO from "./NavbarTO";

function CreateRankingTable() {
  const { tournamentId } = useParams();
  const [Winner, setWinner] = useState('');
  const [RunnerUp, setRunnerUp] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:3001/CreateRankingTable', { tournamentId, Winner, RunnerUp })
      .then((result) => {
        console.log(result);
        alert('Ranking Table created successfully');
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
            <h2>Create Ranking Table</h2>
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
              <label htmlFor="Winner">Winner</label>
              <input
                type="text"
                id="Winner"
                placeholder="Winner of Tournament"
                className="form-control"
                onChange={(e) => setWinner(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="RunnerUp">Runner-Up</label>
              <input
                type="text"
                id="RunnerUp"
                placeholder="Runner-Up"
                className="form-control"
                onChange={(e) => setRunnerUp(e.target.value)}
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

export default CreateRankingTable;
