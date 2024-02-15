import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavbarSA from "./NavbarSA";
import SearchBar from "./SearchBarSA";
import "./tableContainer.css";
import bgmImage from "./images/background_application.jpg";

function ManageSports() {
  const [sports, setSports] = useState([]);
  const [filteredSports, setFilteredSports] = useState([]);
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
    const fetchSports = async () => {
      try {
        const response = await axios.get("https://api.fyp23s424.com/ManageSports");
        setSports(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSports();
  }, []);

  const handleSearch = async (searchTerm) => {
    setSearchTerm(searchTerm);

    if (searchTerm.trim() === "") {
      // If the search term is empty, show all sports
      setFilteredSports([]);
    } else {
      // Otherwise, filter sports based on the search term
      try {
        const response = await axios.get(
          `https://api.fyp23s424.com/searchSports/${searchTerm}`
        );
        setFilteredSports(response.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Confirm deletion?")) {
      try {
        await axios.delete(`https://api.fyp23s424.com/deleteSport/${id}`);
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
          <h2>Manage Sports</h2>
          <SearchBar onSearch={handleSearch} />
          <table className="table">
            <thead>
              <tr>
                <th style={{ background: "orange" }}>Name</th>
                <th style={{ background: "orange" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {searchTerm.trim() === ""
                ? sports.map((sport) => (
                    <tr key={sport._id}>
                      <td>{sport.name}</td>
                      <td>
                        <Link
                          to={`/UpdateSports/${sport._id}`}
                          className="btn btn-success"
                        >
                          Update
                        </Link>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(sport._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                : filteredSports.map((sport) => (
                    <tr key={sport._id}>
                      <td>{sport.name}</td>
                      <td>
                        <Link
                          to={`/UpdateSports/${sport._id}`}
                          className="btn btn-success"
                        >
                          Update
                        </Link>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(sport._id)}
                        >
                          Delete
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

export default ManageSports;
