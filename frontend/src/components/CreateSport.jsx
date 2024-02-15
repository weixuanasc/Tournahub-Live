import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavbarSA from "./NavbarSA";
import bgmImage2 from "./images/details.jpg";

function CreateSport() {
  const [name, setName] = useState();
  const navigate = useNavigate();
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

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("https://api.fyp23s424.com/CreateSport", { name })
      .then((result) => {
        console.log(result);
        alert("Sport created successfully");
        navigate("/DashboardSA");
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <NavbarSA />
      <img
        className="bg"
        src={bgmImage2}
        alt="Background"
        style={{ transform: `translateY(${scrollY * 0.001}px)` }}
      />
      <div className="">
        <div className="">
          <form onSubmit={handleSubmit}>
            <h2>Create Sport</h2>
            <div className="mb-2">
              <label htmlFor="">Name</label>
              <input
                type="text"
                placeholder="Enter Name"
                className="form-control"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <button className="btn btn-success">Create</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateSport;
