import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavbarSA from "./NavbarSA";
import SearchBar from "./SearchBarSA";
import "./tableContainer.css";
import bgmImage from "./images/background_application.jpg";

function ManageUsers() {
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
        const response = await axios.get("https://api.fyp23s424.com/ManageUsers");
        setUsers(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = async (searchTerm) => {
    setSearchTerm(searchTerm);

    if (searchTerm.trim() === "") {
      // If the search term is empty, show all users
      setFilteredUsers([]);
    } else {
      // Otherwise, filter users based on the search term
      try {
        const response = await axios.get(
          `https://api.fyp23s424.com/searchUsers/${searchTerm}`
        );
        setFilteredUsers(response.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSuspend = async (id) => {
    if (window.confirm("Confirm suspension?")) {
      try {
        await axios.put(`https://api.fyp23s424.com/suspendUser/${id}`);
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <div>
        <NavbarSA />
        <img
          className="bg"
          src={bgmImage}
          alt="Background"
          style={{ transform: `translateY(${scrollY * 0.001}px)` }}
        />
      </div>
      <div className="">
        <div className="">
          <h2>Manage Users</h2>
          <SearchBar onSearch={handleSearch} />
          <table className="table">
            <thead>
              <tr>
                <th style={{ background: "orange" }}>Name</th>
                <th style={{ background: "orange" }}>Email</th>
                {/* <th>Password</th> */}
                <th style={{ background: "orange" }}>User Type</th>
                <th style={{ background: "orange" }}>isActive</th>
                <th style={{ background: "orange" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {searchTerm.trim() === ""
                ? users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      {/* <td>{user.password}</td> */}
                      <td>{user.usertype}</td>
                      <td>{user.isActive}</td>
                      <td>
                        <Link
                          to={`/UpdateUsers/${user._id}`}
                          className="btn btn-success"
                        >
                          Update
                        </Link>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleSuspend(user._id)}
                        >
                          Suspend
                        </button>
                      </td>
                    </tr>
                  ))
                : filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      {/* <td>{user.password}</td> */}
                      <td>{user.usertype}</td>
                      <td>{user.isActive}</td>
                      <td>
                        <Link
                          to={`/UpdateUsers/${user._id}`}
                          className="btn btn-success"
                        >
                          Update
                        </Link>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleSuspend(user._id)}
                        >
                          Suspend
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

export default ManageUsers;
