import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import axios from "axios";
import NavbarA from "./NavbarA";
import "./RatingAndReview.css";

const RatingAndReview = () => {
  const [value, setValue] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [user, setUser] = useState(null);
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    fetchAllReviews();
  }, []);

  const fetchAllReviews = async () => {
    try {
      const { data, status } = await axios.get(
        "https://tournahub-hlr8.onrender.com/api/reviews/all"
      );
      setAllReviews(data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      const { data } = await axios.get("https://tournahub-hlr8.onrender.com/getCurrentUser");
      setUser(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const addToReviews = async () => {
    const body = {
      text: userInput,
      star: value,
      user: user._id,
    };

    try {
      const { status, data } = await axios.post(
        "https://tournahub-hlr8.onrender.com/api/reviews/create",
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
    try {
      const { status } = await axios.delete(
        `https://tournahub-hlr8.onrender.com/api/reviews/${reviewId}`
      );
      if (status === 200) {
        fetchAllReviews();
        window.alert("Review deleted successfully.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <NavbarA />
      <div className="middle">
        <h2 className="book_now_text">Rate us</h2>
        <h4 className="book_now_text">Tell us about your experience</h4>
        <Box
          sx={{
            "& > legend": { mt: 2 },
          }}
        >
          <div className="text">Ratings:</div>
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

      <h4>Your Review History</h4>
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
              <button onClick={() => handleDeleteReview(review._id)}>
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default RatingAndReview;
