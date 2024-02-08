import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavbarSA from "./NavbarSA";
import DisplayAllNews from "./Applicant/DisplayAllNews";

function DashboardSA() {
  const [verify, setVerify] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios
      .get("http://localhost:3001/DashboardSA")
      .then((res) => {
        if (res.data === "Login is successful") {
          // Set and store verify in localStorage
          setVerify("Welcome! You are logged in as a System Administrator");
          localStorage.setItem(
            "verify",
            "Welcome! You are logged in as a System Administrator"
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
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          // If not, fetch user data from the server
          const response = await axios.get(
            "http://localhost:3001/getCurrentUser"
          );
          setUser(response.data);
          // Store user data in localStorage
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        // Check if verify is stored in localStorage
        const storedVerify = localStorage.getItem("verify");
        if (storedVerify) {
          setVerify(storedVerify);
        } else {
          // If not, fetch user data from the server
          const verifyResponse = await axios.get(
            "http://localhost:3001/DashboardSA"
          );
          setVerify("Welcome! You are logged in as a System Administrator");
          // Store verify in localStorage
          localStorage.setItem(
            "verify",
            "Welcome! You are logged in as a System Administrator"
          );
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
      <NavbarSA />
      <p>Dashboard: System Administrator</p>
      <p>{verify}</p>
      {user && (
        <div>
          <p>User ID: {user._id}</p>
          <p>Email: {user.email}</p>
        </div>
      )}
      <DisplayAllNews />
    </div>
  );
}

export default DashboardSA;
