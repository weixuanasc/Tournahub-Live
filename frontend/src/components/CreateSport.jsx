import React, { useState } from "react";
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import NavbarSA from "./NavbarSA";


function CreateSport() {

    const [name, setName] = useState()
    const navigate = useNavigate()


    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:3001/CreateSport', {name})
        .then(result => {
          console.log(result)
          alert('Sport created successfully')
          navigate('/DashboardSA')
        })
        .catch(err => console.log(err))
        }
    

  return (
    <><NavbarSA />
    <div className="">
      <div className="">
        <form onSubmit={handleSubmit}>
          <h2>Create Sport</h2>
          <div className="mb-2">
            <label htmlFor="">Name</label>
            <input
              type="text"
              placeholder="Enter Name"
              className="form-control"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <button className="btn btn-success">Create</button>
        </form>
      </div>
    </div>
    </>
  );
}

export default CreateSport;