import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavbarS from "./NavbarS";
import DisplayAllNews from "./Applicant/DisplayAllNews";

function DashboardS() {
  const [verify, setVerify] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios
      .get("https://api.fyp23s424.com/DashboardS")
      .then((res) => {
        if (res.data === "Login is successful") {
          // Set and store verify in localStorage
          setVerify("Welcome! You are logged in as a Sponsor");
          localStorage.setItem(
            "verify",
            "Welcome! You are logged in as a Sponsor"
          );
        } else {
          // navigate back to homepage
          navigate("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if user data is stored in localStorage
        const storedUser = localStorage.getItem("userS");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          // If not, fetch user data from the server
          const response = await axios.get(
            "https://api.fyp23s424.com/getCurrentUser"
          );
          setUser(response.data);
          // Store user data in localStorage
          localStorage.setItem("user", JSON.stringify(response.data));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <NavbarS />
      {/* <p>Dashboard: Sponsor</p>
      <p>{verify}</p> */}
      {user && (
        <div className="sporty">
          {/* <p>User ID: {user._id}</p>
          <p>Email: {user.email}</p> */}
          <br />
          <h2>Welcome Back {user.name}!</h2>
          <br />
        </div>
      )}
      <DisplayAllNews />
    </div>
  );
}

export default DashboardS;
