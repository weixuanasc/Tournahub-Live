import { useState, useEffect } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

function UploadSponsorIcon(){
    const [urlLink , setUrlLink] = useState();
    const [icon , setIcon] = useState("");;
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("urlLink", urlLink)
        formData.append("icon", icon)
        const submit = await axios.post('http://localhost:3001/upload-sponsor-icon' , formData, {
            headers: {"Content-Type": "multipart/form-data"}
        })
        .then(result => {console.log(result)
            alert("Sponsor Icon uploaded sucessfully")
            navigate('/')
        })
        .catch(err => console.log(err))
    }

    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
        <div className="bg-white p-3 rounded w-25">
            <h2>Upload Sponsor Icon</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="mb-3">
                <label htmlFor="name">
                    <strong>URL Link</strong>    
                </label>
                <input
                    type="text"
                    placeholder="Enter your website URL"
                    autoComplete="off"
                    name="urlLink"
                    className="form-control rounded-0"
                    onChange={(e) => setUrlLink(e.target.value)}
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
                <button type="submit" className="btn btn-success w-100 rounded-0">Register</button>
            </form> 
        </div>
        </div>
    );
}

export default UploadSponsorIcon;