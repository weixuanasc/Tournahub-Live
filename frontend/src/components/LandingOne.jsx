import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import "./Home.css";
import "./LandingOne.css";
import axios from "axios";
import Rating from "@mui/material/Rating";
import Carousel from 'react-material-ui-carousel'
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

export default function LandingOne() {
  const domainName = "https://tournahub-hlr8.onrender.com" 
  const [userCount, setUserCount] = useState(null);
  const [tournamentCount, setTournamentCount] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [sponsorIcons, setSponsorIcons] = useState([]);
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await axios.get(`${domainName}/count-user`);
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
        imgurl:"/images/Simple.jpeg",
        h5:"Simple & Intuitive",
        h6:"Register, organize, compete. It's just that simple."
      },
      {
        imgurl:"/images/Free.jpeg",
        h5:"Free-to-experience",
        h6:"Wide variety of functionalities available for free. No hidden charges."
      },
      {
        imgurl:"/images/Flexible.jpeg",
        h5:"Flexible & Customizable",
        h6:"Just choose the sport and format you desire."
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
        const response = await axios.get(`${domainName}/count-tournaments`);
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
        const response = await axios.get(`${domainName}/api/reviews/fetch-reviews-homepage`);
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    fetchReviews();
  }, []); 

  useEffect(() => {
    const fetchSponsorIcons = async () => {
      try {
        const response = await axios.get(`${domainName}/fetch-sponsor-icons`);
        setSponsorIcons(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching sponsor icons:', error);
      }
    };
  
    fetchSponsorIcons();
  }, []);

  const handleSignUpClick = () => {
    navigate(`/Signup`);
  };

  const InfoSection = ({ leftImageUrl, rightImageUrl }) => {
    const sectionStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '20px',
      margin: '0',
      padding: '0',
      overflow: 'hidden'
    };
  
    const imageContainerStyle = {
      width: '50%',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white'
    };
  
    const textStyle = {
      position: 'absolute',
      textAlign: 'center',
      color: '#fff',
      zIndex: 2
    };
  
    const imageStyle = {
      width: '75%',
      height: 'auto',
      objectFit: 'cover',
      opacity: '0.8'
    };
    return (
      <div style={sectionStyle}>
        <div style={imageContainerStyle}>
          <div style={textStyle}>
            {/* <h2>Promotions & Events</h2>
            <p>Check out umisushi latest promotions and events here!</p> */}
        <div> <h5> {userCount} </h5> <h6> Registered Active Users </h6></div>
          </div>
          <img src={leftImageUrl} alt="Promotions & Events" style={imageStyle} />
        </div>
        <div style={imageContainerStyle}>
          <div style={textStyle}>
            {/* <h2>Store Locator</h2>
            <p>Visit your nearest outlet today!</p> */}
        <div> <h5> {tournamentCount}</h5> <h6> Tournaments Organised </h6></div>
          </div>
          <img src={rightImageUrl} alt="Store Locator" style={imageStyle} />
        </div>
      </div>
    );
  }

  const settings = {
    lazyLoad: true,
    // dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };
  const handleImageError = (event) => {
    console.error('Error loading image:', event.target.src);
  };

  return (
    <div className="landingone-container">
      <div>
        <h1> Tournahub </h1>
        <h3> Game On, Connect Strong</h3>
      </div>
      <div>
        <h4>Why choose us?</h4>
        <i><p> Simplicity meets intuitivity. Take the stress out of tournament management </p></i>
      </div>
      <div className="landingone-div"></div>
      
      <div className="flex-container">
        <div style={{width: '100vw'}}>
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
      <br />

      <h4>To date we have:</h4>
      {/* <div className="flex-container animation-container">
        <div> <h5> {userCount} </h5> <h6> Registered Active Users </h6></div>
        <div> <h5> {tournamentCount}</h5> <h6> Tournaments Organised </h6></div>
      </div> */}
      <br />
          
      <br />

      {/* ini untuk gambar promotion event dan store location */}
      <InfoSection 
        leftImageUrl="/images/TDWH2.jpeg" 
        rightImageUrl="/images/TDWH2.jpeg" 
      />
      <br />
          {/* <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '16px',
            justifyContent: 'center',
            alignItems: 'center',
          }}>

            <div className="img-hover-container">
              <img src="/images/BasketBall.jpg" alt="" className='img-hover' />
              <div className="img-hover-overlay"></div>
            </div>
            <div className="img-hover-container">
              <img src="/images/tennis.jpg" alt="" className='img-hover' />
              <div className="img-hover-overlay"></div>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '16px',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            </div>
            <div className="img-hover-container">
              <img src="/images/Soccer.jpg" alt="" className='img-hover' />
              <div className="img-hover-overlay"></div>
            </div>
            <div className="img-hover-container">
              <img src="/images/Match.jpg" alt="" className='img-hover' />
              <div className="img-hover-overlay"></div>
            </div>
        </div> */}
      <br />

      <h4>Reviews:</h4>
      <div className="flex-container animation-container">
        {reviews.slice(0, 3).map((review, index) => (
          <div key={index}>
            <h6>{`Testimonial ${index + 1}`}</h6>
            <h6><Rating name="simple-controlled" value={review.star} readOnly/></h6>
            <h6>{review.text}</h6>
          </div>
        ))}
        {/* {reviews.length > 0 && (
          (() => {
            const randomIndex = Math.floor(Math.random() * reviews.length);
            const review = reviews[randomIndex];
            return (
              <div key={randomIndex}>
                <h6>{`Testimonial ${randomIndex + 1}`}</h6>
                <h6><Rating name="simple-controlled" value={review.star} readOnly/></h6>
                <h6>{review.text}</h6>
              </div>
            );
          })()
        )} */}
      </div>
      <br />

      <h4>Trusted by our sponsors:</h4>
      <div className="flex-container animation-container">
      {sponsorIcons.slice(0, 3).map((sponsorIcon, index) => (
      <div key={index}>
      <img
          width={"150px"}
          src={`${domainName}/sponsoricon/${sponsorIcon.icon}`}
          alt={sponsorIcons.icon}
          onClick={() => window.open(sponsorIcon.urlLink)}
          onError={(e) => {
            // Handle image load error & display error image
            console.error("Error loading image:", e);
            e.target.src = 'https://i.imgur.com/7qHPfQf.png';
          }}
        />
        </div>
        ))}
      </div>     
    
      <br />

      <div style={{ backgroundColor: '#03396c', padding: '20px', textAlign: 'center' }}>
        <h2>Don't have an account yet? Sign up now!</h2>
        <p>Receive the latest updates on our tournament !</p>
        <button
          onClick={handleSignUpClick} // Attach the event handler to the onClick event
          style={{ backgroundColor: '#6497b1', color: 'white', border: 'none', padding: '10px 20px', fontSize: '1em', cursor: 'pointer' }}
        >
          SIGN UP
        </button>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>TournaHub</h3>
            <div className="footer-links">
              <a href="#">About Us</a>
              <a href="#">Contact</a>
            </div>
          </div>
          <div className="footer-social">
            <h3>Social Media</h3>
            <a href="https://www.TournahubOfficial.com" target="_blank" rel="noopener noreferrer">
              <FacebookIcon />
            </a>
            <a href="https://www.TournahubOfficial.com" target="_blank" rel="noopener noreferrer">
              <InstagramIcon />
            </a>
          </div>
            <div className="footer-links">
              </div>
        </div>
      </footer>
    </div>
    
  );
}

