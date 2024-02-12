import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavbarA from "./NavbarA";
import FaceIcon from "@mui/icons-material/Face";

const UpdateProfile = () => {
  const [user, setUser] = useState(null);
  const [sportsList, setSportsList] = useState([]);
  const { id } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interestedSport, setInterestedSport] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.fyp23s424.com/getCurrentUser"
        );
        setUser(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Fetch the list of sports from the database
    axios
      .get("https://api.fyp23s424.com/getSports")
      .then((response) => {
        setSportsList(response.data);
      })
      .catch((err) => console.log(err));
  }, []); // Run only once when the component mounts

  const Update = (e) => {
    e.preventDefault();
    axios
      .put("https://api.fyp23s424.com/updateProfile/", {
        name,
        email,
        interestedSport,
        skillLevel,
      })
      .then((result) => {
        console.log(result);
        alert("User updated successfully");
        navigate("/home");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <NavbarA />
      <div className="middle">
        <br />
        <div className="userProfile">
          <h2>
            <FaceIcon style={{ marginRight: "10px", fontSize: 45 }} />
            Profile
          </h2>
          {user && (
            <div>
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
              <p>Gender: {user.gender}</p>
              <p>Date of Birth: {user.dob}</p>
              <p>Interested Sport: {user.interestedSport}</p>
              <p>Skill Level: {user.skillLevel}</p>
            </div>
          )}
        </div>
        <form onSubmit={Update}>
          <br />
          <h2>Update Profile</h2>
          <div className="mb-2">
            <label htmlFor="">New Name</label>
            <input
              type="text"
              placeholder="Enter new name"
              className="form-control"
              value={name}
              style={{ width: "100%" }}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="">New Email</label>
            <input
              type="text"
              placeholder="Enter new email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="interestedSport">Intersted Sport</label>
            <select
              id="interestedSport"
              className="form-control"
              value={interestedSport}
              required
              onChange={(e) => setInterestedSport(e.target.value)}
            >
              <option value="" disabled>
                Select interested sport
              </option>
              {sportsList.map((sport) => (
                <option key={sport._id} value={sport.name}>
                  {sport.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label htmlFor="skillLevel">Skill Level</label>
            <select
              id="skillLevel"
              className="form-control"
              value={skillLevel}
              required
              onChange={(e) => setSkillLevel(e.target.value)}
            >
              <option value="" disabled>
                Select skill level
              </option>
              <option value="beginner">Beginner</option>
              <option value="amateur">Amateur</option>
              <option value="professional">Professional</option>
            </select>
          </div>
          <button type="submit" className="btn btn-success">
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
