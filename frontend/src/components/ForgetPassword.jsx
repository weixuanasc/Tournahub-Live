import { useState, useEffect } from "react";
import {Link} from 'react-router-dom';
import axios from 'axios'
import { useNavigate } from "react-router-dom";

function ForgetPassword(){
    const [email , setEmail] = useState();
    const navigate = useNavigate()
    axios.defaults.withCredentials = true;
    const handleSubmit = async (e) => {
        e.preventDefault();
        const submit = await axios.post('http://localhost:3001/forgetPassword' , {email})
        .then(res => {
            if(res.data.Status === "Success") {
                alert("Reset Password Email Sent!")
                navigate('/Login')
            }
        })
        .catch(err => console.log(err))
    }

    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
        <div className="bg-white p-3 rounded w-25">
            <h2>Forget Password</h2>
            <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="email">
                    <strong>Email</strong>
                </label>
                <input
                    type="text"
                    placeholder="Enter your email"
                    autoComplete="off"
                    name="Email"
                    className="form-control rounded-0"
                    onChange={(e) => setEmail(e.target.value)}
                    required             
                />
            </div>
            <button type="submit" className="btn btn-success w-100 rounded-0">Submit</button>
            </form> 
        </div>
        </div>
    );  
}

export default ForgetPassword;