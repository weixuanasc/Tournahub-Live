import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import axios from "axios";
import NavbarA from "./NavbarA";
import "./RatingAndReview.css";
import DeleteIcon from "@mui/icons-material/Delete";
import ReviewsIcon from "@mui/icons-material/Reviews";
import bgmImage4 from "../images/details3.jpg";

const RatingAndReview = () => {
  const [value, setValue] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [user, setUser] = useState(null);
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);
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
    fetchData();
    fetchAllReviews();
  }, []);

  const fetchAllReviews = async () => {
    try {
      const { data, status } = await axios.get(
        "https://api.fyp23s424.com/api/reviews/all"
      );
      setAllReviews(data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      const { data } = await axios.get("https://api.fyp23s424.com/getCurrentUser");
      setUser(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const addToReviews = async () => {
    if (!userInput.trim()) {
      window.alert("Please write your review before submitting.");
      return;
    }
    const body = {
      text: userInput,
      star: value,
      user: user._id,
    };

    try {
      const { status, data } = await axios.post(
        "https://api.fyp23s424.com/api/reviews/create",
        body
      );
      if (status === 200) {
        fetchAllReviews();
        setUserInput("");
        setValue(0);
        window.alert("Review submitted successfully. Thank you!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (isConfirmed) {
      try {
        const { status } = await axios.delete(
          `https://api.fyp23s424.com/api/reviews/${reviewId}`
        );
        if (status === 200) {
          fetchAllReviews();
          window.alert("Review deleted successfully.");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <NavbarA />
      <img
        className="bg2"
        src={bgmImage4}
        alt="Background"
        style={{ transform: `translateY(${scrollY * 0.001}px)` }}
      />
      <div className="middle">
        <h2 className="book_now_text">
          <br />
          <ReviewsIcon style={{ marginRight: "10px", fontSize: 45 }} />
          Rate us
        </h2>
        <br />
        <h5 className="book_now_text">We would like to hear from you! </h5>
        <h5>Tell us about your experience</h5>
        <Box
          sx={{
            "& > legend": { mt: 2 },
          }}
        >
          <div className="text">
            <h3>Ratings:</h3>
          </div>
          <Rating
            name="simple-controlled"
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          />
        </Box>
        <textarea
          className="topReviewBox"
          placeholder="Describe your experience"
          onChange={(e) => setUserInput(e.target.value)}
          value={userInput}
        />
        <button className="mainBtns" onClick={addToReviews}>
          Submit
        </button>
      </div>
      <br />
      <h4>Your Review History</h4>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="reviewBox">
          {allReviews.map((review) => (
            <div className="usernameSize" key={review._id}>
              <h4>{review.user?.name}</h4>
              <Rating
                className="star"
                name="simple-controlled"
                value={review.star}
                readOnly
              />
              <p>{review.text}</p>
              {user?._id === review.user?._id && (
                <button
                  className="btn btn-sm btn-danger mr-2"
                  onClick={() => handleDeleteReview(review._id)}
                >
                  {" "}
                  <DeleteIcon />
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};
export default RatingAndReview;
