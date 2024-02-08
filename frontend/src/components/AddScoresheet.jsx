import React, { useState } from "react";
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import NavbarSA from "./NavbarSA";


function AddScoresheet() {
    const [scoresheet , setFile] = useState("");
    const navigate = useNavigate()
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("scoresheet", scoresheet)
        const submit = await axios.post('http://localhost:3001/AddScoresheet' , formData, {
            headers: {"Content-Type": "multipart/form-data"}
        })
        .then(result => {console.log(result)
            alert("Scoresheet uploaded successfully")
            navigate('/DashboardSA')
        })
        .catch(err => console.log(err))
    }
    
  return (
    <><NavbarSA />
    <div className="">
      <div className="">
        <form onSubmit={handleSubmit}>
          <h2>Add Scoresheet</h2>
          <div className="mb-3">
                    <label htmlFor="scoresheet">
                        <strong>Scoresheet (PDF)</strong>
                    </label>
                    <input
                        type="file"
                        name="scoresheet"
                        className="form-control rounded-0"
                        onChange={(e) => setFile(e.target.files[0])}
                        accept=".pdf"
                        required
                    />
                </div>
          <button className="btn btn-success">Create</button>
        </form>
      </div>
    </div>
    </>
  );
}

export default AddScoresheet;