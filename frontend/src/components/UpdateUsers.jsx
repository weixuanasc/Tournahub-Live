import axios from 'axios'
import React, {useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";

function UpdateUsers() {
    const {id} = useParams()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [usertype, setUserType] = useState('')
    const [isActive, setIsActive] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
      axios.get('http://localhost:3001/getUser/'+id)
      .then(result => {console.log(result)
            setName(result.data.name)
            setEmail(result.data.email)
            setPassword(result.data.password)
            setUserType(result.data.usertype)
            setIsActive(result.data.isActive)
      })
      .catch(err => console.log(err))
    }, []) 
  
    const Update = (e) => {
      e.preventDefault();
      axios.put('http://localhost:3001/updateUser/'+id, {name, email, password, usertype, isActive})
        .then(result => {
          console.log(result)
          alert('User updated successfully')
          navigate('/ManageUsers')
        })
        .catch(err => console.log(err))
    }

    return ( 
        <div className="d-flex vh-100 justify-content-center align-items-center">
      <div className="w-50 bg-white rounded p-3">
        <form onSubmit={Update}>
          <h2>Update Users</h2>
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
          <div className="mb-2">
            <label htmlFor="">Email</label>
            <input
              type="text"
              placeholder="Enter Email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="">Password</label>
            <input
              type="text"
              placeholder="Enter Password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="">User Type</label>
            <input
              type="text"
              placeholder="Enter User Type"
              className="form-control"
              value={usertype}
              onChange={(e) => setUserType(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="">isActive</label>
            <input
              type="text"
              placeholder="Enter User Status"
              className="form-control"
              value={isActive}
              onChange={(e) => setIsActive(e.target.value)}
            />
          </div>
          <button type ="submit" className="btn btn-success">Update</button>
        </form>
      </div>
    </div>
     );
}

export default UpdateUsers;