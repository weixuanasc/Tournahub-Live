import axios from 'axios'
import React, {useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";

function UpdateSports() {
    const {id} = useParams()
    const [name, setName] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
      axios.get('http://localhost:3001/getSport/'+id)
      .then(result => {console.log(result)
            setName(result.data.name)
            setFormat(result.data.format)
      })
      .catch(err => console.log(err))
    }, []) 
  
    const Update = (e) => {
      e.preventDefault();
      axios.put('http://localhost:3001/updateSport/'+id, {name})
        .then(result => {
          console.log(result)
          alert('Sport updated successfully')
          navigate('/ManageSports')
        })
        .catch(err => console.log(err))
    }

    return ( 
        <div className="d-flex vh-100 justify-content-center align-items-center">
      <div className="w-50 bg-white rounded p-3">
        <form onSubmit={Update}>
          <h2>Update Sports</h2>
          <div className="mb-2">
            <label htmlFor="">Name</label>
            <input
              type="text"
              placeholder="Enter Name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <button type ="submit" className="btn btn-success">Update</button>
        </form>
      </div>
    </div>
     );
}

export default UpdateSports;