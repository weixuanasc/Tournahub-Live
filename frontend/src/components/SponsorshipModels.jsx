import React, { useState, useEffect } from "react";
import axios from "axios";
import NavbarS from "./NavbarS";
import { loadStripe } from "@stripe/stripe-js";

 // Replace with actual Stripe publishable key
const stripePromise = loadStripe("pk_test_51OZDZ5GNBcwxwaFCTi4kYxQqVaQsTqdeNA0I7cW8bm3CMJoXTKwr4wEuWaljsv1mxUxvPbLu6GXec9YjiZ6fIm3I00LDt1cOVq");

function SponsorshipModels() {
  const handleCheckoutIcon = async () => {
    try {
      const response = await axios.post("http://localhost:3001/create-checkout-session-icon");

      const stripe = await stripePromise;
      const result = await stripe.redirectToCheckout({
        sessionId: response.data.sessionId,
      });

      if (result.error) {
        console.error("Error redirecting to checkout:", result.error);
      }
    } catch (error) {
      console.error("Error during checkout:", error.message);
    }
  };

  const handleCheckoutTournament = async () => {
    try {
      const response = await axios.post("http://localhost:3001/create-checkout-session-tournament");

      const stripe = await stripePromise;
      const result = await stripe.redirectToCheckout({
        sessionId: response.data.sessionId,
      });

      if (result.error) {
        console.error("Error redirecting to checkout:", result.error);
      }
    } catch (error) {
      console.error("Error during checkout:", error.message);
    }
  };

  const handleCheckoutArticle = async () => {
    try {
      const response = await axios.post("http://localhost:3001/create-checkout-session-article");

      const stripe = await stripePromise;
      const result = await stripe.redirectToCheckout({
        sessionId: response.data.sessionId,
      });

      if (result.error) {
        console.error("Error redirecting to checkout:", result.error);
      }
    } catch (error) {
      console.error("Error during checkout:", error.message);
    }
  };

  const ProductDisplayIcon = () => (
    <section>
      <div className="product">
        <div className="description">
          <h3>Sponsor Logo</h3>
          <h5>$20.00</h5>
          <h6>This sponsorship option allows you to upload your brand logo that links to your website on the TournaHub homepage. </h6>
          <h6>After paying, you will be able to upload your logo and link URL. Increase your brand visibility with this option!</h6>
        </div>
      </div>
      <button onClick={handleCheckoutIcon}>Make Payment</button>
    </section>
  );

  const ProductDisplayArticle = () => (
    <section>
      <div className="product">
        <div className="description">
          <h3>Sponsored Article</h3>
          <h5>$50.00</h5>
          <h6>This sponsorship option allows you to send us a request for a paid article. </h6>
          <h6>Sponsored articles allow us to help you promote your brand or a specified product!</h6>
        </div>
      </div>
      <button onClick={handleCheckoutArticle}>Make Payment</button>
    </section>
  );

  const ProductDisplayTournament = () => (
    <section>
      <div className="product">
        <div className="description">
          <h3>Sponsor Tournament</h3>
          <h5>$50.00</h5>
          <h6>This sponsorship option allows you to sponsor a tournament. </h6>
          <h6>After paying, you brand's logo will appear on the top of the tournament details page. Increase your brand visibility with this option!</h6>
        </div>
      </div>
      <button onClick={handleCheckoutTournament}>Make Payment</button>
    </section>
  );

  return (
    <>
      <NavbarS />
      <h1>Sponsorship Options:</h1>
      <ProductDisplayIcon />
      <ProductDisplayTournament/>
      <ProductDisplayArticle />
    </>
  );
}

export default SponsorshipModels;




