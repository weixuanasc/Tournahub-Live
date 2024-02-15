import axios from "axios";
import React, { useEffect, useState } from "react";
import NavbarSA from "./NavbarSA";
import "./tableContainer.css";
import bgmImage2 from "./images/details.jpg";

function VerifyUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [scrollY, setScrollY] = useState(0);
  //scrolling animation
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://api.fyp23s424.com/PendingUsers");
        setUsers(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, []);

  const handleApprove = async (id) => {
    if (window.confirm("Confirm approval?")) {
      try {
        await axios.put(`https://api.fyp23s424.com/approveUser/${id}`);
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const showPDF = (verification) => {
    window.open(
      `https://api.fyp23s424.com/verify/${verification}`,
      "_blank",
      "noreferrer"
    );
  };

  return (
    <>
      <div>
        <NavbarSA />{" "}
        <img
          className="bg"
          src={bgmImage2}
          alt="Background"
          style={{ transform: `translateY(${scrollY * 0.001}px)` }}
        />
      </div>
      <div className="">
        <div className="">
          <h2>Verify Users</h2>
          <table className="table">
            <thead>
              <tr>
                <th style={{ background: "orange" }}>Name</th>
                <th style={{ background: "orange" }}>Email</th>
                <th style={{ background: "orange" }}>User Type</th>
                <th style={{ background: "orange" }}>Verification</th>
                <th style={{ background: "orange" }}>isActive</th>
                <th style={{ background: "orange" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.usertype}</td>
                  <td>{user.verification}</td>
                  <td>{user.isActive}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleApprove(user._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => showPDF(user.verification)}
                    >
                      Show PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default VerifyUsers;
