import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Home.css";
import "./LandingOne.css";
import axios from "axios";
import Rating from "@mui/material/Rating";
import Carousel from "react-material-ui-carousel";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import homeImage1 from "./images/homeImage1.jpg";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import GroupIcon from "@mui/icons-material/Group";

export default function LandingOne() {
  const [userCount, setUserCount] = useState(null);
  const [tournamentCount, setTournamentCount] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [sponsorIcons, setSponsorIcons] = useState([]);
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await axios.get(`https://api.fyp23s424.com/count-user`);
        setUserCount(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserCount();
  }, []);

  useEffect(() => {
    // ini untuk gambar 4 sejajar dibawah carousel
    const image = [
      {
        imgurl: "/images/Simple.jpeg",
        h5: "Simple & Intuitive",
        h6: "Register, organize, compete. It's just that simple.",
      },
      {
        imgurl: "/images/Free.jpeg",
        h5: "Free-to-experience",
        h6: "Wide variety of functionalities available for free. No hidden charges.",
      },
      {
        imgurl: "/images/Flexible.jpeg",
        h5: "Flexible & Customizable",
        h6: "Just choose the sport and format you desire.",
      },
    ];
    // const image = [
    //   "/images/Match.jpg",
    //   "/images/Soccer.jpg",
    //   "/images/tennis.jpg",
    //   "/images/BasketBall.jpg"
    // ];
    setImages(image);
  }, []);

  useEffect(() => {
    const fetchTournamentCount = async () => {
      try {
        const response = await axios.get(`https://api.fyp23s424.com/count-tournaments`);
        setTournamentCount(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTournamentCount();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `https://api.fyp23s424.com/api/reviews/fetch-reviews-homepage`
        );
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, []);

  useEffect(() => {
    const fetchSponsorIcons = async () => {
      try {
        const response = await axios.get(`https://api.fyp23s424.com/fetch-sponsor-icons`);
        setSponsorIcons(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching sponsor icons:", error);
      }
    };

    fetchSponsorIcons();
  }, []);

  const handleSignUpClick = () => {
    navigate(`/Signup`);
  };

  const InfoSection = ({ leftImageUrl, rightImageUrl }) => {
    const sectionStyle = {
      display: "flex",
      justifyContent: "space-between",
      gap: "20px",
      margin: "0",
      padding: "0",
      overflow: "hidden",
    };

    const imageContainerStyle = {
      width: "50%",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
    };

    const textStyle = {
      position: "absolute",
      textAlign: "center",
      color: "#fff",
      zIndex: 2,
    };

    const imageStyle = {
      width: "75%",
      height: "auto",
      objectFit: "cover",
      opacity: "0.8",
    };
    return (
      <div style={sectionStyle}>
        <div style={imageContainerStyle}>
          <div style={textStyle}>
            {/* <h2>Promotions & Events</h2>
            <p>Check out umisushi latest promotions and events here!</p> */}
            <div>
              {" "}
              <h5> {userCount} </h5> <h6> Registered Active Users </h6>
            </div>
          </div>
          <img
            src={leftImageUrl}
            alt="Promotions & Events"
            style={imageStyle}
          />
        </div>
        <div style={imageContainerStyle}>
          <div style={textStyle}>
            {/* <h2>Store Locator</h2>
            <p>Visit your nearest outlet today!</p> */}
            <div>
              {" "}
              <h5> {tournamentCount}</h5> <h6> Tournaments Organised </h6>
            </div>
          </div>
          <img src={rightImageUrl} alt="Store Locator" style={imageStyle} />
        </div>
      </div>
    );
  };

  const settings = {
    lazyLoad: true,
    // dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const handleImageError = (event) => {
    console.error("Error loading image:", event.target.src);
  };

  return (
    <div>
      <div className="overlay-content">
        <div className="text-container">
          <h1 className="slide-in-left">Tournahub</h1>
          <h3 className="slide-in-right">Game On, Connect Strong</h3>
        </div>
      </div>
      <img className="first" src={homeImage1} alt="Background" />
      <div className="bgColour">
        <h2>Why choose us?</h2>
        <i>
          <h4>
            Simplicity meets intuitivity. Take the stress out of tournament
            management
          </h4>
        </i>

        <div className="flex-container">
          <div style={{ width: "100vw" }}>
            <Carousel {...settings}>
              {images.map((img, index) => (
                <div key={index}>
                  <img
                    width={"1000px"}
                    height={"460px"}
                    src={img.imgurl}
                    alt={img.imgurl}
                    onError={handleImageError}
                  />
                  <div className="carousel-text">
                    <h5>{img.h5}</h5>
                    <h6>{img.h6}</h6>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </div>

      <div className="coloredbg">
        {/* <h3>To date we have:</h3> */}
        <div className="flex-container animation-container">
          <div>
            <GroupIcon style={{ fontSize: 50 }} />
            <h1> {userCount} </h1> <h4> Registered Active Users </h4>
          </div>
          {/* <div className="vertical-line"></div> */}
          <div>
            <EmojiEventsIcon style={{ fontSize: 50 }} />
            <h1> {tournamentCount}</h1> <h4> Tournaments Organised </h4>
          </div>
        </div>
      </div>
      <br />
      <br />
      <h2>Reviews</h2>
      <div className="flex-container animation-container">
        {reviews.slice(0, 3).map((review, index) => (
          <div className="border-orange" key={index}>
            <h6>{`Testimonial ${index + 1}`}</h6>
            <h6>
              <Rating name="simple-controlled" value={review.star} readOnly />
            </h6>
            <h6>{review.text}</h6>
          </div>
        ))}
      </div>
      <br />
      <br />
      <h3>Our Sponsors</h3>
      <div className="flex-container animation-container">
        {sponsorIcons.slice(0, 3).map((sponsorIcon, index) => (
          <div key={index}>
            <img
              width={"150px"}
              src={`https://api.fyp23s424.com/sponsoricon/${sponsorIcon.icon}`}
              alt={sponsorIcons.icon}
              onClick={() => window.open(sponsorIcon.urlLink)}
              onError={(e) => {
                // Handle image load error & display error image
                console.error("Error loading image:", e);
                e.target.src = "https://i.imgur.com/7qHPfQf.png";
              }}
            />
          </div>
        ))}
      </div>

      <br />

      <div
        className="bgColour"
        style={{
          backgroundColor: "#03396c",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <h2>Don't have an account yet? Sign up now!</h2>
        <p>Receive the latest updates on our tournament !</p>
        <button
          onClick={handleSignUpClick} // Attach the event handler to the onClick event
          style={{
            backgroundColor: "#6497b1",
            color: "white",
            border: "none",
            padding: "10px 20px",
            fontSize: "1em",
            cursor: "pointer",
          }}
        >
          Sign Up
        </button>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>TournaHub</h3>
            <div className="footer-links">
              <Link to="/AboutUs">About Us</Link>
              <Link to="/ContactUs">Contact Us</Link>
            </div>
          </div>
          <div className="footer-social">
            <h3>Social Media</h3>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FacebookIcon />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <InstagramIcon />
            </a>
          </div>
          <div className="footer-links"></div>
        </div>
      </footer>
    </div>
  );
}
