import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [gender, setGender] = useState("male");
  const [dob, setDOB] = useState();
  const [usertype, setUserType] = useState("user");
  const [verification, setFile] = useState("");
  const [skillLevel, setSkillLevel] = useState("beginner");
  const [sports, setSports] = useState([]);
  const [interestedSport, setInterestedSport] = useState("Badminton");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("gender", gender);
    formData.append("dob", dob);
    formData.append("usertype", usertype);
    formData.append("interestedSport", interestedSport);
    formData.append("verification", verification);
    formData.append("skillLevel", skillLevel);
    const submit = await axios
      .post("http://localhost:3001/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((result) => {
        console.log(result);
        alert("User created sucessfully");
        navigate("/login");
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await axios.get("http://localhost:3001/ManageSports");
        setSports(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSports();
  }, []);

  const renderUserField = () => {
    if (usertype === "user") {
      return (
        <div>
          <div className="mb-3">
            <label htmlFor="interestedSport">
              <strong>Interested Sport</strong>
            </label>
            <select
              type="select"
              name="selinterestedSportectedSport"
              className="form-control rounded-0"
              value={interestedSport}
              onChange={(e) => setInterestedSport(e.target.value)}
            >
              {sports.map((sport) => (
                <option key={sport.id} value={sport.name}>
                  {sport.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="gender">
              <strong>Gender</strong>
            </label>
            <select
              type="select"
              name="gender"
              className="form-control rounded-0"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="dateOfBirth">
              <strong>Date of Birth</strong>
            </label>
            <input
              type="date"
              name="dob"
              className="form-control rounded-0"
              onChange={(e) => setDOB(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="skillLevel">
              <strong>Skill Level</strong>
            </label>
            <select
              type="select"
              name="skillLevel"
              className="form-control rounded-0"
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value)}
            >
              <option value="Beginner">Beginner</option>
              <option value="Amateur">Amateur</option>
              <option value="Professional">Professional</option>
            </select>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderTOSField = () => {
    if (usertype === "sponsor" || usertype === "tournamentorganizer") {
      return (
        <div>
          <div className="mb-3">
            <label htmlFor="interestedSport">
              <strong>Interested Sport</strong>
            </label>
            <select
              type="select"
              name="selinterestedSportectedSport"
              className="form-control rounded-0"
              value={interestedSport}
              onChange={(e) => setInterestedSport(e.target.value)}
            >
              {sports.map((sport) => (
                <option key={sport.id} value={sport.name}>
                  {sport.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="verification">
              <strong>Verification (PDF)</strong>
            </label>
            <input
              type="file"
              name="verification"
              className="form-control rounded-0"
              onChange={(e) => setFile(e.target.files[0])}
              accept=".pdf"
              required
            />
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Register</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-3">
            <label htmlFor="name">
              <strong>Name</strong>
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              autoComplete="off"
              name="Name"
              className="form-control rounded-0"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              autoComplete="off"
              name="Password"
              className="form-control rounded-0"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="usertype">
              <strong>User Type</strong>
            </label>
            <select
              type="select"
              name="Usertype"
              className="form-control rounded-0"
              value={usertype}
              onChange={(e) => setUserType(e.target.value)}
            >
              <option value="user">User</option>
              <option value="tournamentorganizer">Tournament Organizer</option>
              <option value="sponsor">Sponsor</option>
            </select>
          </div>
          {renderUserField()}
          {renderTOSField()}
          <button type="submit" className="btn btn-success w-100 rounded-0">
            Register
          </button>
        </form>
        <p>Already have an Account?</p>
        <Link
          to="/Login"
          className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none"
        >
          Login
        </Link>
      </div>
    </div>
  );
}

export default Signup;
